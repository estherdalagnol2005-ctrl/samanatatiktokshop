import { getExitOfferConfig } from "../../exit-offer-config";
import {
  ensureExitOfferSchema,
  getDatabase,
  hashValue,
  honeypotHasValue,
  isRateLimited,
  isLocalPreview,
  parseCookie,
  recordRateLimitAttempt,
  recordLocalPreviewLead,
  requestIp,
  sameOrigin,
  sanitizeLead,
  verifySignedSession,
} from "../../exit-offer-security";

export const dynamic = "force-dynamic";
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

  if (honeypotHasValue(payload.website)) return Response.json({ success: true });
  const lead = sanitizeLead(payload);
  if (!lead) return response("Confira nome, e-mail e WhatsApp.", 422);

  const session = await verifySignedSession(parseCookie(request, "exit_offer_session"));
  if (!session) return response("Atualize a página e tente novamente.", 403);

  const database = await getDatabase();
  if (!database && !isLocalPreview()) return response("Oferta indisponível. Tente novamente mais tarde.", 503);

  try {
    if (database) await ensureExitOfferSchema(database);
    const now = Date.now();
    const ipHash = await hashValue(`ip:${requestIp(request)}`);
    const emailHash = await hashValue(`email:${lead.email}`);
    const phoneHash = await hashValue(`phone:${lead.phone}`);
    const sessionHash = await hashValue(`session:${session.nonce}:${session.issuedAt}`);
    const dedupeKey = await hashValue(`lead:${lead.email}:${lead.phone}`);
    const rateKeys = [ipHash, emailHash, phoneHash, sessionHash, await hashValue(`combined:${ipHash}:${emailHash}:${phoneHash}:${sessionHash}:${session.issuedAt}`)];

    if (await isRateLimited(database, rateKeys, now)) {
      return response("Muitas tentativas. Aguarde alguns minutos e tente novamente.", 429);
    }

    await recordRateLimitAttempt(database, rateKeys, now);
    if (database) await database.prepare(`
      INSERT INTO exit_offer_leads (dedupe_key, name, email, phone, ip_hash, session_hash, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(dedupe_key) DO UPDATE SET
        name = excluded.name, updated_at = excluded.updated_at, ip_hash = excluded.ip_hash, session_hash = excluded.session_hash
    `).bind(dedupeKey, lead.name, lead.email, lead.phone, ipHash, sessionHash, now, now).run();
    else recordLocalPreviewLead(dedupeKey, lead, now);

    const config = getExitOfferConfig();
    return Response.json({
      success: true,
      couponCode: config.couponCode,
      discountCheckoutUrl: config.discountCheckoutUrl,
      suppressionDays: config.suppressionDays,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return response("Não foi possível liberar a condição agora. Tente novamente mais tarde.", 503);
  }
}

function response(error: string, status: number) {
  return Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}
