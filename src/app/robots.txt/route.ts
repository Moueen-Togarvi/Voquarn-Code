import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

export function GET() {
  const siteUrl = getSiteUrl();
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    `Host: ${siteUrl.host}`,
    `Sitemap: ${new URL("/sitemap.xml", siteUrl).toString()}`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
