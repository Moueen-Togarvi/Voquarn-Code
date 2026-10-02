import assert from "node:assert/strict";
import { buildMetadata } from "../src/lib/metadata";
import { parseFrontmatter } from "../src/lib/blog-frontmatter";
import { buildBlogIndexFromMarkdown } from "../src/lib/blog-index-builder";
import { blogPostJsonLd, siteIdentityJsonLd } from "../src/lib/schema";
import { site } from "../src/lib/site-data";
import { GET as robots } from "../src/app/robots.txt/route";

async function main() {
  assert.equal(buildMetadata("Blog", "Guides", "/blog?page=2&utm_source=test#top").alternates?.canonical, "/blog?page=2");
  for (const path of ["/blog?page=1", "/blog?page=-2", "/blog?page=2junk", "/blog/?q=test"]) {
    assert.equal(buildMetadata("Blog", "Guides", path).alternates?.canonical, "/blog");
  }
  assert.equal(buildMetadata("Services", "Services", "/services/?utm_source=test").alternates?.canonical, "/services");
  assert.equal((buildMetadata("Admin", "Private", "/admin", { noIndex: true }).robots as { index: boolean }).index, false);
  const source = '---\ntitle: Test\nslug: test\ndescription: Test\ncategory: Test\nreadTime: 1 min\nstatus: published\npublishedAt: 2026-09-01\nmodifiedAt: 2026-09-02\n---\nText';
  assert.equal(parseFrontmatter(source, "test.md").frontmatter.modifiedAt, "2026-09-02");
  assert.throws(() => parseFrontmatter(source.replace("modifiedAt: 2026-09-02", "modifiedAt: invalid"), "test.md"));
  assert.throws(() => parseFrontmatter(source.replace("modifiedAt: 2026-09-02", "modifiedAt: 2026-08-01"), "test.md"));
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
