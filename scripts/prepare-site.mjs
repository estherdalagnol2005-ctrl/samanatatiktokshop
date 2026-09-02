// Gera HTML completo e um par CSS/JS versionado, sem alterar a ordem da cascata.
// Os templates dos componentes existentes continuam sendo a fonte única do texto.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { runInNewContext } from "node:vm";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
// Compiladores já incluídos na versão fixada de Next; sem runtime extra no cliente.
const nextRequire = createRequire(require.resolve("next/package.json"));
const postcss = nextRequire("postcss");
const cssnano = require("next/dist/compiled/cssnano-simple");
const { minify } = require("next/dist/compiled/terser");
const read = path => readFileSync(path, "utf8");
const checkoutUrl = "https://pay.kiwify.com.br/3U3ri1Z";
const template = (file, context = {}, target = "section") => {
  const code = read(`public/${file}`);
  const literal = code.match(new RegExp(`${target}\\.innerHTML = (\\x60[\\s\\S]*?\\x60);`))?.[1];
  if (!literal) throw new Error(`Template não encontrado: ${file}`);
  return runInNewContext(literal, { checkoutUrl, ...context }, { timeout: 1000 });
};
const array = (file, name) => {
  const literal = read(`public/${file}`).match(new RegExp(`const ${name} = (\\[[\\s\\S]*?\\n  \\]);`))?.[1];
  if (!literal) throw new Error(`Dados não encontrados: ${file} / ${name}`);
  return runInNewContext(literal, {}, { timeout: 1000 });
};
const section = (id, classes, label, body) => `<section id="${id}" class="${classes}" aria-labelledby="${label}">${body}</section>`;
let html = read("recovery/index.html");
html = html.replace(/<title>[\s\S]*?<\/title>/, "<!-- SITE_SEO_HEAD -->")
  .replace(/<meta name="description"[^>]*>/, "")
  .replace(/<link rel="(?:shortcut icon|icon)"[^>]*>/g, "")
  .replace(/<style>html:not\(\.site-fold-order-ready\)[\s\S]*?<\/style>/, "")
  .replace('class="gsap-motion"', 'class="gsap-motion site-fold-order-ready"');
