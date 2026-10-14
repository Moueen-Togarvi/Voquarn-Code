import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import blogRedirects from "../content/blog-redirects.json";
import nextConfig from "../next.config";
import { buildMetadata, parseBlogPage } from "../src/lib/metadata";
import { parseFrontmatter } from "../src/lib/blog-frontmatter";
import { buildBlogIndexFromMarkdown } from "../src/lib/blog-index-builder";
import { blogPostJsonLd, serviceJsonLd, siteIdentityJsonLd } from "../src/lib/schema";
import { articleKeywordCluster } from "../src/lib/seo-keywords";
import { site, type Service } from "../src/lib/site-data";
import { GET as robots } from "../src/app/robots.txt/route";

async function main() {
  assert.equal(buildMetadata("Blog", "Guides", "/blog?page=2&utm_source=test#top").alternates?.canonical, "/blog?page=2");
  for (const path of ["/blog?page=1", "/blog?page=-2", "/blog?page=2junk", "/blog/?q=test"]) {
    assert.equal(buildMetadata("Blog", "Guides", path).alternates?.canonical, "/blog");
  }
  assert.equal(buildMetadata("Services", "Services", "/services/?utm_source=test").alternates?.canonical, "/services");
  assert.equal((buildMetadata("Admin", "Private", "/admin", { noIndex: true }).robots as { index: boolean }).index, false);
  for (const value of [undefined, "", "0", "-2", "2junk", "2e2", "2.5", "02", "9007199254740992"]) {
    assert.equal(parseBlogPage(value), 1);
  }
  assert.equal(parseBlogPage("2"), 2);
  assert.equal(parseBlogPage("999"), 999);
  const articleMetadata = buildMetadata("RAG", "Guide", "/blog/rag-vs-fine-tuning", { keywords: ["RAG vs fine tuning"] });
  assert.ok((articleMetadata.keywords as string[]).includes("RAG vs fine tuning"));
  assert.ok(!(articleMetadata.keywords as string[]).includes("website design Pakistan"));
  const authored = buildMetadata("RAG", "Guide", "/blog/rag-vs-fine-tuning", { type: "article", author: { name: "Moueen Togarvi", url: "/ceo" } });
  assert.deepEqual(authored.authors, [{ name: "Moueen Togarvi", url: "https://www.voquarn.com/ceo" }]);
  const source = '---\ntitle: Test\nslug: test\ndescription: Test\ncategory: Test\nreadTime: 1 min\nstatus: published\npublishedAt: 2026-09-01\nmodifiedAt: 2026-09-02\n---\nText';
  assert.equal(parseFrontmatter(source, "test.md").frontmatter.modifiedAt, "2026-09-02");
  assert.throws(() => parseFrontmatter(source.replace("modifiedAt: 2026-09-02", "modifiedAt: invalid"), "test.md"));
  assert.throws(() => parseFrontmatter(source.replace("modifiedAt: 2026-09-02", "modifiedAt: 2026-08-01"), "test.md"));
  assert.deepEqual(articleKeywordCluster("RAG vs Fine-Tuning", "AI Infrastructure"), ["RAG vs Fine-Tuning", "AI Infrastructure"]);
  const posts = await buildBlogIndexFromMarkdown();
  const reviewed = posts.filter((post) => post.cornerstone);
  assert.ok(reviewed.length > 0);
  const slugs = new Set(posts.map((post) => post.slug));
  const redirects = await nextConfig.redirects!();
  for (const [source, destination] of Object.entries(blogRedirects)) {
    assert.ok(!slugs.has(source), `Redirect must not hide a published article: ${source}`);
    assert.ok(slugs.has(destination), `Redirect must resolve to a published article: ${destination}`);
    assert.ok(!(destination in blogRedirects), `Redirect chains are not allowed: ${source}`);
    assert.ok(redirects.some((rule) => rule.source === `/blog/${source}` && rule.destination === `/blog/${destination}` && rule.permanent));
  }
  const paragraphOwners = new Map<string, Set<string>>();
  for (const post of posts) {
    const markdown = await readFile(`content/blogs/${post.slug}.md`, "utf8");
    for (const match of markdown.matchAll(/\]\(\/blog\/([^)#?\s]+)/g)) {
      assert.ok(slugs.has(match[1]), `Broken blog link in ${post.slug}: ${match[1]}`);
    }
    const { markdown: body } = parseFrontmatter(markdown, `${post.slug}.md`);
    for (const block of body.split(/\n\s*\n/)) {
      const paragraph = block.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .replace(/[*_`>#-]/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
      if (paragraph.split(" ").length < 25) continue;
      const owners = paragraphOwners.get(paragraph) ?? new Set<string>();
      owners.add(post.slug);
      paragraphOwners.set(paragraph, owners);
    }
  }
  // Editorial regression guard against the retired topic × angle generators,
  // not a Google threshold or an assessment of semantic/factual quality.
  for (const owners of paragraphOwners.values()) {
    assert.ok(owners.size < 3, `Repeated long paragraph across published articles: ${[...owners].join(", ")}`);
  }
  const post = { ...reviewed[0], modifiedAt: "2026-10-03", sections: [] };
  assert.equal(blogPostJsonLd(post).dateModified, "2026-10-03");
  assert.equal((blogPostJsonLd(post).author as Record<string, unknown>)["@id"], "https://www.voquarn.com/ceo#person");
  assert.ok(!JSON.stringify(siteIdentityJsonLd(site)).includes('"aggregateRating"'));
  const pricedService: Service = {
    id: "crm-systems", title: "CRM systems", description: "Business CRM", deliverables: [],
    subServices: [{ id: "clinic", name: "Clinic CRM", description: "Clinic workflow", features: [], pricePkr: 2000, priceUsd: 7 }],
  };
  const monthlyOffers = serviceJsonLd(pricedService).offers as Array<{ priceSpecification: Array<Record<string, unknown>> }>;
  assert.equal(monthlyOffers.length, 1);
  assert.deepEqual(monthlyOffers[0].priceSpecification.map(({ price, priceCurrency, billingDuration, unitText }) => ({ price, priceCurrency, billingDuration, unitText })), [
    { price: 2000, priceCurrency: "PKR", billingDuration: "P1M", unitText: "month" },
    { price: 7, priceCurrency: "USD", billingDuration: "P1M", unitText: "month" },
  ]);
  assert.ok(!JSON.stringify(serviceJsonLd({ ...pricedService, id: "web-dev" })).includes('"billingDuration"'), "Project prices must not acquire a subscription billing period");
  const rules = await robots().text();
  const groups = rules.split("User-agent: ").slice(1);
  for (const group of groups) {
    assert.ok(group.includes("Disallow: /api/"));
    assert.ok(group.includes("Disallow: /admin/"));
    assert.ok(group.includes("Allow: /"));
    assert.ok(group.includes("Allow: /admin/login$"));
  }
  assert.ok(rules.includes("Sitemap: https://www.voquarn.com/sitemap.xml"));
  console.log(`SEO checks passed: canonicals, noindex, article dates, entity schema, ${groups.length} crawler groups, ${reviewed.length} reviewed posts.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
