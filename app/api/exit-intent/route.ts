import { createHash, createHmac } from "node:crypto";

import { getCache, type RuntimeCache } from "@vercel/functions";
import { NextResponse } from "next/server";

import { exitIntentOffer, type ExitIntentBenefit } from "../../exit-intent/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 8 * 1024;
const MIN_FORM_TIME_MS = 2_500;
const MAX_FORM_TIME_MS = 30 * 60 * 1_000;
const SESSION_PATTERN = /^[a-zA-Z0-9_-]{16,80}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_PATTERN = /^[\p{L}\p{M}' .-]+$/u;

type Limit = { max: number; windowSeconds: number };
type CountRecord = { count: number };

const locks = new Map<string, Promise<void>>();

function json(
  body: Record<string, unknown>,
  status = 200,
  extraHeaders: Record<string, string> = {},
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
  });
}

function safeMessage(status: number) {
  if (status === 400) return "Revise os dados informados e tente novamente.";
  if (status === 429) return "Muitas tentativas em pouco tempo. Aguarde e tente novamente.";
  return "Não foi possível validar sua solicitação agora. Tente novamente em instantes.";
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function sanitizeName(value: unknown) {
  if (typeof value !== "string") return null;
  const normalized = value
    .normalize("NFKC")
    .replace(/[<>\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (normalized.length < 2 || normalized.length > 80 || !NAME_PATTERN.test(normalized)) {
    return null;
  }
  return normalized;
}

function sanitizeEmail(value: unknown) {
  if (typeof value !== "string") return null;
  const normalized = value.normalize("NFKC").trim().toLowerCase();
  if (normalized.length < 5 || normalized.length > 160 || !EMAIL_PATTERN.test(normalized)) {
    return null;
  }
  return normalized;
}

function sanitizePhone(value: unknown) {
  if (typeof value !== "string") return null;
  const digits = value.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15 || /^(\d)\1+$/.test(digits)) return null;
  return digits;
}

function readIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unavailable";
}

function hashSignal(value: string) {
  const secret =
    process.env.EXIT_INTENT_HASH_SECRET ||
    process.env.VERCEL_PROJECT_ID ||
    "samanta-exit-intent-pseudonym-v1";
  return createHmac("sha256", secret).update(value).digest("hex");
}

function hashIdentity(email: string, phone: string) {
  return createHash("sha256").update(`${hashSignal(email)}:${hashSignal(phone)}`).digest("hex");
}

function originIsAllowed(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

async function withLock<T>(key: string, task: () => Promise<T>) {
  const previous = locks.get(key) || Promise.resolve();
  let release: () => void = () => {};
  const current = new Promise<void>((resolve) => {
    release = () => resolve();
  });
  const queued = previous.then(() => current);
  locks.set(key, queued);
  await previous;
  try {
    return await task();
  } finally {
    release();
    if (locks.get(key) === queued) locks.delete(key);
  }
}

async function consume(cache: RuntimeCache, key: string, limit: Limit) {
  return withLock(key, async () => {
    const current = await cache.get(key);
    const count =
      isPlainObject(current) && typeof current.count === "number" && Number.isFinite(current.count)
        ? Math.max(0, Math.floor(current.count))
        : 0;
    if (count >= limit.max) return false;
    await cache.set(key, { count: count + 1 } satisfies CountRecord, {
      ttl: limit.windowSeconds,
      name: "",
    });
    return true;
  });
}

function windowedKey(prefix: string, signal: string, seconds: number) {
  return `${prefix}:${signal}:${Math.floor(Date.now() / (seconds * 1_000))}`;
}

function publicBenefit(benefit: ExitIntentBenefit) {
  if (benefit.mode === "coupon" && benefit.couponCode.trim()) {
    return { kind: "coupon", couponCode: benefit.couponCode.trim(), checkoutUrl: null };
  }
  if (benefit.mode === "checkout") {
    try {
      const url = new URL(benefit.checkoutUrl);
      if (url.protocol === "https:") {
        return { kind: "checkout", couponCode: null, checkoutUrl: url.toString() };
      }
    } catch {
      // Configuração incompleta deve falhar para o estado seguro abaixo.
    }
  }
  return { kind: "pending", couponCode: null, checkoutUrl: null };
}

function acceptedResponse(alreadyRegistered = false) {
  return json({
    ok: true,
    alreadyRegistered,
    discountPercent: exitIntentOffer.discountPercent,
    benefit: publicBenefit(exitIntentOffer.benefit),
  });
}

export async function POST(request: Request) {
  try {
    if (!originIsAllowed(request)) {
      return json({ ok: false, message: safeMessage(400) }, 403);
    }

    if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
      return json({ ok: false, message: safeMessage(400) }, 415);
    }

    const declaredLength = Number(request.headers.get("content-length") || 0);
    if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
      return json({ ok: false, message: safeMessage(400) }, 413);
    }

    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
      return json({ ok: false, message: safeMessage(400) }, 413);
    }

    let payload: unknown;
    try {
      payload = JSON.parse(raw);
    } catch {
      return json({ ok: false, message: safeMessage(400) }, 400);
    }
    if (!isPlainObject(payload)) return json({ ok: false, message: safeMessage(400) }, 400);

    const cache = getCache({ namespace: "samanta-exit-intent-v1" });
    const ipHash = hashSignal(readIp(request));
    const ipLimit = exitIntentOffer.limits.ip;
    const ipAllowed = await consume(cache, windowedKey("ip", ipHash, ipLimit.windowSeconds), ipLimit);
    if (!ipAllowed) {
      return json({ ok: false, message: safeMessage(429) }, 429, {
        "Retry-After": String(ipLimit.windowSeconds),
      });
    }

    // Honeypot: resposta neutra evita ensinar ao bot como contornar o filtro.
    if (typeof payload.company === "string" && payload.company.trim()) {
      return json({
        ok: true,
        discountPercent: exitIntentOffer.discountPercent,
        benefit: { kind: "pending", couponCode: null, checkoutUrl: null },
      });
    }

    const name = sanitizeName(payload.name);
    const email = sanitizeEmail(payload.email);
    const phone = sanitizePhone(payload.whatsapp);
    const sessionId = typeof payload.sessionId === "string" ? payload.sessionId.trim() : "";
    const startedAt = typeof payload.startedAt === "number" ? payload.startedAt : Number.NaN;
    const elapsed = Date.now() - startedAt;

    if (
      !name ||
      !email ||
      !phone ||
      !SESSION_PATTERN.test(sessionId) ||
      !Number.isFinite(elapsed) ||
      elapsed < MIN_FORM_TIME_MS ||
      elapsed > MAX_FORM_TIME_MS
    ) {
      return json({ ok: false, message: safeMessage(400) }, 400);
    }

    const identityHash = hashIdentity(email, phone);
    const grantKey = `grant:${identityHash}`;
    if (await cache.get(grantKey)) return acceptedResponse(true);

    const identityLimit = exitIntentOffer.limits.identity;
    const sessionLimit = exitIntentOffer.limits.session;
    const sessionHash = hashSignal(sessionId);
    const [identityAllowed, sessionAllowed] = await Promise.all([
      consume(
        cache,
        windowedKey("identity", identityHash, identityLimit.windowSeconds),
        identityLimit,
      ),
      consume(
        cache,
        windowedKey("session", sessionHash, sessionLimit.windowSeconds),
        sessionLimit,
      ),
    ]);

    if (!identityAllowed || !sessionAllowed) {
      return json({ ok: false, message: safeMessage(429) }, 429, {
        "Retry-After": String(Math.min(identityLimit.windowSeconds, sessionLimit.windowSeconds)),
      });
    }

    const cooldownKey = `cooldown:${ipHash}:${sessionHash}`;
    if (await cache.get(cooldownKey)) {
      return json({ ok: false, message: safeMessage(429) }, 429, {
        "Retry-After": String(exitIntentOffer.limits.acceptedCooldownSeconds),
      });
    }

    const now = new Date().toISOString();
    await Promise.all([
      cache.set(grantKey, { grantedAt: now }, {
        ttl: exitIntentOffer.limits.grantSeconds,
        name: "",
      }),
      cache.set(cooldownKey, { acceptedAt: now }, {
        ttl: exitIntentOffer.limits.acceptedCooldownSeconds,
        name: "",
      }),
    ]);

    return acceptedResponse();
  } catch (error) {
    console.error("Exit intent request failed", error instanceof Error ? error.message : "unknown");
    return json({ ok: false, message: safeMessage(500) }, 503);
  }
}
