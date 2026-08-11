import Link from "next/link";
import Image from "next/image";
import { NewsletterForm } from "@/components/ui/newsletter-form";
import { JsonLd } from "@/components/seo/json-ld";
import { PageStructuredData } from "@/components/seo/page-structured-data";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/metadata";
import { blogJsonLd } from "@/lib/schema";
import { getBlogPosts } from "@/lib/data";
import { ArrowRight, Clock, Rss } from "lucide-react";

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

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const [featured, ...rest] = posts;

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

      {/* Header */}
      <section className="page-section mt-24 lg:mt-32 pt-40 lg:pt-56">
        <SectionHeading
          eyebrow="Blog"
          title="SEO articles and practical tech notes"
          description="Short reads on digital growth, product thinking, and how to use modern tooling without losing operational clarity."
          headingLevel="h1"
        />

        {/* Featured + Newsletter row */}
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          {/* Featured Article — Redesigned */}
          {featured && (
            <article className="group relative overflow-hidden rounded-[2rem] bg-[var(--foreground)] flex flex-col min-h-[320px]">
              {/* Cover image with gradient overlay */}
              <div className="absolute inset-0">
                {featured.coverImage ? (
                  <Image
                    src={featured.coverImage}
                    alt={featured.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-[#ff5400]/20 to-[#ff5400]/5" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              </div>

              <div className="relative z-10 flex flex-1 flex-col justify-end p-8 sm:p-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff5400]/10 rounded-full blur-3xl pointer-events-none" />
                <span className="relative z-10 inline-block w-fit text-[10px] font-black uppercase tracking-[0.22em] text-[#ff5400] bg-[#ff5400]/10 border border-[#ff5400]/20 rounded-full px-3 py-1 mb-4">
                  {featured.category}
                </span>
                <h2 className="relative z-10 font-display text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight text-white">
                  {featured.title}
                </h2>
                <p className="relative z-10 mt-3 text-sm leading-relaxed text-white/70 max-w-lg">
                  {featured.excerpt}
                </p>
                <div className="relative z-10 flex items-center justify-between mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-white/50">
                    <Clock className="w-3.5 h-3.5" />
                    {featured.readTime}
                  </div>
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-[#ff5400] px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-white hover:bg-[#e04800] transition-all hover:gap-3"
                  >
                    Read article<span className="sr-only"> {featured.title}</span> <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          )}

          {/* Newsletter */}
          <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-8 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#ff5400]/10 flex items-center justify-center text-[#ff5400] mb-5">
                <Rss className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-extrabold text-[var(--foreground)] tracking-tight">
                Join the newsletter
              </h3>
              <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
                Get new articles, SEO notes, and workflow ideas without inbox spam.
              </p>
            </div>
            <div className="mt-8">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>

      {/* Rest of posts — Redesigned Grid Cards */}
      <section className="page-section pt-4 pb-24">
        {rest.length > 0 && (
          <>
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[var(--muted)] mb-8">
              More Articles
            </p>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {rest.map((post) => (
                <article
                  key={post.slug}
                  className="group rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] overflow-hidden flex flex-col hover:border-[#ff5400]/40 hover:shadow-[0_12px_40px_rgba(255,84,0,0.08)] hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image area */}
                  {post.coverImage && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-6">
                    <span className="inline-block w-fit text-[10px] font-black uppercase tracking-[0.2em] text-[#ff5400] bg-[#ff5400]/5 rounded-full px-2.5 py-1">
                      {post.category}
                    </span>
                    <h2 className="mt-3 font-display text-lg font-extrabold text-[var(--foreground)] leading-snug tracking-tight group-hover:text-[#ff5400] transition-colors">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center justify-between pt-4 border-t border-[var(--border)]">
                      <span className="text-[10px] font-bold text-[var(--muted)] flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#ff5400] hover:gap-2.5 transition-all duration-200"
                      >
                        Read<span className="sr-only"> {post.title}</span> <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
