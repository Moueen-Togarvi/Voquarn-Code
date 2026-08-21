// Writes content/blog-index.json: the listing metadata for every published
// Markdown post, parsed once at build time instead of on every cold start.
// Wired into the `prebuild` npm script, so `npm run build` always refreshes it.

import { writeFile } from "node:fs/promises";
import path from "node:path";
import { BLOG_INDEX_FILE, buildBlogIndexFromMarkdown } from "@/lib/blog-index";

async function main() {
  const started = Date.now();
  const entries = await buildBlogIndexFromMarkdown();
  const json = JSON.stringify(entries);
  await writeFile(BLOG_INDEX_FILE, `${json}\n`, "utf8");

  const sizeKb = Math.round(Buffer.byteLength(json) / 1024);
  console.log(
    `Blog index: ${entries.length} published posts, ${sizeKb} KB → ${path.relative(process.cwd(), BLOG_INDEX_FILE)} (${Date.now() - started}ms)`,
  );
}

main().catch((error) => {
  console.error("Failed to build the blog index:", error);
  process.exit(1);
});
