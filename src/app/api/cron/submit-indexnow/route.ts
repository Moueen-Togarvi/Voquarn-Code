import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { getBlogPosts, getServices } from "@/lib/data";
import { submitToIndexNow } from "@/lib/indexnow";
import { getSiteUrl } from "@/lib/site-url";

function validCronSecret(request: Request) {
  const secret = process.env.CRON_SECRET;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  if (!secret || secret.length < 32) return false;
  const expectedBuffer = Buffer.from(secret);
  const suppliedBuffer = Buffer.from(supplied);
  return expectedBuffer.length === suppliedBuffer.length && timingSafeEqual(expectedBuffer, suppliedBuffer);
}

// Mirrors sitemap.xml's URL set so IndexNow always sees exactly what's
// actually published — one list, two consumers, instead of a second list
// that quietly drifts from the sitemap over time.
const staticPaths = [
  "",
  "/services",
  "/portfolio",
  "/blog",
  "/contact",
  "/about",
  "/team",
  "/ceo",
  "/careers",
];

export async function GET(request: Request) {
  if (!validCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const siteUrl = getSiteUrl();
  const [services, blogPosts] = await Promise.all([getServices(), getBlogPosts()]);

  const urls = [
    ...staticPaths.map((path) => new URL(path || "/", siteUrl).toString()),
    ...services.map((service) => new URL(`/services/${service.id}`, siteUrl).toString()),
    ...blogPosts.map((post) => new URL(`/blog/${post.slug}`, siteUrl).toString()),
  ];

  try {
    const result = await submitToIndexNow(urls);
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("submit-indexnow error:", error);
    return NextResponse.json({ error: "IndexNow submission failed" }, { status: 502 });
  }
}
