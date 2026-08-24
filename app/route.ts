import { readFileSync } from "node:fs";
import { join } from "node:path";

export const dynamic = "force-static";

const snapshotHtml = readFileSync(
  join(process.cwd(), "recovery", "index.html"),
  "utf8",
);

const optimizedHtml = snapshotHtml
  .replaceAll(
    "width=device-width, initial-scale=1",
    "width=device-width, initial-scale=1, viewport-fit=cover",
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
  .replaceAll("O VÍDEO QUE VENDE", "O método que")
  .replaceAll("COMEÇA ANTES", "ESCALOU MINHAS")
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
    "</head>",
    '<meta name="theme-color" content="#fa2095"/><meta name="apple-mobile-web-app-capable" content="yes"/><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/><link rel="preload" href="/assets/samanta-hero-portrait.webp" as="image"/><link rel="stylesheet" href="/site-overrides.css?v=3"/><link rel="stylesheet" href="/density-and-gallery-v1.css"/><link rel="stylesheet" href="/student-proof-v1.css?v=14"/><link rel="stylesheet" href="/gradient-flow-v1.css"/><link rel="stylesheet" href="/gallery-coverflow-v1.css?v=4"/><link rel="stylesheet" href="/title-hierarchy-v1.css"/><link rel="stylesheet" href="/conversion-cta-v1.css"/><link rel="stylesheet" href="/footer-v1.css"/><link rel="stylesheet" href="/header-balance-v1.css?v=3"/><link rel="stylesheet" href="/site-navigation-v1.css?v=2"/><link rel="stylesheet" href="/motion-effects-v1.css?v=8"/><link rel="stylesheet" href="/community-section-v1.css?v=9"/><link rel="stylesheet" href="/home-story-v1.css?v=1"/><link rel="stylesheet" href="/method-sales-v3.css?v=8"/><link rel="stylesheet" href="/flow-polish-v1.css?v=2"/><link rel="stylesheet" href="/exit-offer.css"/></head>',
  )
  .replace(
    "</body>",
    '<script src="/student-proof-v1.js?v=12" defer></script><script src="/gallery-coverflow-v1.js?v=4" defer></script><script src="/method-sales-v3.js?v=6" defer></script><script src="/community-section-v1.js?v=9" defer></script><script src="/home-story-v1.js?v=1" defer></script><script src="/conversion-cta-v1.js?v=2" defer></script><script src="/footer-v1.js?v=2" defer></script><script src="/checkout-links-v1.js?v=4" defer></script><script src="/site-navigation-v1.js?v=2" defer></script><script src="/hero-photo-v1.js?v=1" defer></script><script src="/motion-effects-v1.js?v=9" type="module"></script><script src="/mobile-scroll-tuning-v1.js?v=1" type="module"></script><script src="/exit-offer.js" defer></script></body>',
  );

export function GET() {
  return new Response(optimizedHtml, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
