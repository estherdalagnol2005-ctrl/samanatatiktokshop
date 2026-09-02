import { getExitOfferConfig } from "../../exit-offer-config";
import {
  getExitOfferStore,
  hashValue,
  honeypotHasValue,
  parseCookie,
  recordAttemptAndLead,
  requestIp,
  sameOrigin,
  sanitizeLead,
  verifySignedSession,
} from "../../exit-offer-security";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const MAX_PAYLOAD_BYTES = 8_192;

export async function POST(request: Request) {
  if (!sameOrigin(request)) return response("Solicitação inválida.", 403);
  if (Number(request.headers.get("content-length") ?? 0) > MAX_PAYLOAD_BYTES) return response("Solicitação inválida.", 413);

  let payload: Record<string, unknown>;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > MAX_PAYLOAD_BYTES) return response("Solicitação inválida.", 413);
    payload = JSON.parse(text) as Record<string, unknown>;
  } catch {
    return response("Solicitação inválida.", 400);
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return response("Solicitação inválida.", 400);
  if (honeypotHasValue(payload.website)) return Response.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
  const lead = sanitizeLead(payload);
  if (!lead) return response("Confira nome, e-mail e WhatsApp.", 422);

  const session = await verifySignedSession(parseCookie(request, "exit_offer_session"));
  if (!session) return response("Atualize a página e tente novamente.", 403);

  const store = getExitOfferStore();
  if (!store) return response("Oferta indisponível. Tente novamente mais tarde.", 503);
  const config = getExitOfferConfig();
  // TODO: configurar COUPON_CODE e/ou DISCOUNT_CHECKOUT_URL na Vercel.
  // Não registrar uma conversão nem salvar o lead se não houver benefício configurado.
  if (!config.couponCode && !config.discountCheckoutUrl) return response("Oferta indisponível. Tente novamente mais tarde.", 503);

  try {
    const now = Date.now();
    const ipHash = await hashValue(`ip:${requestIp(request)}`);
    const emailHash = await hashValue(`email:${lead.email}`);
    const phoneHash = await hashValue(`phone:${lead.phone}`);
    const sessionHash = await hashValue(`session:${session.nonce}:${session.issuedAt}`);
    const dedupeKey = await hashValue(`lead:${lead.email}:${lead.phone}`);
    const attempt = await recordAttemptAndLead(store, {
      ipHash,
      emailHash,
      phoneHash,
      sessionHash,
      dedupeKey,
      lead,
      now,
    });
    if (attempt.limited) {
      return response("Muitas tentativas. Aguarde alguns minutos e tente novamente.", 429);
    }

    return Response.json({
      success: true,
      couponCode: config.couponCode,
      discountCheckoutUrl: config.discountCheckoutUrl,
      suppressionDays: config.suppressionDays,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    console.error(JSON.stringify({ event: "exit_offer_storage_error" }));
    return response("Não foi possível liberar a condição agora. Tente novamente mais tarde.", 503);
  }
}

function response(error: string, status: number) {
  return Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}
