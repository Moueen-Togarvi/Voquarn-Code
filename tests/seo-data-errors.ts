import assert from "node:assert/strict";

// Use a fake database and fetch failure: no credentials or network access needed.
process.env.DATABASE_URL = "postgresql://test:test@example.com/test";
process.env.APP_DATABASE_URL = process.env.DATABASE_URL;
const savedFetch = globalThis.fetch;
const savedError = console.error;
globalThis.fetch = async () => { throw new Error("Simulated database outage"); };
console.error = () => {};

async function main() {
  try {
    const { getServices, getService, getPortfolioItems } = await import("../src/lib/data");
    await Promise.all([
      assert.rejects(() => getServices()),
      assert.rejects(() => getService("web-dev")),
      assert.rejects(() => getPortfolioItems()),
    ]);
    console.log("SEO database checks passed: outages cannot become empty lists or false service 404s.");
  } finally {
    globalThis.fetch = savedFetch;
    console.error = savedError;
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
