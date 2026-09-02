import { readFileSync } from "node:fs";
import { join } from "node:path";
import { indexing, seoHead } from "./site-config";

export const dynamic = "force-static";

const siteHtml = readFileSync(join(process.cwd(), "recovery", "generated.html"), "utf8")
  .replace("<!-- SITE_SEO_HEAD -->", seoHead());

export function GET() {
  return new Response(siteHtml, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
      "X-Robots-Tag": indexing,
    },
  });
}
