import assert from "node:assert/strict";

// Run after starting the production build: npx tsx tests/seo-public-routes.ts http://localhost:3000
// An explicit production origin can also be supplied for deployment verification.
const origin = new URL(process.argv[2] || "http://localhost:3000");

async function read(path: string) {
  const response = await fetch(new URL(path, origin), {
    headers: { "User-Agent": "Googlebot" },
    redirect: "manual",
  });
  return { status: response.status, body: await response.text() };
}

async function main() {
  const [second, filtered, outside, outsideFiltered, crm, summary] = await Promise.all([
    read("/blog?page=2"),
    read("/blog?q=nextjs-technical-seo-audit-no-match"),
    read("/blog?page=999999"),
    read("/blog?q=nextjs-technical-seo-audit-no-match&page=2"),
    read("/services/crm-systems"),
    read("/llms.txt"),
  ]);
  assert.equal(second.status, 200);
  assert.match(second.body, /<link[^>]+rel="canonical"[^>]+href="https:\/\/www\.voquarn\.com\/blog\?page=2"/);
  assert.match(second.body, /<title>[^<]*Page 2<\/title>/);
  assert.equal(filtered.status, 200);
  assert.match(filtered.body, /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/);
  assert.equal(outside.status, 404, "Out-of-range archives must not duplicate the final page");
  assert.equal(outsideFiltered.status, 404, "Filtered archives must validate their own result count");
  assert.equal(crm.status, 200);
  const schemas = [...crm.body.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .flatMap((match) => JSON.parse(match[1]));
  const service = schemas.find((schema) => schema["@type"] === "Service");
  assert.ok(service, "CRM service schema must be present");
  assert.ok(Array.isArray(service.offers) && service.offers.length > 0);
  for (const offer of service.offers) {
    for (const price of offer.priceSpecification ?? []) {
      assert.equal(price.billingDuration, "P1M");
      assert.equal(price.unitText, "month");
    }
  }
  assert.equal(summary.status, 200);
  const crmSummary = summary.body.split("Page: https://www.voquarn.com/services/crm-systems")[1]?.split("\n### ")[0];
  assert.ok(crmSummary, "CRM must appear in the LLM summary");
  const startingPrices = crmSummary.split("\n").filter((line) => line.includes("starting at"));
  assert.ok(startingPrices.length > 0);
  for (const line of startingPrices) assert.match(line, /per month/);
  console.log("Public SEO checks passed: archive canonicals, filtered noindex, pagination 404s, and monthly CRM prices in schema and llms.txt.");
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
