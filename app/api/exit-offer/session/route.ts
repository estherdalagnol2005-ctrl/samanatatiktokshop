import { createSignedSession, sameOrigin } from "../../../exit-offer-security";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Solicitação inválida." }, { status: 403 });

  const signedSession = await createSignedSession();
  if (!signedSession) return Response.json({ error: "Oferta indisponível." }, { status: 503 });

  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return Response.json(
    { ready: true },
    {
      headers: {
        "Cache-Control": "no-store",
        "Set-Cookie": `exit_offer_session=${encodeURIComponent(signedSession.value)}; Path=/; Max-Age=1800; HttpOnly; SameSite=Lax${secure}`,
      },
    },
  );
}
