import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { markdownToRichContent, parseFrontmatter } from "@/lib/blog-frontmatter";
import {
  BLOG_DIRECTORY,
  buildBlogIndexFromMarkdown,
  readBlogIndexFile,
  type BlogIndexEntry,
} from "@/lib/blog-index";
import type { BlogPost } from "@/lib/site-data";

function toListingPost(entry: BlogIndexEntry): BlogPost {
  return { ...entry, sections: [], content: null };
}

async function loadListingPosts(): Promise<BlogPost[]> {
  // Dev always rescans so a Markdown file added since the last index build is
  // picked up immediately; the cold-start cost only matters in production.
  if (process.env.NODE_ENV === "production") {
    const indexed = await readBlogIndexFile();
    if (indexed) return indexed.map(toListingPost);
    console.warn(
      "content/blog-index.json is missing or unusable — falling back to a full Markdown scan. Run `npm run blogs:index`.",
    );
  }

  return (await buildBlogIndexFromMarkdown()).map(toListingPost);
}

let listingPostsPromise: Promise<BlogPost[]> | undefined;

function readMemoizedListingPosts() {
  // The index ships with the deployment, so one read per warm instance is
  // enough. React cache still deduplicates consumers inside one render.
  listingPostsPromise ??= loadListingPosts();
  return listingPostsPromise;
}

export const getMarkdownBlogPosts = cache(readMemoizedListingPosts);

// Slug lookups on the article route would otherwise scan the whole listing.
const getPostsBySlug = cache(async () => {
  const posts = await getMarkdownBlogPosts();
  return new Map(posts.map((post) => [post.slug, post]));
});

export const getMarkdownBlogPost = cache(async (slug: string): Promise<BlogPost | undefined> => {
  const post = (await getPostsBySlug()).get(slug);
  if (!post) return undefined;

  const filename = `${post.slug}.md`;
  const source = await readFile(path.join(BLOG_DIRECTORY, filename), "utf8");
  const { frontmatter, markdown } = parseFrontmatter(source, filename);

  return {
    ...post,
    // Keywords live on the article route only, so they are parsed here rather
    // than carried through the listing index.
    seoKeywords: [
      frontmatter.targetKeyword,
      ...(frontmatter.secondaryKeywords?.split(",").map((keyword) => keyword.trim()) ?? []),
    ].filter((keyword): keyword is string => Boolean(keyword)),
    content: markdownToRichContent(markdown),
  };
});
