import { blogPosts, services } from "@/lib/site-data";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

const staticRoutes = [
  "",
  "/about",
  "/blog",
  "/careers",
  "/ceo",
  "/contact",
  "/portfolio",
  "/pricing",
  "/privacy",
  "/services",
  "/team",
  "/terms",
];

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function entry(url: string, lastModified: Date) {
  return [
    "<url>",
    `<loc>${escapeXml(url)}</loc>`,
    `<lastmod>${lastModified.toISOString()}</lastmod>`,
    "</url>",
  ].join("\n");
}

export function GET() {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticEntries = staticRoutes.map((path) =>
    entry(new URL(path || "/", siteUrl).toString(), now),
  );

  const serviceEntries = services.map((service) =>
    entry(new URL(`/services/${service.id}`, siteUrl).toString(), now),
  );

  const blogEntries = blogPosts.map((post) =>
    entry(new URL(`/blog/${post.slug}`, siteUrl).toString(), new Date(post.publishedAt)),
  );

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticEntries,
    ...serviceEntries,
    ...blogEntries,
    "</urlset>",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
