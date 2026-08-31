import { readFileSync } from "node:fs";
import { join } from "node:path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const snapshotHtml = readFileSync(
  join(process.cwd(), "recovery", "index.html"),
  "utf8",
);

const optimizedHtml = snapshotHtml
  .replaceAll(
    "width=device-width, initial-scale=1",
    "width=device-width, initial-scale=1, viewport-fit=cover",
  )
  .replaceAll("Samanta TikTok Shop", "Sunlix | TikTok Shop")
  .replaceAll(
    "Aprenda com Samanta Vidal a transformar conteúdo em uma operação de vendas no TikTok Shop.",
    "Sunlix: método e comunidade para mulheres que querem construir resultados com TikTok Shop.",
  )
  .replaceAll('<meta name="codex-preview" content="development"/>', "")
  .replaceAll("codex-preview", "sunlix-site")
  .replaceAll(
    "/favicon.svg",
    "/brand/sunlix-logo-night.svg?favicon=20260831",
  )
  .replaceAll(
    "O que transforma atenção em compra",
    "O MÉTODO POR TRÁS DAS VENDAS",
  )
  .replaceAll(
    "/assets/metric-top.jpg",
    "/assets/hero-result-march-2026.webp",
  )
  .replaceAll(
    "/assets/metric-bottom.jpg",
    "/assets/hero-result-april-2026.webp",
  )
  .replaceAll(
    "Painel de resultados do TikTok Shop",
    "Resultado real de março de 2026 no TikTok Shop",
  )
  .replaceAll(
    "Resumo de vendas do TikTok Shop",
    "Resultado real de abril de 2026 no TikTok Shop",
  )
  .replaceAll(
    "Um vídeo pode abrir",
    "O método usado pelas top creators",
  )
  .replaceAll(
    "uma operação de vendas.",
    "e 100% validado pelas mentoradas da Sunlix.",
  )
  .replaceAll(
    "O TikTok Shop já reúne atenção, desejo e checkout no mesmo lugar. Na mentoria, você aprende a escolher produtos com demanda, criar o motivo do clique e repetir o que funciona até transformar conteúdo em faturamento.",
    "Eu já fiz R$ 150 mil em 30 dias com o TikTok Shop. Hoje, te ensino o caminho para você construir seus próprios resultados e mudar de vida.",
  )
  .replace(
    '<a class="hero-text-link" href="#jornada">O que faz um vídeo vender? ↓</a>',
    "",
  )
  .replace(
    '<a class="scroll-cue" href="#resultados"',
    '<a class="scroll-cue" href="#depoimentos"',
  )
  .replaceAll("O VÍDEO QUE VENDE", "O método que")
  .replaceAll("COMEÇA ANTES", "escalou minhas")
  .replaceAll("de você apertar gravar.", "vendas.")
  .replaceAll(
    "Antes da câmera ligar, existe um caminho. Role para acompanhar como uma ideia ganha intenção e se transforma em uma operação que pode ser repetida.",
    "Da escolha do produto à leitura dos resultados, cada etapa tem uma função: chamar atenção, gerar desejo, conduzir a compra e repetir o que funciona.",
  )
  .replace(
    '<div class="method-photo-frame"><img src="/assets/creator-photo.jpg" alt="Samanta no espaço TikTok Shop"/></div>',
    '<div class="method-photo-frame"><img src="/assets/samanta-hero-portrait.webp" alt="Retrato de Samanta" style="object-position:center 34%"/></div>',
  )
  .replace(
    '<a class="buy-button" href="#jornada"><span>Comprar agora</span><i aria-hidden="true">↗</i></a></header>',
    '<a class="buy-button" href="#jornada"><span>Comprar agora</span><i aria-hidden="true">↗</i></a><button class="mobile-menu-toggle" type="button" aria-label="Abrir menu" aria-controls="mobile-site-menu" aria-expanded="false"><span aria-hidden="true"><i></i><i></i><i></i></span></button></header>',
  )
  .replace(
    "</head>",
    '<meta name="theme-color" content="#fa2095"/><meta name="apple-mobile-web-app-capable" content="yes"/><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/><style>html:not(.site-fold-order-ready) .dreams-section{display:none!important}</style><link rel="preload" href="/assets/samanta-hero-portrait.webp" as="image"/><link rel="stylesheet" href="/site-overrides.css"/><link rel="stylesheet" href="/density-and-gallery-v1.css"/><link rel="stylesheet" href="/student-proof-v1.css"/><link rel="stylesheet" href="/testimonials-video-only-preview.css"/><link rel="stylesheet" href="/gradient-flow-v1.css"/><link rel="stylesheet" href="/gallery-coverflow-v1.css"/><link rel="stylesheet" href="/title-hierarchy-v1.css"/><link rel="stylesheet" href="/conversion-cta-v1.css"/><link rel="stylesheet" href="/footer-v1.css"/><link rel="stylesheet" href="/header-balance-v1.css"/><link rel="stylesheet" href="/site-navigation-v1.css"/><link rel="stylesheet" href="/mobile-menu-premium-v1.css"/><link rel="stylesheet" href="/mobile-menu-glass-v1.css"/><link rel="stylesheet" href="/navigation-final.css"/><link rel="stylesheet" href="/motion-effects-v1.css"/><link rel="stylesheet" href="/community-section-v1.css"/><link rel="stylesheet" href="/method-sales-v3.css"/><link rel="stylesheet" href="/flow-polish-v1.css"/><link rel="stylesheet" href="/section-heading-alignment-v1.css"/><link rel="stylesheet" href="/exit-offer.css"/><link rel="stylesheet" href="/premium-button-effects-v1.css"/><link rel="stylesheet" href="/cta-copy-v1.css"/><link rel="stylesheet" href="/responsive-shell-v1.css"/><link rel="stylesheet" href="/community-uniform-carousel-v1.css"/></head>',
  )
  .replace(
    "</body>",
    '<script src="/student-proof-v1.js"></script><script src="/gallery-coverflow-v1.js" defer></script><script src="/method-sales-v3.js" defer></script><script src="/community-section-v1.js" defer></script><script src="/conversion-cta-v1.js" defer></script><script src="/footer-v1.js" defer></script><script src="/checkout-links-v1.js" defer></script><script src="/site-navigation-v1.js" defer></script><script src="/hero-photo-v1.js" defer></script><script src="/motion-effects-v1.js" type="module"></script><script src="/mobile-scroll-tuning-v1.js" type="module"></script><script src="/exit-offer.js" defer></script><script src="/premium-button-effects-v1.js" defer></script><script src="/cta-copy-v1.js" defer></script></body>',
  );

export function GET() {
  return new Response(optimizedHtml, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
      "CDN-Cache-Control": "no-store",
      "Vercel-CDN-Cache-Control": "no-store",
    },
  });
}
