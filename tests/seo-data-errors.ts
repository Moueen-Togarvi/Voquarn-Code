import assert from "node:assert/strict";

// Use a fake database and fetch failure: no credentials or network access needed.
process.env.DATABASE_URL = "postgresql://test:test@example.com/test";
process.env.APP_DATABASE_URL = process.env.DATABASE_URL;
const savedFetch = globalThis.fetch;
const savedError = console.error;
const cacheGlobal = globalThis as typeof globalThis & { __incrementalCache?: unknown };
const savedCache = cacheGlobal.__incrementalCache;
let fetchAttempts = 0;
let cacheWrites = 0;
const testCache = {
  generateSimpleCacheKey: async (key: string) => key,
  get: async (): Promise<unknown> => null,
  set: async () => { cacheWrites += 1; },
};
cacheGlobal.__incrementalCache = testCache;
globalThis.fetch = async () => { fetchAttempts += 1; throw new Error("Simulated database outage"); };
console.error = () => {};

async function main() {
  try {
    const { getServices, getService, getPortfolioItems } = await import("../src/lib/data");
    await Promise.all([
      assert.rejects(() => getServices()),
      assert.rejects(() => getService("web-dev")),
      assert.rejects(() => getPortfolioItems()),
    ]);
    assert.ok(fetchAttempts > 0, "Checks must reach the database rather than fail on a missing Next cache context");
    assert.equal(cacheWrites, 0, "Failed database reads must never populate the public data cache");
    console.log("SEO database checks passed: outages cannot become empty lists or false service 404s.");

    const { GET: sitemap } = await import("../src/app/sitemap.xml/route");
    const unavailable = await sitemap();
    assert.equal(unavailable.status, 503);
    assert.equal(unavailable.headers.get("Cache-Control"), "no-store");
    const { GET: llms } = await import("../src/app/llms.txt/route");
    const unavailableSummary = await llms();
    assert.equal(unavailableSummary.status, 503);
    assert.equal(unavailableSummary.headers.get("Cache-Control"), "no-store");

    // A legitimate empty service list isolates the real Markdown publication
    // inventory without database credentials or a network connection.
    testCache.get = async () => ({ value: { kind: "FETCH", data: { body: "[]" } }, isStale: false });
    const { getBlogPosts } = await import("../src/lib/data");
    const posts = await getBlogPosts();
    const response = await sitemap();
    assert.equal(response.status, 200);
    const xml = await response.text();
    const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
    const blogUrls = urls.filter((url) => url.includes("/blog/"));
    assert.equal(new Set(urls).size, urls.length);
    assert.equal(blogUrls.length, posts.length);
    for (const post of posts) assert.ok(blogUrls.includes(`https://www.voquarn.com/blog/${post.slug}`), post.slug);
    console.log(`Full publication sitemap checks passed: all ${posts.length} published blogs included; outages return an uncached 503.`);
  } finally {
    globalThis.fetch = savedFetch;
    console.error = savedError;
    if (savedCache === undefined) delete cacheGlobal.__incrementalCache;
    else cacheGlobal.__incrementalCache = savedCache;
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
