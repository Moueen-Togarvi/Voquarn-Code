import { getBlogPosts, getServices } from "@/lib/data";
import { getSiteUrl } from "@/lib/site-url";

// Regenerated hourly so newly published services and posts get indexed
// without waiting for a redeploy.
export const revalidate = 3600;

const staticRoutes = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "weekly", priority: 0.95 },
  { path: "/portfolio", changeFrequency: "monthly", priority: 0.85 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.85 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.8 },
  { path: "/about", changeFrequency: "yearly", priority: 0.7 },
  { path: "/team", changeFrequency: "monthly", priority: 0.65 },
  { path: "/ceo", changeFrequency: "yearly", priority: 0.6 },
  { path: "/careers", changeFrequency: "weekly", priority: 0.6 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
] as const;

// Public pages were refreshed alongside the Markdown blog rollout. Keep this
// tied to a real content change instead of using the request time, otherwise
// crawlers would see a false lastmod value on every hourly regeneration.
const SITE_LAST_MODIFIED = new Date("2026-08-19T00:00:00.000Z");

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function entry(
  url: string,
  lastModified: Date,
  changeFrequency: "weekly" | "monthly" | "yearly",
  priority: number,
) {
  return [
    "<url>",
    `<loc>${escapeXml(url)}</loc>`,
    `<lastmod>${lastModified.toISOString()}</lastmod>`,
    `<changefreq>${changeFrequency}</changefreq>`,
    `<priority>${priority.toFixed(2)}</priority>`,
    "</url>",
  ].join("\n");
}

export async function GET() {
  const siteUrl = getSiteUrl();
  const [services, blogPosts] = await Promise.all([getServices(), getBlogPosts()]);

  const staticEntries = staticRoutes.map((route) =>
    entry(
      new URL(route.path || "/", siteUrl).toString(),
      SITE_LAST_MODIFIED,
      route.changeFrequency,
      route.priority,
    ),
  );

  const serviceEntries = services.map((service) =>
    entry(new URL(`/services/${service.id}`, siteUrl).toString(), SITE_LAST_MODIFIED, "monthly", 0.8),
  );

  const blogEntries = blogPosts.map((post) =>
    entry(new URL(`/blog/${post.slug}`, siteUrl).toString(), new Date(post.publishedAt), "monthly", 0.7),
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
