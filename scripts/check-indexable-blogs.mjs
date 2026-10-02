// Apply the existing editorial checks to every article submitted to search engines.
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const posts = JSON.parse(await readFile(new URL("../content/blog-index.json", import.meta.url), "utf8"));
const files = posts.filter((post) => post.cornerstone).map((post) => `content/blogs/${post.slug}.md`);
if (!files.length) throw new Error("No reviewed articles available for indexing");
const result = spawnSync(process.execPath, ["scripts/check-new-blog-quality.mjs", ...files], { stdio: "inherit" });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
console.log(`Editorial checks passed for all ${files.length} indexable articles.`);
