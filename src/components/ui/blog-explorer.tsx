import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpenText, Clock3, Search } from "lucide-react";
import { categoryBadgeStyle } from "@/lib/category-color";

export type BlogExplorerPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  coverImage?: string | null;
};

export type BlogTopic = { label: string; value: string; terms: string[] };

export const blogTopics: BlogTopic[] = [
  { label: "Software Agency", value: "software-agency", terms: ["software agency", "software company"] },
  { label: "Web Development", value: "web-development", terms: ["web development", "website agency", "web agency"] },
  { label: "Digital & SEO", value: "digital-seo", terms: ["digital agency", "seo", "aeo", "geo"] },
  { label: "Ecommerce", value: "ecommerce", terms: ["shopify", "ecommerce", "e-commerce"] },
  { label: "AI & Automation", value: "ai-automation", terms: ["artificial intelligence", "ai ", "automation", "agent"] },
];

export function blogSearchText(post: BlogExplorerPost) {
  return `${post.title} ${post.excerpt} ${post.category}`.toLocaleLowerCase();
}

function blogHref(page: number, query: string, topic: string | null) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (topic) params.set("topic", topic);
  if (page > 1) params.set("page", String(page));
  const suffix = params.toString();
  return suffix ? `/blog?${suffix}` : "/blog";
}

function BlogCard({ post }: { post: BlogExplorerPost }) {
  return (
    <article className="h-full">
      <Link
        href={`/blog/${post.slug}`}
        aria-label={`Read ${post.title}`}
        className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--panel)] shadow-[0_12px_35px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#ff5400] hover:shadow-[0_18px_45px_rgba(255,84,0,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400] focus-visible:ring-offset-2 motion-reduce:transform-none"
      >
        <div className="relative block aspect-[16/9] overflow-hidden bg-[var(--surface)]">
          {post.coverImage ? (
            <Image src={post.coverImage} alt="" fill sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none" />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(255,84,0,0.22),transparent_35%),linear-gradient(135deg,var(--surface),var(--panel))]" />
          )}
          <div className="absolute inset-0 bg-[#ff5400]/0 transition-colors duration-300 group-hover:bg-[#ff5400]/8" />
          <span
            style={categoryBadgeStyle(post.category)}
            className="absolute left-4 top-4 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md transition-colors duration-300 group-hover:border-[#ff5400]/60 group-hover:bg-[#ff5400]"
          >{post.category}</span>
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h2 className="font-display text-xl font-extrabold leading-snug tracking-tight text-[var(--foreground)] transition-colors duration-300 group-hover:text-[var(--blog-accent)]">{post.title}</h2>
          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-[var(--muted)]">{post.excerpt}</p>
          <div className="mt-4 flex min-h-9 items-center justify-between border-t border-[var(--border)] pt-3 transition-colors duration-300 group-hover:border-[#ff5400]/30">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted)] transition-colors duration-300 group-hover:text-[var(--foreground)]"><Clock3 className="h-4 w-4 transition-colors duration-300 group-hover:text-[#ff5400]" aria-hidden="true" />{post.readTime}</span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--muted)] transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-[#ff5400] group-hover:text-white motion-reduce:transform-none">
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function paginationItems(currentPage: number, totalPages: number) {
  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  const visiblePages = [...pages].filter((page) => page > 0 && page <= totalPages).sort((a, b) => a - b);
  const items: Array<number | "ellipsis"> = [];
  visiblePages.forEach((page, index) => {
    if (index > 0 && page - visiblePages[index - 1] > 1) items.push("ellipsis");
    items.push(page);
  });
  return items;
}

function BlogPagination({ currentPage, totalPages, query, topic }: { currentPage: number; totalPages: number; query: string; topic: string | null }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="mt-12 flex flex-col items-center gap-4" aria-label="Blog pagination">
      <p className="text-sm text-[var(--muted)]">Page <span className="font-bold text-[var(--foreground)]">{currentPage}</span> of {totalPages}</p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {currentPage > 1 && (
          <Link href={blogHref(currentPage - 1, query, topic)} rel="prev" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)] px-4 text-sm font-bold text-[var(--foreground)] hover:border-[#ff5400]/50 hover:text-[#ff5400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400]">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /><span className="hidden sm:inline">Previous</span>
          </Link>
        )}
        {paginationItems(currentPage, totalPages).map((item, index) => item === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="flex h-11 w-8 items-center justify-center text-[var(--muted)]" aria-hidden="true">…</span>
        ) : (
          <Link key={item} href={blogHref(item, query, topic)} aria-current={item === currentPage ? "page" : undefined} aria-label={`Page ${item}`} className={`flex h-11 min-w-11 items-center justify-center rounded-full border px-3 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400] ${item === currentPage ? "border-[#ff5400] bg-[#ff5400] text-white" : "border-[var(--border)] bg-[var(--panel)] text-[var(--foreground)] hover:border-[#ff5400]/50 hover:text-[#ff5400]"}`}>{item}</Link>
        ))}
        {currentPage < totalPages && (
          <Link href={blogHref(currentPage + 1, query, topic)} rel="next" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)] px-4 text-sm font-bold text-[var(--foreground)] hover:border-[#ff5400]/50 hover:text-[#ff5400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400]">
            <span className="hidden sm:inline">Next</span><ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </nav>
  );
}

type BlogExplorerProps = { posts: BlogExplorerPost[]; totalPosts: number; currentPage: number; totalPages: number; query: string; activeTopic: string | null };

