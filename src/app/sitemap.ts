import type { MetadataRoute } from "next";
import { blogPosts, services } from "@/lib/site-data";
import { getSiteUrl } from "@/lib/site-url";

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

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticEntries = staticRoutes.map((path) => ({
    url: new URL(path || "/", siteUrl).toString(),
    lastModified: now,
  }));

  const serviceEntries = services.map((service) => ({
    url: new URL(`/services/${service.id}`, siteUrl).toString(),
    lastModified: now,
  }));

  const blogEntries = blogPosts.map((post) => ({
    url: new URL(`/blog/${post.slug}`, siteUrl).toString(),
    lastModified: new Date(post.publishedAt),
  }));

  return [...staticEntries, ...serviceEntries, ...blogEntries];
}
