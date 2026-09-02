import { getSiteUrl, isPreview } from "../site-config";
export const dynamic = "force-static";
export function GET() {
  const rules = isPreview ? "User-agent: *\nDisallow: /\n" : `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /leads\n\nSitemap: ${getSiteUrl()}/sitemap.xml\n`;
  return new Response(rules, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
