import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Clock3,
  PenLine,
  Sparkles,
} from "lucide-react";
import { ArticleShare } from "@/components/ui/article-share";
import { categoryBadgeStyle, categoryColor } from "@/lib/category-color";
import { JsonLd } from "@/components/seo/json-ld";
import { PageStructuredData } from "@/components/seo/page-structured-data";
import { extractTableOfContents, RichContent } from "@/components/ui/rich-content";
import { TableOfContents } from "@/components/ui/table-of-contents";
import { getBlogPost, getBlogPosts } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";
import { articleKeywordCluster } from "@/lib/seo-keywords";
import { blogPostJsonLd } from "@/lib/schema";
import { getSiteUrl } from "@/lib/site-url";

type BlogPostPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return buildMetadata("Article not found", "The requested article could not be found.", "/blog");

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
  if (!post) notFound();

  const categoryPosts = posts.filter((candidate) => candidate.category === post.category);
  const relatedCandidates = categoryPosts.length > 1 ? categoryPosts : posts;
  const currentIndex = relatedCandidates.findIndex((candidate) => candidate.slug === post.slug);
  const relatedPosts = Array.from(
    { length: Math.min(3, Math.max(0, relatedCandidates.length - 1)) },
    (_, offset) => relatedCandidates[(currentIndex + offset + 1) % relatedCandidates.length],
  );
  const hasRichContent = Boolean(post.content?.length);
  const tableOfContents = hasRichContent ? extractTableOfContents(post.content!) : [];
  const pageKeywords = articleKeywordCluster(post.title, post.category);
  const articleUrl = new URL(`/blog/${post.slug}`, getSiteUrl()).toString();
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
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

      <main className="mx-auto mt-24 w-full max-w-7xl px-5 pb-24 pt-12 sm:pt-16 lg:mt-28 lg:px-8">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-5xl">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-[var(--muted)]">
            <li><Link href="/" className="rounded-sm hover:text-[#ff5400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400]">Home</Link></li>
            <li><ChevronRight className="h-4 w-4" aria-hidden="true" /></li>
            <li><Link href="/blog" className="rounded-sm hover:text-[#ff5400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400]">Blog</Link></li>
            <li><ChevronRight className="h-4 w-4" aria-hidden="true" /></li>
            <li className="max-w-[18rem] truncate font-semibold text-[var(--foreground)]" aria-current="page">{post.title}</li>
          </ol>
        </nav>

        <header className="mx-auto mt-10 hidden max-w-5xl text-center sm:block">
          <span style={categoryBadgeStyle(post.category, "soft")} className="hidden rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] sm:inline-flex">{post.category}</span>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-semibold text-[var(--muted)]">
            <Link href="/ceo" className="inline-flex min-h-11 items-center gap-2 rounded-full hover:text-[#ff5400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--foreground)] text-[10px] font-black text-[var(--background)]">MT</span>
              Moueen Togarvi
            </Link>
            <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#ff5400]" aria-hidden="true" /><time dateTime={post.publishedAt}>{formattedDate}</time></span>
            <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#ff5400]" aria-hidden="true" />{post.readTime}</span>
          </div>
        </header>

        <div className="mx-auto mt-10 max-w-6xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-[0_25px_70px_rgba(0,0,0,0.08)]">
          <div className="relative aspect-[4/3] min-h-[200px] sm:aspect-[16/5] sm:min-h-[190px] lg:aspect-[16/4] lg:min-h-[140px]">
            {post.coverImage ? (
              <Image src={post.coverImage} alt="" fill priority sizes="(min-width: 1280px) 1150px, 100vw" className="object-cover" />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,84,0,0.28),transparent_30%),linear-gradient(135deg,#18181b,#09090b)]" aria-hidden="true" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" aria-hidden="true" />
            <h1 className="absolute inset-x-5 bottom-4 line-clamp-4 font-display text-base font-black leading-tight text-white sm:inset-x-8 sm:bottom-6 sm:line-clamp-3 sm:text-2xl lg:text-3xl">{post.title}</h1>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
          <aside className="space-y-5 lg:sticky lg:top-28">
            <TableOfContents items={tableOfContents} />
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-[var(--foreground)]">Share this guide</p>
              <ArticleShare title={post.title} url={articleUrl} />
            </div>
          </aside>

          <article className="min-w-0 rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] px-6 py-8 shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:px-10 sm:py-11 lg:px-12">
            <div className="rounded-2xl border border-[#ff5400]/15 bg-[#ff5400]/6 p-5 sm:p-6">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--blog-accent)]"><Sparkles className="h-4 w-4" aria-hidden="true" />Quick overview</div>
              <p data-speakable className="mt-3 text-base leading-7 text-[var(--foreground)]">{post.excerpt}</p>
            </div>
            <div className="mt-7">
              {hasRichContent ? (
                <RichContent content={post.content!} />
              ) : post.sections?.length ? (
                <div className="space-y-6 text-lg leading-8 text-[var(--muted)]">{post.sections.map((section, index) => <p key={index}>{section}</p>)}</div>
              ) : (
                <p className="text-lg leading-8 text-[var(--muted)]">{post.excerpt}</p>
              )}
            </div>

            <div className="mt-12 flex flex-col gap-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--foreground)] font-display text-sm font-black text-[var(--background)]">MT</div>
              <div className="flex-1">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--blog-accent)]">Written by</p>
                <h2 className="mt-1 font-display text-xl font-black text-[var(--foreground)]">Moueen Togarvi</h2>
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">Founder & CEO at Voquarn Code, focused on product engineering, search growth, and practical AI systems.</p>
              </div>
              <Link href="/ceo" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)] px-4 text-xs font-black uppercase tracking-wider text-[var(--foreground)] hover:border-[#ff5400]/50 hover:text-[#ff5400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400]">About author<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
          </article>
        </div>

        <section className="mx-auto mt-12 max-w-6xl overflow-hidden rounded-[2rem] bg-neutral-950 p-8 text-white sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:p-12" aria-labelledby="article-cta-heading">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#ff7a38]"><PenLine className="h-4 w-4" aria-hidden="true" />Turn the insight into action</span>
            <h2 id="article-cta-heading" className="mt-4 font-display text-3xl font-black tracking-tight sm:text-4xl">Need a practical plan for your next digital project?</h2>
            <p className="mt-3 text-sm leading-6 text-white/70 sm:text-base">Tell us what you are building. We will help you clarify the scope, technical approach, and highest-value first step.</p>
          </div>
          <Link href="/contact" className="mt-7 inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-[#ff5400] px-6 text-xs font-black uppercase tracking-wider text-white hover:gap-3 hover:bg-[#e04800] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:mt-0">Discuss your project<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </section>

        {relatedPosts.length > 0 && (
          <aside className="mx-auto mt-16 max-w-6xl" aria-labelledby="related-articles-heading">
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--blog-accent)]">Keep exploring</p>
                <h2 id="related-articles-heading" className="mt-2 font-display text-3xl font-black tracking-tight text-[var(--foreground)]">Related articles</h2>
              </div>
              <Link href="/blog" className="hidden min-h-11 items-center gap-2 rounded-full px-3 text-xs font-black uppercase tracking-wider text-[var(--blog-accent)] hover:text-[#ff5400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400] sm:inline-flex">View all<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.slug} className="h-full">
                  <Link href={`/blog/${relatedPost.slug}`} aria-label={`Read ${relatedPost.title}`} className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--panel)] transition-all duration-300 hover:-translate-y-1 hover:border-[#ff5400] hover:shadow-[0_18px_40px_rgba(255,84,0,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400] focus-visible:ring-offset-2 motion-reduce:transform-none">
                  <div className="relative block aspect-[16/9] overflow-hidden bg-[var(--surface)]">
                    {relatedPost.coverImage ? <Image src={relatedPost.coverImage} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none" /> : <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,84,0,0.24),transparent_35%),linear-gradient(135deg,var(--surface),var(--panel))]" />}
                    <div className="absolute inset-0 bg-[#ff5400]/0 transition-colors duration-300 group-hover:bg-[#ff5400]/8" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p style={{ color: categoryColor(relatedPost.category) }} className="text-[10px] font-black uppercase tracking-[0.17em]">{relatedPost.category}</p>
                    <h3 className="mt-2 flex-1 font-display text-lg font-black leading-snug text-[var(--foreground)] transition-colors duration-300 group-hover:text-[var(--blog-accent)]">{relatedPost.title}</h3>
                    <div className="mt-3 flex min-h-8 items-center justify-between border-t border-[var(--border)] pt-3 text-xs text-[var(--muted)] transition-colors duration-300 group-hover:border-[#ff5400]/30"><span>{relatedPost.readTime}</span><span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface)] transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-[#ff5400] group-hover:text-white motion-reduce:transform-none"><ArrowRight className="h-4 w-4" aria-hidden="true" /></span></div>
                  </div>
                  </Link>
                </article>
              ))}
            </div>
          </aside>
        )}
      </main>
    </>
  );
}
