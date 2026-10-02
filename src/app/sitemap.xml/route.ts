import { getBlogPosts, getServices } from "@/lib/data";
import { getSiteUrl } from "@/lib/site-url";

// Regenerated hourly for CMS services. Markdown publication requires a deployment.
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
  lastModified: Date | undefined,
  changeFrequency: "weekly" | "monthly" | "yearly",
  priority: number,
) {
  return [
    "<url>",
    `<loc>${escapeXml(url)}</loc>`,
    ...(lastModified ? [`<lastmod>${lastModified.toISOString()}</lastmod>`] : []),
    `<changefreq>${changeFrequency}</changefreq>`,
    `<priority>${priority.toFixed(2)}</priority>`,
    "</url>",
  ].join("\n");
}

export async function GET() {
  const siteUrl = getSiteUrl();
  const sources = await Promise.all([getServices(), getBlogPosts()]).catch((error) => {
    console.error("Sitemap sources unavailable:", error);
    return null;
  });
  // Never cache a successful but incomplete sitemap during a database outage.
  if (!sources) return new Response("Sitemap temporarily unavailable", {
    status: 503,
    headers: { "Retry-After": "300", "Cache-Control": "no-store" },
  });
  const [services, blogPosts] = sources;

  // Omit lastmod when the source does not track all changes. Blog publication
  // dates are not evidence that service, portfolio, or static markup changed.
  const staticEntries = staticRoutes.map((route) =>
    entry(
      new URL(route.path || "/", siteUrl).toString(),
      undefined,
      route.changeFrequency,
      route.priority,
    ),
  );

  const serviceEntries = services.map((service) =>
    entry(new URL(`/services/${service.id}`, siteUrl).toString(), undefined, "monthly", 0.8),
  );

  // The index contains published posts only. Editorial cornerstone status
  // does not restrict the owner's requested full publication sitemap.
  const blogEntries = blogPosts.map((post) =>
      entry(
        new URL(`/blog/${post.slug}`, siteUrl).toString(),
        new Date(post.modifiedAt || post.publishedAt),
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
