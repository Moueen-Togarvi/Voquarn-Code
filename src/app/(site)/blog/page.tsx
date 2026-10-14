import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { PageStructuredData } from "@/components/seo/page-structured-data";
import {
  BlogExplorer,
  blogSearchText,
  blogTopics,
} from "@/components/ui/blog-explorer";
import { buildMetadata, parseBlogPage } from "@/lib/metadata";
import { blogJsonLd } from "@/lib/schema";
import { getBlogPosts } from "@/lib/data";

const pageTitle = "Voquarn Code Blog | SEO, Web Development & AI Automation";
const pageDescription =
  "Read practical articles from Voquarn Code on technical SEO, website strategy, client portals, AI workflows, and digital growth systems.";
const pageKeywords = [
  "technical SEO guides",
  "SEO blog Pakistan",
  "web development tutorials",
  "Next.js performance guides",
  "website conversion optimization",
  "AI automation guides",
  "AI agents for business",
  "SaaS product development articles",
  "digital growth strategy Pakistan",
  "local SEO tips Pakistan",
];

// Regenerated hourly so new/edited posts reach the live site without a redeploy.
export const revalidate = 3600;

// Kept a multiple of 3 so the card grid always fills complete rows.
const GRID_PAGE_SIZE = 12;

type BlogPageProps = {
  searchParams: Promise<{
    q?: string | string[];
    topic?: string | string[];
    page?: string | string[];
  }>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

// Metadata and rendered cards must resolve the same filtered page and bounds.
async function getBlogPageData(searchParams: BlogPageProps["searchParams"]) {
  const filters = await searchParams;
  const query = (firstValue(filters.q) ?? "").trim().slice(0, 120);
  const requestedTopic = firstValue(filters.topic) ?? "";
  const activeTopic = blogTopics.find((topic) => topic.value === requestedTopic) ?? null;
  const currentPage = parseBlogPage(firstValue(filters.page));
  const posts = await getBlogPosts();
  const queryTokens = query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
  // The unfiltered page can use the already-sorted list directly.
  const isFiltering = Boolean(query || activeTopic);
  const filteredPosts = isFiltering
    ? posts.filter((post) => {
        const text = blogSearchText(post);
        const matchesQuery = queryTokens.every((token) => text.includes(token));
        const matchesTopic = !activeTopic || activeTopic.terms.some((term) => text.includes(term));
        return matchesQuery && matchesTopic;
      })
    : posts;
  // BlogExplorer pulls post 0 out as a large "featured" card on page 1 (but
  // only when nothing is filtered — see its own isFiltering check), which
  // otherwise leaves 11 posts for a 3-column grid and a half-empty last row.
  // Give that page one extra post so the remaining grid count stays a
  // multiple of 3; every other page keeps the plain 12-per-page split.
  const firstPageSize = isFiltering ? GRID_PAGE_SIZE : GRID_PAGE_SIZE + 1;
  const totalPages =
    filteredPosts.length <= firstPageSize
      ? 1
      : 1 + Math.ceil((filteredPosts.length - firstPageSize) / GRID_PAGE_SIZE);
  if (currentPage > totalPages) notFound();
  const pagePosts =
    currentPage === 1
      ? filteredPosts.slice(0, firstPageSize)
      : filteredPosts.slice(
          firstPageSize + (currentPage - 2) * GRID_PAGE_SIZE,
          firstPageSize + (currentPage - 1) * GRID_PAGE_SIZE,
        );
  return { query, requestedTopic, activeTopic, currentPage, totalPages, pagePosts, totalPosts: filteredPosts.length };
}

export async function generateMetadata({ searchParams }: BlogPageProps) {
  const { query, requestedTopic, currentPage } = await getBlogPageData(searchParams);
  const hasFilters = Boolean(query || requestedTopic);
  const title = currentPage > 1 ? `${pageTitle} — Page ${currentPage}` : pageTitle;

  return buildMetadata(
    title,
    pageDescription,
    hasFilters ? "/blog" : currentPage > 1 ? `/blog?page=${currentPage}` : "/blog",
    { keywords: pageKeywords, noIndex: hasFilters },
  );
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { query, requestedTopic, activeTopic, currentPage, totalPages, pagePosts, totalPosts } = await getBlogPageData(searchParams);
  // Only the posts actually on screen are narrowed to the card fields.
  const explorerPosts = pagePosts.map(
    ({ slug, title, excerpt, category, readTime, coverImage }) => ({
      slug,
      title,
      excerpt,
      category,
      readTime,
      coverImage,
    }),
  );

  return (
    <>
      <PageStructuredData
        path={query || requestedTopic || currentPage === 1 ? "/blog" : `/blog?page=${currentPage}`}
        name={pageTitle}
        description={pageDescription}
        type="CollectionPage"
        keywords={pageKeywords}
      />
      <JsonLd data={blogJsonLd(pagePosts)} />
      <BlogExplorer
        posts={explorerPosts}
        totalPosts={totalPosts}
        currentPage={currentPage}
        totalPages={totalPages}
        query={query}
        activeTopic={activeTopic?.value ?? null}
      />
    </>
  );
}
