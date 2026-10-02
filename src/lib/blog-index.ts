// Blog listing index: the small metadata records that /blog, the sitemap,
// llms.txt, and generateStaticParams need.
//
// content/blogs holds thousands of Markdown files (tens of megabytes), so
// scanning and parsing all of them inside a request costs seconds on every
// cold serverless instance. scripts/build-blog-index.ts runs the scan once at
// build time and writes content/blog-index.json; at runtime we read that one
// file instead. The scan stays here as the fallback (and as what dev uses, so
// a newly added Markdown file shows up without rebuilding the index).

import { readFile } from "node:fs/promises";
import path from "node:path";

export const BLOG_DIRECTORY = path.join(process.cwd(), "content", "blogs");
export const BLOG_INDEX_FILE = path.join(process.cwd(), "content", "blog-index.json");

// Article bodies and keyword lists are intentionally absent: they are parsed
// on demand from the Markdown file by getMarkdownBlogPost, so keeping them out
// of the index keeps it a fraction of the size of the content directory.
export type BlogIndexEntry = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  modifiedAt?: string;
  readTime: string;
  coverImage: string | null;
  /**
   * Marks a deliberately written, in-depth post. Set explicitly in frontmatter
   * rather than derived from readTime, because the bulk-generated posts all
   * self-report an inflated reading time. Used for editorial checks and
   * prebuilding, while all published posts participate in discovery.
   */
  cornerstone?: boolean;
};

function isBlogIndexEntry(value: unknown): value is BlogIndexEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.slug === "string" &&
    typeof entry.title === "string" &&
    typeof entry.excerpt === "string" &&
    typeof entry.category === "string" &&
    typeof entry.publishedAt === "string" &&
    (entry.modifiedAt === undefined || typeof entry.modifiedAt === "string") &&
    typeof entry.readTime === "string" &&
    (entry.cornerstone === undefined || typeof entry.cornerstone === "boolean") &&
    (entry.coverImage === null || typeof entry.coverImage === "string")
  );
}

/** Reads the prebuilt index, or null when it is missing or unusable. */
export async function readBlogIndexFile(): Promise<BlogIndexEntry[] | null> {
  try {
    const parsed: unknown = JSON.parse(await readFile(BLOG_INDEX_FILE, "utf8"));
    if (!Array.isArray(parsed) || parsed.length === 0 || !parsed.every(isBlogIndexEntry)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
