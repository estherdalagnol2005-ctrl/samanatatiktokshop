type ExitOfferEnvironment = {
  COUPON_CODE?: string;
  DISCOUNT_CHECKOUT_URL?: string;
  EXIT_OFFER_HMAC_SECRET?: string;
  EXIT_OFFER_SUPPRESSION_DAYS?: string;
  EXIT_OFFER_RATE_LIMIT_SECRET?: string;
};

const workerEnv = process.env as ExitOfferEnvironment;

export type ExitOfferConfig = {
  couponCode?: string;
  discountCheckoutUrl?: string;
  hmacSecret?: string;
  rateLimitSecret?: string;
  suppressionDays: number;
};

/** Server-only source of truth for the exit offer and its security settings. */
export function getExitOfferConfig(): ExitOfferConfig {
  return {
    couponCode: safeText(workerEnv.COUPON_CODE, 80),
    discountCheckoutUrl: safeHttpsUrl(workerEnv.DISCOUNT_CHECKOUT_URL),
    hmacSecret: safeText(workerEnv.EXIT_OFFER_HMAC_SECRET, 256),
    rateLimitSecret: safeText(workerEnv.EXIT_OFFER_RATE_LIMIT_SECRET, 256),
    suppressionDays: boundedInteger(workerEnv.EXIT_OFFER_SUPPRESSION_DAYS, 7, 1, 90),
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

function boundedInteger(value: string | undefined, fallback: number, minimum: number, maximum: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isInteger(parsed) && parsed >= minimum && parsed <= maximum ? parsed : fallback;
}
