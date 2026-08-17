import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { PageStructuredData } from "@/components/seo/page-structured-data";
import { buildMetadata } from "@/lib/metadata";
import { blogPostJsonLd } from "@/lib/schema";
import { getBlogPost, getBlogPosts } from "@/lib/data";
import { RichContent } from "@/components/ui/rich-content";
import { articleKeywordCluster } from "@/lib/seo-keywords";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

// Markdown is deployed with the application, so every published file is built
// as a known route and content changes become live with the next deployment.
export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return buildMetadata("Article not found", "The requested article could not be found.", "/blog");
  }

  return buildMetadata(`${post.title} | Voquarn Code`, post.excerpt, `/blog/${post.slug}`, {
    type: "article",
    publishedTime: post.publishedAt,
    keywords: articleKeywordCluster(post.title, post.category),
    ...(post.coverImage ? { image: post.coverImage } : {}),
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([getBlogPost(slug), getBlogPosts()]);

  if (!post) {
    notFound();
  }

  const categoryPosts = posts.filter((candidate) => candidate.category === post.category);
  const relatedCandidates = categoryPosts.length > 1 ? categoryPosts : posts;
  const currentIndex = relatedCandidates.findIndex((candidate) => candidate.slug === post.slug);
  const relatedPosts = Array.from(
    { length: Math.min(3, Math.max(0, relatedCandidates.length - 1)) },
    (_, offset) => relatedCandidates[(currentIndex + offset + 1) % relatedCandidates.length],
  );

  const hasRichContent =
    post.content && Array.isArray(post.content) && post.content.length > 0;
  const pageKeywords = articleKeywordCluster(post.title, post.category);

  return (
    <section className="page-section">
      <PageStructuredData
        path={`/blog/${post.slug}`}
        name={post.title}
        description={post.excerpt}
        type="WebPage"
        keywords={pageKeywords}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />
      <JsonLd data={blogPostJsonLd(post)} />

      <article className="mx-auto max-w-4xl rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-8 sm:p-10">
        {/* Cover image */}
        {post.coverImage && (
          <div className="relative -mx-8 -mt-8 sm:-mx-10 sm:-mt-10 mb-8 aspect-[16/8] overflow-hidden rounded-t-[2rem]">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              sizes="(min-width: 1024px) 900px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <p className="text-sm uppercase tracking-[0.18em] text-[#ff5400]">{post.category}</p>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-[var(--foreground)] sm:text-5xl leading-tight">
          {post.title}
        </h1>
        <p className="mt-4 text-[var(--muted)]">
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}{" "}
          • {post.readTime}
        </p>

        <div className="mt-8">
          {hasRichContent ? (
            <RichContent content={post.content!} />
          ) : post.sections && post.sections.length > 0 ? (
            <div className="space-y-6 text-lg leading-8 text-[var(--foreground)]">
              {post.sections.map((section, i) => (
                <p key={i}>{section}</p>
              ))}
            </div>
          ) : (
            <p className="text-lg text-[var(--muted)]">{post.excerpt}</p>
          )}
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <aside className="mx-auto mt-8 max-w-4xl" aria-labelledby="related-articles-heading">
          <h2
            id="related-articles-heading"
            className="font-display text-2xl font-extrabold text-[var(--foreground)]"
          >
            Related articles
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.slug}
                href={`/blog/${relatedPost.slug}`}
                className="group flex min-h-36 flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 transition-colors hover:border-[#ff5400]/50"
              >
                <span className="text-sm font-bold leading-snug text-[var(--foreground)] group-hover:text-[#ff5400]">
                  {relatedPost.title}
                </span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#ff5400]">
                  Read article
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </section>
  );
}
