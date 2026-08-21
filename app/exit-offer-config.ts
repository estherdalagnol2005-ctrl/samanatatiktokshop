type ExitOfferEnvironment = {
  COUPON_CODE?: string;
  DISCOUNT_CHECKOUT_URL?: string;
  EXIT_OFFER_HMAC_SECRET?: string;
  EXIT_OFFER_LEAD_ENCRYPTION_SECRET?: string;
  EXIT_OFFER_LEAD_RETENTION_DAYS?: string;
  EXIT_OFFER_SUPPRESSION_DAYS?: string;
  EXIT_OFFER_RATE_LIMIT_SECRET?: string;
  UPSTASH_REDIS_REST_TOKEN?: string;
  UPSTASH_REDIS_REST_URL?: string;
};

const workerEnv = process.env as ExitOfferEnvironment;

export type ExitOfferConfig = {
  couponCode?: string;
  discountCheckoutUrl?: string;
  hmacSecret?: string;
  leadEncryptionSecret?: string;
  leadRetentionDays: number;
  rateLimitSecret?: string;
  suppressionDays: number;
  upstashRedisRestToken?: string;
  upstashRedisRestUrl?: string;
};

/** Server-only source of truth for the exit offer and its security settings. */
export function getExitOfferConfig(): ExitOfferConfig {
  return {
    couponCode: safeText(workerEnv.COUPON_CODE, 80),
    discountCheckoutUrl: safeHttpsUrl(workerEnv.DISCOUNT_CHECKOUT_URL),
    hmacSecret: safeText(workerEnv.EXIT_OFFER_HMAC_SECRET, 256),
    leadEncryptionSecret: safeText(workerEnv.EXIT_OFFER_LEAD_ENCRYPTION_SECRET, 256),
    leadRetentionDays: boundedInteger(workerEnv.EXIT_OFFER_LEAD_RETENTION_DAYS, 180, 1, 365),
    rateLimitSecret: safeText(workerEnv.EXIT_OFFER_RATE_LIMIT_SECRET, 256),
    suppressionDays: boundedInteger(workerEnv.EXIT_OFFER_SUPPRESSION_DAYS, 7, 1, 90),
    upstashRedisRestToken: safeText(workerEnv.UPSTASH_REDIS_REST_TOKEN, 4096),
    upstashRedisRestUrl: safeUpstashUrl(workerEnv.UPSTASH_REDIS_REST_URL),
  };
}

function safeText(value: string | undefined, maximumLength: number): string | undefined {
  const normalized = value?.trim();
  if (!normalized || normalized.length > maximumLength || /[\u0000-\u001F\u007F]/.test(normalized)) {
    return undefined;
  }
  return normalized;
}

function safeHttpsUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function safeUpstashUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return undefined;
  }
  const localRuntime = process.env.NODE_ENV !== "production" && ["127.0.0.1", "localhost"].includes(url.hostname);
  const trustedUpstash = url.protocol === "https:" && url.hostname.endsWith(".upstash.io");
  return trustedUpstash || (localRuntime && ["http:", "https:"].includes(url.protocol))
    ? url.toString().replace(/\/$/u, "")
    : undefined;
}

function boundedInteger(value: string | undefined, fallback: number, minimum: number, maximum: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isInteger(parsed) && parsed >= minimum && parsed <= maximum ? parsed : fallback;
}