const proof = section("depoimentos", "student-proof-section student-proof-video-only-section", "student-proof-title", template("student-proof-v1.js"));
const method = section("jornada", "method-section method-sales-section", "method-sales-title", template("method-sales-v3.js", { steps: array("method-sales-v3.js", "steps") }));
const items = array("community-section-v1.js", "carouselItems");
const cards = items.map((item, i) => `<figure class="community-uniform-card${i === 2 ? " is-active" : i === 1 || i === 3 ? " is-near" : " is-distant"}" data-slot="${i === 2 ? "active" : i === 1 ? "previous" : i === 3 ? "next" : "hidden"}"${i === 2 ? ' aria-current="true"' : ""}><img src="${item.src}" alt="${item.alt}" loading="lazy" decoding="async" draggable="false"></figure>`).join("");
const dots = items.map((_, i) => `<button class="community-uniform-dot${i === 2 ? " is-active" : ""}" type="button" aria-label="Ver imagem ${i + 1}"${i === 2 ? ' aria-current="true"' : ""}></button>`).join("");
const community = section("comunidade", "community-section community-uniform-section", "community-title", template("community-section-v1.js", { cards, dots }));
const conversion = section("inscricao", "conversion-section", "conversion-title", template("conversion-cta-v1.js"));
const footer = `<footer class="site-footer" aria-label="Rodapé">${template("footer-v1.js", {}, "footer")}</footer>`;
// Preservar a ordem DOM original. As regras CSS order mantêm a galeria
// visualmente entre comunidade e indicação, como na produção existente.
const marquee = html.match(/<div class="dreams-marquee"[\s\S]*?<\/div><\/div><\/div>/)?.[0];
if (!marquee) throw new Error("Faixa de transição não encontrada");
html = html.replace(marquee, "");
html = html.replace('<section class="dreams-section"', `${marquee.replace('class="dreams-marquee"', 'class="dreams-marquee site-gradient-marquee"')}${proof}${community}${method}${conversion}${footer}<section class="dreams-section"`);
// Todos os CTAs comerciais já têm destino correto mesmo sem JavaScript.
html = html.replace(/https:\/\/pay\.kiwify\.com\.br\/3U3ri1Z[^"\s<]*/g, checkoutUrl)
  .replace(/(<a class="(?:buy-button|hero-primary-cta|dreams-showcase-cta|dreams-cta)" href=")[^"]+/g, `$1${checkoutUrl}`);
// Prioridade apenas à foto principal. Decorações não disputam a banda inicial.
html = html.replace(/<link rel="preload"[^>]*>/g, "")
  .replace('</head>', '<link rel="preload" href="/brand/nagoku-black.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/brand/tiktok-sans-variable.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/assets/samanta-hero-portrait.webp" as="image" fetchpriority="high"></head>')
  .replace('src="/assets/samanta-hero-portrait.webp"', 'src="/assets/samanta-hero-portrait.webp" fetchpriority="high" decoding="async"');
// Fixar dimensões intrínsecas sem mudar tamanhos definidos no CSS.
const sharp = require("sharp");
const images = [...html.matchAll(/<img\b[^>]*src="([^"]+)"[^>]*>/g)];
for (const [tag, src] of images) {
  const meta = await sharp(`public${src}`).metadata();
  if (meta.width && meta.height) html = html.replace(tag, tag.replace(/\/?>(?![\s\S])/, ` width="${meta.width}" height="${meta.height}">`));
}
const cssFiles = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"\/?\s*>/g)].map(m => m[1]);
let css = cssFiles.map(path => read(`public${path}`)).join("\n");
css = css.replaceAll('/brand/nagoku-black.otf', '/brand/nagoku-black.woff2').replaceAll('format("opentype")', 'format("woff2")')
  .replaceAll('/brand/tiktok-sans-variable.ttf', '/brand/tiktok-sans-variable.woff2').replaceAll('format("truetype")', 'format("woff2")');
const compressedCss = (await postcss([cssnano({ preset: ["default", { mergeRules: false, discardDuplicates: false }] })]).process(css, { from: undefined })).css;
const scripts = [...html.matchAll(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/g)].map(m => m[1]);
const js = [...scripts, "/analytics.js"].map(path => read(`public${path}`).replace(/https:\/\/pay\.kiwify\.com\.br\/3U3ri1Z[^"\s<]*/g, checkoutUrl)).join("\n;\n");
const compressedJs = (await minify(js, { compress: true, mangle: true, format: { comments: /^!/ } })).code;
const hashed = (content, extension) => `site-${createHash("sha256").update(content).digest("hex").slice(0, 12)}.${extension}`;
mkdirSync("public/static", { recursive: true });
const cssFile = hashed(compressedCss, "css");
const jsFile = hashed(compressedJs, "js");
writeFileSync(`public/static/${cssFile}`, compressedCss);
writeFileSync(`public/static/${jsFile}`, compressedJs);
let firstCss = true;
html = html.replace(/<link rel="stylesheet"[^>]*>/g, () => { if (!firstCss) return ""; firstCss = false; return `<link rel="stylesheet" href="/static/${cssFile}">`; });
html = html.replace(/<script\b[^>]*src="[^"]+"[^>]*><\/script>/g, "").replace('</body>', `<script src="/static/${jsFile}" defer></script></body>`);
writeFileSync("recovery/generated.html", html);
console.log(JSON.stringify({ htmlBytes: Buffer.byteLength(html), cssFiles: cssFiles.length, cssBefore: Buffer.byteLength(css), cssAfter: Buffer.byteLength(compressedCss), jsBefore: Buffer.byteLength(js), jsAfter: Buffer.byteLength(compressedJs) }));
