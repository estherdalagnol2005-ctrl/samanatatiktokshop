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
    "SAMANTA + LUANA · COMUNIDADE SANGUE",
  )
  .replaceAll("O VÍDEO QUE VENDE", "DUAS SÓCIAS.")
  .replaceAll("COMEÇA ANTES", "UM SÓ MÉTODO.")
  .replaceAll("de você apertar gravar.", "Mais mulheres lucrando.")
  .replaceAll(
    "Antes da câmera ligar, existe um caminho. Role para acompanhar como uma ideia ganha intenção e se transforma em uma operação que pode ser repetida.",
    "Samanta e sua sócia, Luana, trabalham lado a lado na Comunidade Sangue. Com um método próprio — da escolha do produto à leitura dos resultados — elas ajudam mulheres a transformar conteúdo em uma operação lucrativa e repetível no TikTok Shop.",
  )
  .replace(
    "</head>",
    '<meta name="theme-color" content="#fa2095"/><meta name="apple-mobile-web-app-capable" content="yes"/><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/><link rel="stylesheet" href="/site-overrides.css"/><link rel="stylesheet" href="/third-fold-partners-v1.css"/><link rel="stylesheet" href="/density-and-gallery-v1.css"/><link rel="stylesheet" href="/third-fold-layout-v2.css"/><link rel="stylesheet" href="/student-proof-v1.css?v=7"/><link rel="stylesheet" href="/gradient-flow-v1.css"/><link rel="stylesheet" href="/gallery-coverflow-v1.css"/><link rel="stylesheet" href="/title-hierarchy-v1.css"/><link rel="stylesheet" href="/conversion-cta-v1.css"/><link rel="stylesheet" href="/footer-v1.css"/><link rel="stylesheet" href="/header-balance-v1.css"/><link rel="stylesheet" href="/motion-effects-v1.css?v=8"/><link rel="stylesheet" href="/community-section-v1.css?v=2"/><link rel="stylesheet" href="/flow-polish-v1.css?v=1"/></head>',
  )
  .replace(
    "</body>",
    '<script src="/third-fold-partners-v1.js" defer></script><script src="/student-proof-v1.js?v=4" defer></script><script src="/gallery-coverflow-v1.js" defer></script><script src="/community-section-v1.js?v=2" defer></script><script src="/conversion-cta-v1.js" defer></script><script src="/footer-v1.js" defer></script><script src="/motion-effects-v1.js?v=9" type="module"></script><script src="/mobile-scroll-tuning-v1.js?v=1" type="module"></script></body>',
  );

export function GET() {
  return new Response(optimizedHtml, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
