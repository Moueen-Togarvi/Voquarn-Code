import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

const disallowPaths = [
  "/api/",
  "/admin",
  "/sample",
  "/sample-rocket",
  "/sample-suites",
];

// AI / answer-engine crawlers. These are allowed on purpose: being crawled is
// what makes Voquarn Code eligible to be cited in ChatGPT, Claude, Perplexity,
// Gemini, and Copilot answers. Each one needs its own group because a matching
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

  return new Response(body, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
