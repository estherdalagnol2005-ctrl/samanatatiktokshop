import { getExitOfferConfig } from "./exit-offer-config";

const encoder = new TextEncoder();
const RATE_LIMITS = [
  { maximum: 12, windowMs: 60 * 60 * 1000 },
  { maximum: 4, windowMs: 60 * 60 * 1000 },
  { maximum: 4, windowMs: 60 * 60 * 1000 },
  { maximum: 5, windowMs: 60 * 60 * 1000 },
  { maximum: 3, windowMs: 60 * 60 * 1000 },
] as const;

const LEAD_KEY_PREFIX = "exit-offer:lead:v1:";
const LEAD_INDEX_KEY = "exit-offer:lead-index:v1";

const ATOMIC_RECORD_ATTEMPT = `
local now = tonumber(ARGV[1])
local attemptId = ARGV[2]
local encryptedLead = ARGV[3]
local leadTtlSeconds = tonumber(ARGV[4])
local dedupeKey = ARGV[5]

for index = 1, 5 do
  local argumentOffset = 6 + ((index - 1) * 2)
  local windowMs = tonumber(ARGV[argumentOffset])
  local maximum = tonumber(ARGV[argumentOffset + 1])
  redis.call("ZREMRANGEBYSCORE", KEYS[index], "-inf", now - windowMs)
  if redis.call("ZCARD", KEYS[index]) >= maximum then
    return { 0, index }
  end
end

for index = 1, 5 do
  local argumentOffset = 6 + ((index - 1) * 2)
  local windowMs = tonumber(ARGV[argumentOffset])
  redis.call("ZADD", KEYS[index], now, attemptId)
  redis.call("PEXPIRE", KEYS[index], windowMs)
end

redis.call("SET", KEYS[6], encryptedLead, "EX", leadTtlSeconds)
redis.call("ZREMRANGEBYSCORE", KEYS[7], "-inf", now - (leadTtlSeconds * 1000))
redis.call("ZADD", KEYS[7], now, dedupeKey)
return { 1, 0 }
`;

export type SanitizedLead = {
  name: string;
  email: string;
  phone: string;
  marketingConsent: boolean;
};

export type StoredExitOfferLead = SanitizedLead & {
  createdAt: number;
  updatedAt: number;
  consentAt: number | null;
  source: "exit-offer";
};

export type ExitOfferSession = { issuedAt: number; nonce: string };

type UpstashResponse<T> = { result?: T; error?: string };
export type UpstashStore = { command<T>(command: unknown[]): Promise<T> };

export class ExitOfferStorageUnavailable extends Error {}

export function getExitOfferStore(): UpstashStore | null {
  const config = getExitOfferConfig();
  if (!config.upstashRedisRestUrl || !config.upstashRedisRestToken) return null;

  return {
    async command<T>(command: unknown[]): Promise<T> {
      let response: Response;
      try {
        response = await fetch(config.upstashRedisRestUrl!, {
          method: "POST",
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${config.upstashRedisRestToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(command),
        });
      } catch {
        throw new ExitOfferStorageUnavailable();
      }

      if (!response.ok) throw new ExitOfferStorageUnavailable();
      const payload = await response.json() as UpstashResponse<T>;
      if (payload.error) throw new ExitOfferStorageUnavailable();
      return payload.result as T;
    },
  };
}

export function sanitizeLead(value: unknown): SanitizedLead | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  const name = sanitizeText(record.name, 2, 80);
  const email = sanitizeEmail(record.email);
  const phone = sanitizeWhatsApp(record.whatsapp);
  const marketingConsent = record.marketingConsent === true;
  return name && email && phone ? { name, email, phone, marketingConsent } : null;
}

export function honeypotHasValue(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function sanitizeText(value: unknown, minimumLength: number, maximumLength: number): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.normalize("NFKC").replace(/[\u0000-\u001F\u007F]/g, "").replace(/\s+/g, " ").trim();
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
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")?.trim()
    || "unknown";
}

