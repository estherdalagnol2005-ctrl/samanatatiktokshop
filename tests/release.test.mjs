import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { runInNewContext } from "node:vm";
import sharp from "sharp";
const read = path => readFileSync(path, "utf8");
const html = read("recovery/generated.html");

test("HTML inicial contém conteúdo completo, um H1 e IDs únicos", () => {
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ["top", "depoimentos", "comunidade", "resultados", "jornada", "inscricao"]) assert.ok(ids.includes(id), id);
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(id), `Âncora ausente: ${id}`);
  assert.ok(html.includes('class="site-footer"'));
  assert.equal((html.match(/SITE_SEO_HEAD/g) || []).length, 1);
  assert.ok(!html.includes('visibility:hidden'));
});

test("CSS/JS consolidados, recursos internos presentes e sem GSAP duplicado", () => {
  assert.equal((html.match(/rel="stylesheet"/g) || []).length, 1);
  assert.equal((html.match(/<script\b[^>]*src=/g) || []).length, 1);
  const paths = [...html.matchAll(/(?:src|href|poster)="(\/[^"?#]+)(?:\?[^"#]*)?"/g)].map(m => m[1]);
  for (const path of paths) assert.ok(existsSync(`public${path}`), path);
  const jsPath = html.match(/<script src="([^"]+)"/)[1];
  const js = read(`public${jsPath}`);
  assert.ok(!js.includes('gsap-BEsEDAKg'));
  assert.ok(!js.includes('ScrollTrigger-CcUORopz'));
  assert.ok(!js.includes('PAcGRvZgJleHRu'));
  for (const file of readdirSync('public').filter(name => name.endsWith('.js'))) {
    const source = read(`public/${file}`);
    for (const [, path] of source.matchAll(/["'`](\/(?:assets|brand|videos|testimonials)\/[^"'`?]+)["'`]/g)) assert.ok(existsSync(`public${path}`), `${file}: ${path}`);
  }
});

test("Imagens informativas e vídeos do HTML inicial têm descrições", () => {
  const images = [...html.matchAll(/<img\b[^>]*>/g)];
  assert.ok(images.length >= 18);
  for (const [tag] of images) {
    const alt = tag.match(/\balt="([^"]*)"/);
    assert.ok(alt, `Imagem sem alt: ${tag}`);
    if (!alt[1].trim()) assert.ok(tag.includes('aria-hidden="true"'), `Alt vazio em imagem não decorativa: ${tag}`);
    else assert.ok(!/^(?:imagem|foto|image|photo|\S+\.(?:webp|jpg|png))$/i.test(alt[1]), tag);
  }
  const videos = [...html.matchAll(/<video\b([^>]*)>([\s\S]*?)<\/video>/g)];
  assert.equal(videos.length, 2);
  for (const [, attrs, fallback] of videos) {
    assert.ok(!/\balt=/.test(attrs), 'Vídeo não usa atributo alt');
    const title = attrs.match(/\btitle="([^"]+)"/)?.[1];
    assert.match(title || '', /Depoimento de (Janaína|Yasmin)/);
    assert.ok(attrs.includes(`aria-label="${title}"`));
    const id = attrs.match(/aria-describedby="([^"]+)"/)?.[1];
    assert.ok(id);
    const description = html.match(new RegExp(`<figcaption id="${id}" class="media-description">([^<]+)</figcaption>`));
    assert.ok(description?.[1].length > 30, `Descrição ausente: ${id}`);
    assert.ok(fallback.trim().length > 30);
    assert.ok(attrs.includes('preload="none"'));
  }
});

test("Todos os itens da galeria preservam mídia, alt e descrições associadas", () => {
  // Executa a criação real dos elementos, parando antes de ativar os eventos.
  const nodes = [];
  const rendered = {};
  const showcase = { replaceChildren: node => { rendered.node = node; throw rendered; } };
  const document = {
    readyState: 'complete', documentElement: {},
    querySelector: selector => selector === '.dreams-showcase' ? showcase : null,
    createElement: tag => {
      const node = {tag, attrs: {}, children: [], dataset: {}, style: {}, classList: {add() {}},
        setAttribute(name, value) { this.attrs[name] = value; },
        append(...children) { this.children.push(...children); },
      };
      nodes.push(node);
      return node;
    },
  };
  assert.throws(() => runInNewContext(read('public/gallery-coverflow-v1.js'), {
    document, MutationObserver: class { observe() {} },
  }), error => error === rendered);
  assert.ok(rendered.node);
  const media = nodes.filter(node => ['img', 'video'].includes(node.tag));
  assert.equal(media.length, 15);
  assert.equal(media.filter(node => node.tag === 'video').length, 3);
  const descriptions = nodes.filter(node => node.className === 'media-description');
  assert.equal(descriptions.length, 15);
  assert.equal(new Set(descriptions.map(node => node.id)).size, 15);
  for (const node of media) {
    const slide = nodes.find(parent => parent.children.includes(node));
    const description = descriptions.find(item => item.id === slide.attrs['aria-describedby']);
    assert.ok(description?.textContent.length > 20);
    assert.ok(slide.children.includes(description));
    assert.ok(existsSync(`public${node.src}`));
    if (node.tag === 'img') {
      assert.equal(node.alt, description.textContent);
      assert.equal(node.loading, 'lazy');
    } else {
      assert.ok(node.title.length > 15);
      assert.equal(node.attrs['aria-label'], node.title);
      assert.equal(node.attrs['aria-describedby'], description.id);
      assert.equal(node.textContent, description.textContent);
      assert.equal(node.preload, 'none');
      assert.ok(node.muted && node.loop && node.playsInline);
      assert.ok(existsSync(`public${node.poster}`));
    }
  }
});

test("Favicon, OG e fontes válidos", async () => {
  assert.equal(read('public/icon.svg').trimEnd(), read('public/brand/sunlix-logo-night.svg').trimEnd(), 'O favicon deve manter o logo Sunlix completo');
  const og = await sharp('public/social/sunlix-share.jpg').metadata();
  assert.equal(og.width, 1200); assert.equal(og.height, 630);
  const apple = await sharp('public/apple-touch-icon.png').metadata();
  assert.equal(apple.width, 180); assert.equal(apple.height, 180);
  assert.equal(readFileSync('public/favicon.ico').readUInt16LE(2), 1);
  for (const name of ['nagoku-black', 'tiktok-sans-variable']) assert.equal(readFileSync(`public/brand/${name}.woff2`).subarray(0,4).toString(), 'wOF2');
});

test("Analytics não carrega antes do consentimento; eventos só após confirmação", () => {
  const scripts = []; const events = {}; let reloads = 0;
  const document = { referrer: '', getElementById: () => ({textContent: JSON.stringify({gaId:'G-TEST123',clarityId:'test123',siteUrl:'https://example.com'})}), createElement: () => ({}), head: { append: s => scripts.push(s.src) }, addEventListener: (name, cb) => {events[name] = cb;}, dispatchEvent: () => {} };
  const window = { location: {search:'', reload: () => {reloads++;}} };
  runInNewContext(read('public/analytics.js'), {document,window,navigator:{},Event:class {},URL,URLSearchParams});
  assert.equal(scripts.length, 0);
  events['sunlix:lead-saved'](); assert.equal(scripts.length, 0);
  window.sunlixSetAnalyticsConsent(true);
  assert.equal(scripts.length, 2);
  window.sunlixSetAnalyticsConsent(true); assert.equal(scripts.length, 2);
  events['sunlix:lead-saved']();
  assert.ok(window.dataLayer.some(args => args[1] === 'generate_lead'));
  assert.ok(!JSON.stringify(window.dataLayer).includes('email'));
  window.sunlixSetAnalyticsConsent(false);
  assert.equal(window['ga-disable-G-TEST123'], true); assert.equal(reloads, 1);
});

const base = process.env.TEST_BASE_URL;
test("HTTP: SEO, robots, sitemap, área privada e payloads inválidos", {skip: !base}, async () => {
  const response = await fetch(base);
  const body = await response.text();
  assert.equal(response.status, 200);
  assert.equal((body.match(/<title>/g) || []).length, 1);
  assert.ok(body.includes('name="description"'));
  assert.ok(body.includes('property="og:image"'));
  assert.ok(body.includes('property="og:image:alt"'));
  assert.ok(body.includes('name="twitter:image:alt"'));
  assert.ok(!body.includes('SITE_SEO_HEAD'));
  const schema = JSON.parse(body.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(schema['@graph'].length, 4);
  assert.ok(!JSON.stringify(schema).includes('LocalBusiness'));
  for (const route of ['/robots.txt','/sitemap.xml','/llms.txt','/favicon.ico','/social/sunlix-share.jpg']) assert.equal((await fetch(base+route)).status, 200, route);
  const robots = await (await fetch(base+'/robots.txt')).text();
  assert.ok(robots.includes('Disallow: /leads'));
  assert.ok(robots.includes('Sitemap: https://samanatatiktokshop.vercel.app/sitemap.xml'));
  const privatePage = await fetch(base+'/leads');
  assert.ok([401,503].includes(privatePage.status));
  assert.match(privatePage.headers.get('x-robots-tag'), /noindex/);
  assert.equal((await fetch(base+'/does-not-exist-release-test')).status,404);
  for (const input of ['null','[]','false','{']) {
    const result = await fetch(base+'/api/exit-offer', {method:'POST',headers:{'Content-Type':'application/json',Origin:base},body:input});
    assert.equal(result.status,400,input);
  }
  const invalid = await fetch(base+'/api/exit-offer', {method:'POST',headers:{'Content-Type':'application/json',Origin:base},body:'{}'});
  assert.equal(invalid.status,422);
});
