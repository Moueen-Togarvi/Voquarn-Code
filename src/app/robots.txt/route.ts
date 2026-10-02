import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

// `$` anchors the pattern to the end of the URL so `/sample` does not also
// block a future `/samples-*` path. Google, Bing, and Yandex all support the
// `$` end-of-string marker in robots.txt.
const disallowPaths = [
  "/api/",
  "/admin$",
  "/admin/",
  "/api$",
  "/sample$",
  "/sample-rocket$",
  "/sample-suites$",
];

// Search, user-fetch, and training agents are allowed by the site policy.
// Access does not guarantee indexing, ranking, or citations. A matching
// user-agent group makes a crawler ignore the "*" group entirely — so the
// disallow list has to be repeated rather than inherited.
const aiCrawlers = [
  "GPTBot", // OpenAI crawler
  "OAI-SearchBot", // ChatGPT Search index
  "ChatGPT-User", // ChatGPT browsing on user request
  "ClaudeBot", // Anthropic crawler
  "Claude-User", // Claude browsing on user request
  "Claude-SearchBot", // Claude search index
  "PerplexityBot", // Perplexity index
  "Perplexity-User", // Perplexity user-initiated fetch
  "Google-Extended", // Gemini / Vertex grounding (separate from Search ranking)
  "Applebot-Extended", // Apple Intelligence
  "Amazonbot",
  "meta-externalagent", // Meta AI
  "cohere-ai",
  "CCBot", // Common Crawl, feeds many open models
];

function group(userAgent: string) {
  return [
    `User-agent: ${userAgent}`,
    "Allow: /",
    // Let crawlers see the login page noindex directive. Authentication still
    // protects private pages; robots rules are not access control.
    "Allow: /admin/login$",
    ...disallowPaths.map((path) => `Disallow: ${path}`),
    "",
  ].join("\n");
}

export function GET() {
  const siteUrl = getSiteUrl();

  const body = [
    group("*"),
    "# ── AI / answer engines ──",
    ...aiCrawlers.map(group),
    `Host: ${siteUrl.host}`,
    `Sitemap: ${new URL("/sitemap.xml", siteUrl).toString()}`,
    // Structured summary for LLMs — see https://llmstxt.org
    `# LLM summary: ${new URL("/llms.txt", siteUrl).toString()}`,
    "",
  ].join("\n");

  // Cache-Control is centralised in next.config.ts:headers() so browsers,
  // Vercel's edge, and Cloudflare all see the same directive.
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
