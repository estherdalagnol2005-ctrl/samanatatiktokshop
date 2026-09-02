// Formatação técnica da marca existente: favicon e cartão OG, sem arte de terceiros.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";
const logo = readFileSync("public/brand/sunlix-logo-night.svg", "utf8");
const embedded = logo.replace('<svg width="194" height="54"', '<svg x="215" y="175" width="770" height="215"');
const social = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="background" x2="0" y2="1"><stop stop-color="#fa2095"/><stop offset="1" stop-color="#f0ff27"/></linearGradient></defs><rect width="1200" height="630" fill="url(#background)"/>${embedded}<text x="600" y="475" text-anchor="middle" font-family="sans-serif" font-size="36" font-weight="700" fill="#1c171a">TikTok Shop · Samanta Vidal</text></svg>`;
mkdirSync("public/social", { recursive: true });
await sharp(Buffer.from(social)).jpeg({ quality: 90, mozjpeg: true }).toFile("public/social/sunlix-share.jpg");
// Preservar o favicon aprovado: logo Sunlix completo, sem monograma ou fundo novo.
const icon = logo;
writeFileSync("public/icon.svg", `${icon.trimEnd()}\n`);
const fit = { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } };
await sharp(Buffer.from(icon)).resize(180, 180, fit).png().toFile("public/apple-touch-icon.png");
const png = await sharp(Buffer.from(icon)).resize(32, 32, fit).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
header[6] = 32; header[7] = 32;
header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14); header.writeUInt32LE(22, 18);
writeFileSync("public/favicon.ico", Buffer.concat([header, png]));
