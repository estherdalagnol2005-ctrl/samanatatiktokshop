export type ExitIntentBenefit =
  | { mode: "pending"; couponCode: null; checkoutUrl: null }
  | { mode: "coupon"; couponCode: string; checkoutUrl: null }
  | { mode: "checkout"; couponCode: null; checkoutUrl: string };

/**
 * Único ponto de configuração da oferta de exit intent.
 *
 * Enquanto a Kiwify não fornecer o método oficial, mantenha `mode: "pending"`.
 * Depois, altere somente `benefit` para uma das opções abaixo:
 *
 * Cupom:
 *   { mode: "coupon", couponCode: "CUPOM_OFICIAL", checkoutUrl: null }
 *
 * Checkout promocional oficial:
 *   { mode: "checkout", couponCode: null, checkoutUrl: "https://pay.kiwify.com.br/..." }
 */
export const exitIntentOffer = {
  discountPercent: 10,
  benefit: {
    mode: "pending",
    couponCode: null,
    checkoutUrl: null,
  } satisfies ExitIntentBenefit,
  limits: {
    ip: { max: 10, windowSeconds: 60 * 60 },
    identity: { max: 3, windowSeconds: 24 * 60 * 60 },
    session: { max: 4, windowSeconds: 60 * 60 },
    acceptedCooldownSeconds: 30,
    grantSeconds: 30 * 24 * 60 * 60,
  },
} as const;
