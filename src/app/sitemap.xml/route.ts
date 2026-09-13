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

// Baseline lastmod for pages whose static markup last changed on this date.
// Pages that fold in fresh data at request time (home, /blog, /services) are
// bumped forward to the newest underlying data timestamp below, so the
// sitemap does not lie about freshness or freeze on a stale date.
const SITE_LAST_MODIFIED = new Date("2026-09-13T00:00:00.000Z");

function newest(...dates: Date[]): Date {
  return dates.reduce((a, b) => (a.getTime() >= b.getTime() ? a : b));
}

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

  const cornerstoneDates = blogPosts
    .filter((post) => post.cornerstone)
    .map((post) => new Date(post.publishedAt))
    .filter((date) => !Number.isNaN(date.getTime()));
  const latestBlogDate = cornerstoneDates.length
    ? newest(...cornerstoneDates)
    : SITE_LAST_MODIFIED;

  // Pages that surface blog and service data get bumped to whichever
  // dependency last changed. Purely static routes (privacy, terms, contact)
  // stay pinned to SITE_LAST_MODIFIED so their lastmod is not fake.
  const dynamicPaths = new Set(["", "/blog", "/services", "/portfolio"]);
  const staticEntries = staticRoutes.map((route) =>
    entry(
      new URL(route.path || "/", siteUrl).toString(),
      dynamicPaths.has(route.path) ? newest(SITE_LAST_MODIFIED, latestBlogDate) : SITE_LAST_MODIFIED,
      route.changeFrequency,
      route.priority,
    ),
  );

  const serviceEntries = services.map((service) =>
    entry(new URL(`/services/${service.id}`, siteUrl).toString(), SITE_LAST_MODIFIED, "monthly", 0.8),
  );

  // Only cornerstone posts are submitted. The corpus contains thousands of
  // bulk-generated pages that share most of their paragraphs across each other
  // (see reports/blog-content-audit-*), and submitting them wastes crawl budget
  // while dragging the site-wide quality signal down. Non-cornerstone posts
  // stay reachable through /blog and internal links, but they are noindexed at
  // the page level so Google can drop them from the index.
  const blogEntries = blogPosts
    .filter((post) => post.cornerstone)
    .map((post) =>
      entry(
        new URL(`/blog/${post.slug}`, siteUrl).toString(),
        new Date(post.publishedAt),
        "weekly",
        0.9,
      ),
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

  // Cache-Control is centralised in next.config.ts:headers().
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
