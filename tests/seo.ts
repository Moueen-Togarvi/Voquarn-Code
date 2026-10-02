import assert from "node:assert/strict";
import { buildMetadata, parseBlogPage } from "../src/lib/metadata";
import { parseFrontmatter } from "../src/lib/blog-frontmatter";
import { buildBlogIndexFromMarkdown } from "../src/lib/blog-index-builder";
import { blogPostJsonLd, siteIdentityJsonLd } from "../src/lib/schema";
import { articleKeywordCluster } from "../src/lib/seo-keywords";
import { site } from "../src/lib/site-data";
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
  const source = '---\ntitle: Test\nslug: test\ndescription: Test\ncategory: Test\nreadTime: 1 min\nstatus: published\npublishedAt: 2026-09-01\nmodifiedAt: 2026-09-02\n---\nText';
  assert.equal(parseFrontmatter(source, "test.md").frontmatter.modifiedAt, "2026-09-02");
  assert.throws(() => parseFrontmatter(source.replace("modifiedAt: 2026-09-02", "modifiedAt: invalid"), "test.md"));
  assert.throws(() => parseFrontmatter(source.replace("modifiedAt: 2026-09-02", "modifiedAt: 2026-08-01"), "test.md"));
  assert.deepEqual(articleKeywordCluster("RAG vs Fine-Tuning", "AI Infrastructure"), ["RAG vs Fine-Tuning", "AI Infrastructure"]);
  const posts = await buildBlogIndexFromMarkdown();
  const reviewed = posts.filter((post) => post.cornerstone);
  assert.ok(reviewed.length > 0);
  const post = { ...reviewed[0], modifiedAt: "2026-10-03", sections: [] };
  assert.equal(blogPostJsonLd(post).dateModified, "2026-10-03");
  assert.ok(!JSON.stringify(siteIdentityJsonLd(site)).includes('"aggregateRating"'));
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
