// Blog listing index: the small metadata records that /blog, the sitemap,
// llms.txt, and generateStaticParams need.
//
// content/blogs holds thousands of Markdown files (tens of megabytes), so
// scanning and parsing all of them inside a request costs seconds on every
// cold serverless instance. scripts/build-blog-index.ts runs the scan once at
// build time and writes content/blog-index.json; at runtime we read that one
// file instead. The scan stays here as the fallback (and as what dev uses, so
// a newly added Markdown file shows up without rebuilding the index).

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { parseFrontmatter } from "@/lib/blog-frontmatter";

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
  readTime: string;
  coverImage: string | null;
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
    typeof entry.readTime === "string" &&
    (entry.coverImage === null || typeof entry.coverImage === "string")
  );
}

/**
 * Parses every Markdown file in content/blogs and returns the published posts,
 * newest first. Throws on malformed frontmatter or duplicate slugs so a bad
 * post fails the build instead of silently disappearing from the site.
 */
export async function buildBlogIndexFromMarkdown(): Promise<BlogIndexEntry[]> {
  const filenames = (await readdir(BLOG_DIRECTORY)).filter((name) => name.endsWith(".md"));
  const entries = await Promise.all(
    filenames.map(async (filename) => {
      const source = await readFile(path.join(BLOG_DIRECTORY, filename), "utf8");
      const { frontmatter } = parseFrontmatter(source, filename);

      if (`${frontmatter.slug}.md` !== filename) {
        throw new Error(`Slug and filename do not match in ${filename}`);
      }

      const entry: BlogIndexEntry = {
        slug: frontmatter.slug,
        title: frontmatter.title,
        excerpt: frontmatter.description,
        category: frontmatter.category,
        publishedAt: frontmatter.publishedAt ?? "",
        readTime: frontmatter.readTime,
        coverImage: frontmatter.coverImage ?? null,
      };

      return { status: frontmatter.status, entry };
    }),
  );

  const slugs = new Set<string>();
  for (const { entry } of entries) {
    if (slugs.has(entry.slug)) throw new Error(`Duplicate blog slug: ${entry.slug}`);
    slugs.add(entry.slug);
  }

  return entries
    .filter(({ status }) => status === "published")
    .map(({ entry }) => entry)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.title.localeCompare(b.title));
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
