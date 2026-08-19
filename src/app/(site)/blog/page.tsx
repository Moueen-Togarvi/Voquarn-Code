import { JsonLd } from "@/components/seo/json-ld";
import { PageStructuredData } from "@/components/seo/page-structured-data";
import {
  BlogExplorer,
  blogSearchText,
  blogTopics,
} from "@/components/ui/blog-explorer";
import { buildMetadata } from "@/lib/metadata";
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

const POSTS_PER_PAGE = 12;

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

export async function generateMetadata({ searchParams }: BlogPageProps) {
  const filters = await searchParams;
  const hasFilters = Boolean(firstValue(filters.q)?.trim() || firstValue(filters.topic));
  const parsedPage = Number.parseInt(firstValue(filters.page) ?? "1", 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 1 ? parsedPage : 1;
  const title = page > 1 ? `${pageTitle} — Page ${page}` : pageTitle;

  return buildMetadata(
    title,
    pageDescription,
    hasFilters ? "/blog" : page > 1 ? `/blog?page=${page}` : "/blog",
    { keywords: pageKeywords, noIndex: hasFilters },
  );
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const filters = await searchParams;
  const query = (firstValue(filters.q) ?? "").trim().slice(0, 120);
  const requestedTopic = firstValue(filters.topic) ?? "";
  const activeTopic = blogTopics.find((topic) => topic.value === requestedTopic) ?? null;
  const parsedPage = Number.parseInt(firstValue(filters.page) ?? "1", 10);
  const posts = await getBlogPosts();
  const searchablePosts = posts.map(({ slug, title, excerpt, category, readTime, coverImage }) => ({
    slug,
    title,
    excerpt,
    category,
    readTime,
    coverImage,
  }));
  const queryTokens = query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const filteredPosts = searchablePosts.filter((post) => {
    const text = blogSearchText(post);
    const matchesQuery = queryTokens.every((token) => text.includes(token));
    const matchesTopic = !activeTopic || activeTopic.terms.some((term) => text.includes(term));
    return matchesQuery && matchesTopic;
  });
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const currentPage = Number.isFinite(parsedPage) ? Math.min(Math.max(parsedPage, 1), totalPages) : 1;
  const pagePosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  return (
    <>
      <PageStructuredData
        path="/blog"
        name={pageTitle}
        description={pageDescription}
        type="CollectionPage"
        keywords={pageKeywords}
      />
      <JsonLd
        data={blogJsonLd(
          posts.filter((post) => pagePosts.some((pagePost) => pagePost.slug === post.slug)),
        )}
      />
      <BlogExplorer
        posts={pagePosts}
        totalPosts={filteredPosts.length}
        currentPage={currentPage}
        totalPages={totalPages}
        query={query}
        activeTopic={activeTopic?.value ?? null}
      />
    </>
  );
}
