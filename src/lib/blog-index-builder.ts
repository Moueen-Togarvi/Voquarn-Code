// Build-time scanner, excluded from the production request path.
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { parseFrontmatter } from "@/lib/blog-frontmatter";
import { BLOG_DIRECTORY, type BlogIndexEntry } from "@/lib/blog-index";

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
      const { frontmatter, markdown } = parseFrontmatter(source, filename);

      if (String(frontmatter.cornerstone) === "true" && frontmatter.status === "published") {
        const evidence = new Set([...markdown.matchAll(/\[[^\]]+\]\((https?:\/\/[^)\s]+)\)/g)].map((match) => match[1]));
        if (evidence.size < 2) throw new Error(`Cornerstone post ${filename} needs at least two evidence links`);
      }

      if (`${frontmatter.slug}.md` !== filename) {
        throw new Error(`Slug and filename do not match in ${filename}`);
      }

      const entry: BlogIndexEntry = {
        slug: frontmatter.slug,
        title: frontmatter.title,
        excerpt: frontmatter.description,
        category: frontmatter.category,
        publishedAt: frontmatter.publishedAt ?? "",
        ...(frontmatter.modifiedAt ? { modifiedAt: frontmatter.modifiedAt } : {}),
        readTime: frontmatter.readTime,
        coverImage: frontmatter.coverImage ?? null,
        ...(String(frontmatter.cornerstone) === "true" ? { cornerstone: true } : {}),
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