export function BlogExplorer({ posts, totalPosts, currentPage, totalPages, query, activeTopic }: BlogExplorerProps) {
  const isFiltering = Boolean(query || activeTopic);
  const featured = !isFiltering && currentPage === 1 ? posts[0] : undefined;
  const gridPosts = featured ? posts.slice(1) : posts;

  return (
    <div>
      <section className="mx-auto mt-14 w-full max-w-7xl px-5 pb-8 pt-14 sm:pt-20 lg:mt-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#ff5400]/20 bg-[#ff5400]/8 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#ff5400]"><BookOpenText className="h-4 w-4" aria-hidden="true" />Insights & field notes</span>
          <h1 className="mt-6 font-display text-4xl font-black tracking-tight text-[var(--foreground)] sm:text-6xl">Ideas you can put to work.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">Practical guides on building faster products, improving search visibility, and using AI with purpose.</p>
        </div>
        <form action="/blog" method="get" className="mx-auto mt-10 max-w-2xl">
          <label htmlFor="blog-search" className="sr-only">Search blog articles</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted)]" aria-hidden="true" />
            <input id="blog-search" name="q" type="search" defaultValue={query} placeholder="Search articles, topics, or technologies..." className="h-14 w-full rounded-full border border-[var(--border)] bg-[var(--panel)] pl-13 pr-28 text-base text-[var(--foreground)] shadow-[0_12px_40px_rgba(0,0,0,0.06)] outline-none transition placeholder:text-[var(--muted)] focus:border-[#ff5400]/70 focus:ring-4 focus:ring-[#ff5400]/10" />
            {activeTopic && <input type="hidden" name="topic" value={activeTopic} />}
            <button type="submit" className="absolute right-1.5 top-1/2 min-h-11 -translate-y-1/2 cursor-pointer rounded-full bg-[#ff5400] px-5 text-xs font-black uppercase tracking-wider text-white hover:bg-[#e04800] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400] focus-visible:ring-offset-2">Search</button>
          </div>
        </form>
        <div className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Popular blog topics">
          {blogTopics.map((topic) => {
            const isActive = activeTopic === topic.value;
            return <Link key={topic.value} href={blogHref(1, query, isActive ? null : topic.value)} aria-current={isActive ? "true" : undefined} className={`inline-flex min-h-11 items-center rounded-full border px-4 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400] ${isActive ? "border-[#ff5400] bg-[#ff5400] text-white" : "border-[var(--border)] bg-[var(--panel)] text-[var(--muted)] hover:border-[#ff5400]/50 hover:text-[#ff5400]"}`}>{topic.label}</Link>;
          })}
          {isFiltering && <Link href="/blog" className="inline-flex min-h-11 items-center rounded-full px-4 text-xs font-black uppercase tracking-wider text-[#ff5400] hover:bg-[#ff5400]/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400]">Clear filters</Link>}
        </div>
        <p className="mt-4 text-center text-sm text-[var(--muted)]" aria-live="polite">{isFiltering ? `${totalPosts} matching article${totalPosts === 1 ? "" : "s"}` : `${totalPosts} practical articles`}</p>

        {featured && (
          <article className="mt-10">
            <Link href={`/blog/${featured.slug}`} aria-label={`Read ${featured.title}`} className="group relative flex min-h-[360px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-950 shadow-[0_25px_70px_rgba(0,0,0,0.16)] transition-colors duration-300 hover:border-[#ff5400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400] focus-visible:ring-offset-2 sm:min-h-[430px]">
            <div className="absolute inset-0">
              {featured.coverImage ? <Image src={featured.coverImage} alt="" fill priority sizes="(min-width: 1024px) 1200px, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transform-none" /> : <div className="h-full w-full bg-[radial-gradient(circle_at_80%_20%,rgba(255,84,0,0.35),transparent_30%),linear-gradient(135deg,#18181b,#09090b)]" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/10 transition-colors duration-300 group-hover:from-black group-hover:via-black/55" />
            </div>
            <div className="relative z-10 flex flex-1 flex-col justify-end p-7 sm:p-10 lg:p-12">
              <span style={categoryBadgeStyle(featured.category, "soft")} className="mb-4 w-fit rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">Featured · {featured.category}</span>
              <h2 className="max-w-4xl font-display text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">{featured.title}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">{featured.excerpt}</p>
              <div className="mt-5 flex min-h-10 items-center gap-4 border-t border-white/15 pt-4 transition-colors duration-300 group-hover:border-[#ff5400]/45">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-white/70 transition-colors duration-300 group-hover:text-white"><Clock3 className="h-4 w-4 text-[#ff7a38]" aria-hidden="true" />{featured.readTime}</span>
                <span className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#ff5400] text-white transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"><ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
              </div>
            </div>
            </Link>
          </article>
        )}
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-24 pt-6 lg:px-8">
        {posts.length > 0 ? (
          <>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ff5400]">{isFiltering ? "Search results" : currentPage === 1 ? "Latest articles" : "Article archive"}</p>
                <h2 className="mt-2 font-display text-2xl font-black tracking-tight text-[var(--foreground)] sm:text-3xl">{isFiltering ? "Articles matching your interests" : "Explore the library"}</h2>
              </div>
              <span className="hidden text-sm text-[var(--muted)] sm:block">Page {currentPage} of {totalPages}</span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{gridPosts.map((post) => <BlogCard key={post.slug} post={post} />)}</div>
            <BlogPagination currentPage={currentPage} totalPages={totalPages} query={query} topic={activeTopic} />
          </>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--panel)] px-6 py-16 text-center">
            <Search className="mx-auto h-8 w-8 text-[#ff5400]" aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl font-extrabold text-[var(--foreground)]">No matching articles</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">Try a broader phrase or clear the topic filter to explore the full library.</p>
            <Link href="/blog" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#ff5400] px-5 text-xs font-black uppercase tracking-wider text-white hover:bg-[#e04800] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400] focus-visible:ring-offset-2">Show all articles</Link>
          </div>
        )}
      </section>
    </div>
  );
}