export async function hashValue(value: string): Promise<string> {
  const config = getExitOfferConfig();
  const secret = config.rateLimitSecret ?? config.hmacSecret;
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
  if (!secureTextEquals(signature, expected)) return null;
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

export async function recordAttemptAndLead(
  store: UpstashStore,
  input: { ipHash: string; emailHash: string; phoneHash: string; sessionHash: string; dedupeKey: string; lead: SanitizedLead; now: number },
): Promise<{ limited: boolean }> {
  const config = getExitOfferConfig();
  const encryptionSecret = config.leadEncryptionSecret ?? config.hmacSecret;
  if (!encryptionSecret) throw new ExitOfferStorageUnavailable();

  const encryptedLead = await encryptLead({
    name: input.lead.name,
    email: input.lead.email,
    phone: input.lead.phone,
    marketingConsent: input.lead.marketingConsent,
    consentAt: input.lead.marketingConsent ? input.now : null,
    source: "exit-offer",
    createdAt: input.now,
    updatedAt: input.now,
  }, encryptionSecret, input.dedupeKey);
  const combinedHash = await hashValue(`combined:${input.ipHash}:${input.emailHash}:${input.phoneHash}:${input.sessionHash}`);
  const result = await store.command<unknown[]>([
    "EVAL",
    ATOMIC_RECORD_ATTEMPT,
    7,
    rateKey(input.ipHash),
    rateKey(input.emailHash),
    rateKey(input.phoneHash),
    rateKey(input.sessionHash),
    rateKey(combinedHash),
    leadKey(input.dedupeKey),
    LEAD_INDEX_KEY,
    input.now,
    crypto.randomUUID(),
    encryptedLead,
    config.leadRetentionDays * 24 * 60 * 60,
    input.dedupeKey,
    ...RATE_LIMITS.flatMap((limit) => [limit.windowMs, limit.maximum]),
  ]);
  return { limited: Number(result?.[0]) !== 1 };
}

export async function listExitOfferLeads(store: UpstashStore, limit = 1000): Promise<StoredExitOfferLead[]> {
  const config = getExitOfferConfig();
  const encryptionSecret = config.leadEncryptionSecret ?? config.hmacSecret;
  if (!encryptionSecret) throw new ExitOfferStorageUnavailable();

  const cappedLimit = Math.min(Math.max(Math.trunc(limit), 1), 5000);
  const cutoff = Date.now() - config.leadRetentionDays * 86_400_000;
  await store.command<number>(["ZREMRANGEBYSCORE", LEAD_INDEX_KEY, "-inf", cutoff]);

  const indexed = await store.command<string[]>(["ZREVRANGE", LEAD_INDEX_KEY, 0, cappedLimit - 1]);
  const ids = new Set(Array.isArray(indexed) ? indexed.filter((value) => typeof value === "string") : []);

  let cursor = "0";
  let scans = 0;
  do {
    const result = await store.command<unknown[]>(["SCAN", cursor, "MATCH", `${LEAD_KEY_PREFIX}*`, "COUNT", 200]);
    cursor = Array.isArray(result) ? String(result[0] ?? "0") : "0";
    const keys = Array.isArray(result?.[1]) ? result[1] as unknown[] : [];
    keys.forEach((value) => {
      if (typeof value !== "string" || !value.startsWith(LEAD_KEY_PREFIX)) return;
      ids.add(value.slice(LEAD_KEY_PREFIX.length));
    });
    scans += 1;
  } while (cursor !== "0" && ids.size < cappedLimit && scans < 50);

  const selectedIds = [...ids].slice(0, cappedLimit);
  if (!selectedIds.length) return [];

  const encryptedValues = await store.command<Array<string | null>>(["MGET", ...selectedIds.map(leadKey)]);
  const records: Array<{ id: string; lead: StoredExitOfferLead }> = [];

  for (let index = 0; index < selectedIds.length; index += 1) {
    const encrypted = Array.isArray(encryptedValues) ? encryptedValues[index] : null;
    if (typeof encrypted !== "string") continue;
    const lead = await decryptLead(encrypted, encryptionSecret, selectedIds[index]);
    if (!lead || lead.updatedAt < cutoff) continue;
    records.push({ id: selectedIds[index], lead });
  }

  if (records.length) {
    await store.command<number>([
      "ZADD",
      LEAD_INDEX_KEY,
      ...records.flatMap(({ id, lead }) => [lead.updatedAt, id]),
    ]);
  }

  return records
    .sort((left, right) => right.lead.updatedAt - left.lead.updatedAt)
    .slice(0, cappedLimit)
    .map(({ lead }) => lead);
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

export function secureTextEquals(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

function rateKey(hash: string): string {
  return `exit-offer:rate:v1:${hash}`;
}

function leadKey(dedupeHash: string): string {
  return `${LEAD_KEY_PREFIX}${dedupeHash}`;
}

async function encryptLead(value: Record<string, unknown>, secret: string, associatedData: string): Promise<string> {
  const material = await crypto.subtle.digest("SHA-256", encoder.encode(secret));
  const key = await crypto.subtle.importKey("raw", material, { name: "AES-GCM" }, false, ["encrypt"]);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: encoder.encode(associatedData) },
    key,
    encoder.encode(JSON.stringify(value)),
  );
  return `${toBase64Url(iv)}.${toBase64Url(new Uint8Array(encrypted))}`;
}

async function decryptLead(value: string, secret: string, associatedData: string): Promise<StoredExitOfferLead | null> {
  const [ivPart, encryptedPart, extra] = value.split(".");
  if (!ivPart || !encryptedPart || extra) return null;

  try {
    const material = await crypto.subtle.digest("SHA-256", encoder.encode(secret));
    const key = await crypto.subtle.importKey("raw", material, { name: "AES-GCM" }, false, ["decrypt"]);
    const iv = fromBase64UrlBytes(ivPart);
    const encryptedBytes = fromBase64UrlBytes(encryptedPart);
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv.buffer as ArrayBuffer, additionalData: encoder.encode(associatedData) },
      key,
      encryptedBytes.buffer as ArrayBuffer,
    );
    const parsed = JSON.parse(new TextDecoder().decode(decrypted)) as Record<string, unknown>;
    const name = sanitizeText(parsed.name, 2, 80);
    const email = sanitizeEmail(parsed.email);
    const phone = sanitizeWhatsApp(parsed.phone);
    const createdAt = Number(parsed.createdAt);
    const updatedAt = Number(parsed.updatedAt);
    if (!name || !email || !phone || !Number.isFinite(createdAt) || !Number.isFinite(updatedAt)) return null;
    const marketingConsent = parsed.marketingConsent === true;
    const rawConsentAt = parsed.consentAt === null || parsed.consentAt === undefined ? NaN : Number(parsed.consentAt);
    return {
      name,
      email,
      phone,
      marketingConsent,
      consentAt: marketingConsent && Number.isFinite(rawConsentAt) ? rawConsentAt : null,
      source: "exit-offer",
      createdAt,
      updatedAt,
    };
  } catch {
    return null;
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
  return new TextDecoder().decode(fromBase64UrlBytes(value));
}

function fromBase64UrlBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (value.length % 4)) % 4);
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}
