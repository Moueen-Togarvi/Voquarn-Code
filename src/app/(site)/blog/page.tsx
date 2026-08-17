import { JsonLd } from "@/components/seo/json-ld";
import { PageStructuredData } from "@/components/seo/page-structured-data";
import { BlogExplorer } from "@/components/ui/blog-explorer";
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

export const metadata = buildMetadata(
  pageTitle,
  pageDescription,
  "/blog",
  {
    keywords: pageKeywords,
  },
);

// Regenerated hourly so new/edited posts reach the live site without a redeploy.
export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const searchablePosts = posts.map(({ slug, title, excerpt, category, readTime, coverImage }) => ({
    slug,
    title,
    excerpt,
    category,
    readTime,
    coverImage,
  }));

  return (
    <>
      <PageStructuredData
        path="/blog"
        name={pageTitle}
        description={pageDescription}
        type="CollectionPage"
        keywords={pageKeywords}
      />
      <JsonLd data={blogJsonLd(posts.map((p) => ({ ...p, publishedAt: p.publishedAt })))} />
      <BlogExplorer posts={searchablePosts} />
    </>
  );
}
