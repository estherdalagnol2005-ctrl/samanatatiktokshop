import { getExitOfferConfig } from "./exit-offer-config";

type D1DatabaseLike = {
  exec(query: string): Promise<unknown>;
  prepare(query: string): {
    run(): Promise<unknown>;
    bind(...values: unknown[]): {
      all<T = Record<string, unknown>>(): Promise<{ results?: T[] }>;
      run(): Promise<unknown>;
    };
  };
};

const encoder = new TextEncoder();
let schemaPromise: Promise<void> | undefined;
const localRateLimitAttempts = new Map<string, number[]>();
const localPreviewLeads = new Map<string, { name: string; email: string; phone: string; createdAt: number }>();

export type SanitizedLead = { name: string; email: string; phone: string };
export type ExitOfferSession = { issuedAt: number; nonce: string };

export async function getDatabase(): Promise<D1DatabaseLike | null> {
  try {
    const moduleName = ["cloudflare", "workers"].join(":");
    const runtime = await import(/* webpackIgnore: true */ moduleName) as unknown as { env?: { EXIT_OFFER_DB?: D1DatabaseLike } };
    return runtime.env?.EXIT_OFFER_DB ?? null;
  } catch {
    return null;
  }
}

export async function ensureExitOfferSchema(database: D1DatabaseLike): Promise<void> {
  schemaPromise ??= Promise.all([
    database.prepare(`CREATE TABLE IF NOT EXISTS exit_offer_rate_limits (
      key_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )`).run(),
    database.prepare(`CREATE INDEX IF NOT EXISTS exit_offer_rate_limits_lookup
      ON exit_offer_rate_limits (key_hash, created_at)`).run(),
    database.prepare(`CREATE TABLE IF NOT EXISTS exit_offer_leads (
      dedupe_key TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      ip_hash TEXT NOT NULL,
      session_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )`).run(),
  ]).then(() => undefined);
  return schemaPromise;
}

export function sanitizeLead(value: unknown): SanitizedLead | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  const name = sanitizeText(record.name, 2, 80);
  const email = sanitizeEmail(record.email);
  const phone = sanitizeWhatsApp(record.whatsapp);
  return name && email && phone ? { name, email, phone } : null;
}

export function honeypotHasValue(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function sanitizeText(value: unknown, minimumLength: number, maximumLength: number): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.replace(/[\u0000-\u001F\u007F]/g, "").replace(/\s+/g, " ").trim();
  return normalized.length >= minimumLength && normalized.length <= maximumLength ? normalized : null;
}

function sanitizeEmail(value: unknown): string | null {
  const email = sanitizeText(value, 5, 254)?.toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(email)) return null;
  return email;
}

function sanitizeWhatsApp(value: unknown): string | null {
  if (typeof value !== "string") return null;
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) digits = digits.slice(2);
  return /^\d{10,11}$/.test(digits) ? `55${digits}` : null;
}

export function requestIp(request: Request): string {
  const cloudflareIp = request.headers.get("cf-connecting-ip");
  const forwardedIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return cloudflareIp || forwardedIp || "unknown";
}

export async function hashValue(value: string): Promise<string> {
  const secret = getExitOfferConfig().rateLimitSecret ?? getExitOfferConfig().hmacSecret;
  if (!secret) throw new Error("Exit offer security is not configured.");
  return digest(`${secret}:${value}`);
}

export async function createSignedSession(): Promise<{ value: string; session: ExitOfferSession } | null> {
  const secret = getExitOfferConfig().hmacSecret;
  if (!secret) return null;
  const session = { issuedAt: Date.now(), nonce: crypto.randomUUID() };
  const payload = toBase64Url(JSON.stringify(session));
  const signature = await hmac(payload, secret);
  return { value: `${payload}.${signature}`, session };
}

export async function verifySignedSession(value: string | undefined): Promise<ExitOfferSession | null> {
  const secret = getExitOfferConfig().hmacSecret;
  if (!secret || !value) return null;
  const [payload, signature, extra] = value.split(".");
  if (!payload || !signature || extra) return null;
  const expected = await hmac(payload, secret);
  if (!constantTimeEquals(signature, expected)) return null;
  try {
    const parsed = JSON.parse(fromBase64Url(payload)) as ExitOfferSession;
    const age = Date.now() - parsed.issuedAt;
    return typeof parsed.nonce === "string" && parsed.nonce.length >= 20 && age >= 0 && age <= 30 * 60 * 1000
      ? parsed
      : null;
  } catch {
    return null;
  }
}

export async function isRateLimited(database: D1DatabaseLike | null, keys: string[], now: number): Promise<boolean> {
  const windowStart = now - 60 * 60 * 1000;
  const limits = [12, 4, 4, 5, 3];
  if (!database) {
    return keys.some((key, index) => (localRateLimitAttempts.get(key) ?? []).filter((timestamp) => timestamp >= windowStart).length >= limits[index]);
  }
  for (let index = 0; index < keys.length; index += 1) {
    const result = await database.prepare(
      "SELECT COUNT(*) AS count FROM exit_offer_rate_limits WHERE key_hash = ? AND created_at >= ?",
    ).bind(keys[index], windowStart).all<{ count: number }>();
    if ((result.results?.[0]?.count ?? 0) >= limits[index]) return true;
  }
  return false;
}

export async function recordRateLimitAttempt(database: D1DatabaseLike | null, keys: string[], now: number): Promise<void> {
  if (!database) {
    const windowStart = now - 60 * 60 * 1000;
    keys.forEach((key) => localRateLimitAttempts.set(key, [...(localRateLimitAttempts.get(key) ?? []).filter((timestamp) => timestamp >= windowStart), now]));
    return;
  }
  await Promise.all(keys.map((key) => database.prepare(
    "INSERT INTO exit_offer_rate_limits (key_hash, created_at) VALUES (?, ?)",
  ).bind(key, now).run()));
}

export function isLocalPreview(): boolean {
  return process.env.NODE_ENV === "development";
}

export function recordLocalPreviewLead(dedupeKey: string, lead: SanitizedLead, now: number): void {
  localPreviewLeads.set(dedupeKey, { ...lead, createdAt: localPreviewLeads.get(dedupeKey)?.createdAt ?? now });
}

export function parseCookie(request: Request, name: string): string | undefined {
  const cookie = request.headers.get("cookie") ?? "";
  const pair = cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`));
  return pair ? decodeURIComponent(pair.slice(name.length + 1)) : undefined;
}

export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const originUrl = new URL(origin);
    const requestHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return Boolean(requestHost) && originUrl.host === requestHost && ["http:", "https:"].includes(originUrl.protocol);
  } catch {
    return false;
  }
}

async function digest(value: string): Promise<string> {
  const result = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return toBase64Url(new Uint8Array(result));
}

async function hmac(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const result = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return toBase64Url(new Uint8Array(result));
}

function toBase64Url(input: string | Uint8Array): string {
  const bytes = typeof input === "string" ? encoder.encode(input) : input;
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (value.length % 4)) % 4);
  return new TextDecoder().decode(Uint8Array.from(atob(padded), (character) => character.charCodeAt(0)));
}

function constantTimeEquals(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}
