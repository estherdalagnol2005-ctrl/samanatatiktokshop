import { getExitOfferConfig } from "../exit-offer-config";
import { getExitOfferStore, listExitOfferLeads, secureTextEquals, type StoredExitOfferLead } from "../exit-offer-security";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ADMIN_USER = "sunlix";

export async function GET(request: Request) {
  const config = getExitOfferConfig();
  if (!config.adminPassword || config.adminPassword.length < 12) {
    return htmlResponse(
      pageShell("Painel ainda não configurado", "Defina EXIT_OFFER_ADMIN_PASSWORD na Vercel para liberar esta área privada."),
      503,
    );
  }

  if (!isAuthorized(request, config.adminPassword)) {
    return new Response("Autenticação necessária.", {
      status: 401,
      headers: {
        "Cache-Control": "no-store",
        "WWW-Authenticate": 'Basic realm="Sunlix Leads", charset="UTF-8"',
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    });
  }

  const store = getExitOfferStore();
  if (!store) {
    return htmlResponse(
      pageShell("Armazenamento indisponível", "Confira a configuração do Upstash Redis na Vercel."),
      503,
    );
  }

  try {
    const leads = await listExitOfferLeads(store, 2000);
    const url = new URL(request.url);
    if (url.searchParams.get("format") === "csv") return csvResponse(leads);
    return htmlResponse(renderLeadDashboard(leads), 200);
  } catch {
    return htmlResponse(
      pageShell("Não foi possível carregar os leads", "Tente novamente em alguns instantes."),
      503,
    );
  }
}

function isAuthorized(request: Request, expectedPassword: string): boolean {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Basic ")) return false;

  try {
    const decoded = atob(authorization.slice(6));
    const separator = decoded.indexOf(":");
    if (separator < 0) return false;
    const username = decoded.slice(0, separator);
    const password = decoded.slice(separator + 1);
    return secureTextEquals(username, ADMIN_USER) && secureTextEquals(password, expectedPassword);
  } catch {
    return false;
  }
}

function renderLeadDashboard(leads: StoredExitOfferLead[]): string {
  const consented = leads.filter((lead) => lead.marketingConsent).length;
  const rows = leads.map((lead) => `
    <tr>
      <td>${escapeHtml(formatDate(lead.updatedAt))}</td>
      <td><strong>${escapeHtml(lead.name)}</strong></td>
      <td><a href="mailto:${escapeAttribute(lead.email)}">${escapeHtml(lead.email)}</a></td>
      <td><a href="https://wa.me/${escapeAttribute(lead.phone)}">+${escapeHtml(lead.phone)}</a></td>
      <td><span class="consent ${lead.marketingConsent ? "yes" : "no"}">${lead.marketingConsent ? "Sim" : "Não"}</span></td>
      <td>${lead.consentAt ? escapeHtml(formatDate(lead.consentAt)) : "—"}</td>
    </tr>`).join("");

  const content = `
    <main>
      <header class="hero">
        <div>
          <p class="eyebrow">SUNLIX · LEADS</p>
          <h1>Cadastros do modal</h1>
          <p class="subtitle">Dados armazenados de forma criptografada no backend. O consentimento para mensagens é separado do acesso aos 10% OFF.</p>
        </div>
        <a class="download" href="/leads?format=csv">Baixar CSV</a>
      </header>
      <section class="stats">
        <article><strong>${leads.length}</strong><span>leads salvos</span></article>
        <article><strong>${consented}</strong><span>autorizaram mensagens</span></article>
        <article><strong>${leads.length - consented}</strong><span>sem autorização</span></article>
      </section>
      <section class="table-card">
        ${leads.length ? `<div class="table-wrap"><table><thead><tr><th>Data</th><th>Nome</th><th>E-mail</th><th>WhatsApp</th><th>Novidades</th><th>Consentimento</th></tr></thead><tbody>${rows}</tbody></table></div>` : `<div class="empty">Nenhum lead registrado ainda.</div>`}
      </section>
    </main>`;

  return pageShell("Leads Sunlix", content, true);
}

function pageShell(title: string, body: string, bodyIsHtml = false): string {
  const content = bodyIsHtml ? body : `<main class="message"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(body)}</p></main>`;
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive">
<title>${escapeHtml(title)}</title>
<meta name="description" content="Área privada para acompanhamento dos cadastros da Sunlix.">
<link rel="icon" href="/brand/sunlix-logo-night.svg?favicon=sunlix-original-20260902" type="image/svg+xml" sizes="any">
<style>
:root{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#1c171a;background:#f8f7f5}*{box-sizing:border-box}body{margin:0;background:linear-gradient(180deg,#fff 0,#fff7fb 52%,#f0ff27 140%);min-height:100vh}main{width:min(1180px,calc(100% - 32px));margin:0 auto;padding:48px 0 64px}.hero{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:24px}.eyebrow{margin:0 0 8px;color:#fa2095;font-size:12px;font-weight:900;letter-spacing:.14em}.hero h1,.message h1{margin:0;font-size:clamp(34px,5vw,64px);line-height:.95;letter-spacing:-.055em}.subtitle{max-width:720px;margin:14px 0 0;color:#62575d;font-size:14px;line-height:1.5}.download{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 20px;border:2px solid #1c171a;border-radius:999px;background:#f0ff27;color:#1c171a;font-weight:900;text-decoration:none;box-shadow:4px 5px 0 #fa2095}.stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:0 0 18px}.stats article{padding:20px;border:1px solid #e9e1e5;border-radius:20px;background:rgba(255,255,255,.86)}.stats strong{display:block;font-size:32px;letter-spacing:-.04em}.stats span{display:block;margin-top:4px;color:#6f646a;font-size:12px;font-weight:700}.table-card{overflow:hidden;border:1px solid #e9e1e5;border-radius:24px;background:rgba(255,255,255,.92);box-shadow:0 20px 60px rgba(50,15,35,.08)}.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse;min-width:900px}th,td{padding:15px 16px;border-bottom:1px solid #eee7ea;text-align:left;white-space:nowrap;font-size:13px}th{position:sticky;top:0;background:#fff8fb;color:#6a5f65;font-size:10px;letter-spacing:.08em;text-transform:uppercase}td a{color:#1c171a;text-decoration:none}td a:hover{text-decoration:underline}.consent{display:inline-flex;padding:5px 9px;border-radius:999px;font-size:11px;font-weight:900}.consent.yes{background:#efffc8;color:#405000}.consent.no{background:#f4eff1;color:#75686f}.empty{padding:56px 24px;text-align:center;color:#75686f}.message{max-width:760px;padding-top:100px}.message p{color:#62575d;line-height:1.6}@media(max-width:720px){main{width:min(100% - 20px,1180px);padding-top:28px}.hero{align-items:flex-start;flex-direction:column}.download{width:100%}.stats{grid-template-columns:1fr}.hero h1{font-size:42px}}
</style>
</head>
<body>${content}</body>
</html>`;
}

function csvResponse(leads: StoredExitOfferLead[]): Response {
  const lines = [
    ["Data", "Nome", "E-mail", "WhatsApp", "Autorizou novidades", "Consentimento em", "Origem"],
    ...leads.map((lead) => [
      formatDate(lead.updatedAt),
      lead.name,
      lead.email,
      `+${lead.phone}`,
      lead.marketingConsent ? "Sim" : "Não",
      lead.consentAt ? formatDate(lead.consentAt) : "",
      "Modal 10% OFF",
    ]),
  ];
  const csv = `\uFEFF${lines.map((line) => line.map(csvCell).join(",")).join("\r\n")}`;
  return new Response(csv, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/csv; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
      "Content-Disposition": `attachment; filename="sunlix-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

function htmlResponse(html: string, status: number): Response {
  return new Response(html, {
    status,
    headers: {
      "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function csvCell(value: string): string {
  // Impedir fórmulas ao abrir dados de terceiros no Excel/Sheets.
  const text = String(value);
  const safe = /^[\s]*[=+@-]|^[\t\r\n]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

function escapeHtml(value: string): string {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] || character);
}

function escapeAttribute(value: string): string {
  return escapeHtml(value).replace(/`/g, "&#96;");
}
