// TODO (proprietária): se conectar um domínio próprio, defina SITE_URL com a URL
// HTTPS definitiva e refaça o deploy. O padrão é o endereço oficial já publicado.
const publishedUrl = "https://samanatatiktokshop.vercel.app";
export function getSiteUrl(): string {
  const url = new URL(process.env.SITE_URL || publishedUrl);
  if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("SITE_URL deve conter somente a origem HTTPS do domínio oficial.");
  }
  return url.origin;
}

export const siteTitle = "Sunlix | Mentoria de TikTok Shop com Samanta Vidal";
export const siteDescription = "Conheça a Sunlix, mentoria e comunidade de Samanta Vidal para mulheres que querem vender com estratégia e construir seus resultados no TikTok Shop.";
export const isPreview = process.env.VERCEL_ENV === "preview";
export const indexing = isPreview ? "noindex, nofollow" : "index, follow, max-image-preview:large";

export function publicConfig() {
  // TODO: informar os IDs reais na Vercel. Em branco = nenhum rastreador carregado.
  const ga = process.env.GOOGLE_ANALYTICS_ID || "";
  const clarity = process.env.MICROSOFT_CLARITY_ID || "";
  return {
    gaId: !isPreview && /^G-[A-Z0-9]+$/.test(ga) ? ga : "",
    clarityId: !isPreview && /^[a-z0-9]+$/i.test(clarity) ? clarity : "",
    siteUrl: getSiteUrl(),
  };
}

export function structuredData() {
  const url = getSiteUrl();
  // Não há endereço, telefone comercial, horários ou FAQ publicados.
  // Não declarar LocalBusiness, avaliações agregadas ou informações presumidas.
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${url}/#organization`, name: "Sunlix", url: `${url}/`, logo: { "@type": "ImageObject", url: `${url}/brand/sunlix-logo-night.svg` } },
      { "@type": "Person", "@id": `${url}/#samanta`, name: "Samanta Vidal", url: `${url}/`, image: `${url}/assets/samanta-hero-portrait.webp` },
      { "@type": "WebSite", "@id": `${url}/#website`, url: `${url}/`, name: "Sunlix", inLanguage: "pt-BR", publisher: { "@id": `${url}/#organization` } },
      { "@type": "WebPage", "@id": `${url}/#webpage`, url: `${url}/`, name: siteTitle, description: siteDescription, inLanguage: "pt-BR", isPartOf: { "@id": `${url}/#website` }, about: [{ "@id": `${url}/#organization` }, { "@id": `${url}/#samanta` }] },
    ],
  };
}

export const escapeAttribute = (value: string) => value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
export const jsonForHtml = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

export function seoHead() {
  const url = getSiteUrl();
  const title = escapeAttribute(siteTitle);
  const description = escapeAttribute(siteDescription);
  const image = `${url}/social/sunlix-share.jpg`;
  const verification = process.env.GOOGLE_SITE_VERIFICATION || "";
  return `<title>${title}</title>
<meta name="description" content="${description}">
<meta name="robots" content="${indexing}">
<link rel="canonical" href="${url}/">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="Sunlix">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${url}/">
<meta property="og:image" content="${image}">
<meta property="og:image:secure_url" content="${image}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Sunlix — mentoria de TikTok Shop com Samanta Vidal">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${image}">
<meta name="twitter:image:alt" content="Sunlix — mentoria de TikTok Shop com Samanta Vidal">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
${verification ? `<meta name="google-site-verification" content="${escapeAttribute(verification)}">` : "<!-- TODO: GOOGLE_SITE_VERIFICATION: inserir o conteúdo da meta tag fornecida pelo Search Console, se usar verificação HTML. -->"}
<script type="application/ld+json">${jsonForHtml(structuredData())}</script>
<script id="sunlix-public-config" type="application/json">${jsonForHtml(publicConfig())}</script>`;
}
