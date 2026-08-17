"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Clock, Search, X } from "lucide-react";

export type BlogExplorerPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  coverImage?: string | null;
};

type Keyword = {
  label: string;
  terms: string[];
};

const keywords: Keyword[] = [
  { label: "Software Agency", terms: ["software agency", "software company"] },
  { label: "Web Development", terms: ["web development", "website agency", "web agency"] },
  { label: "Digital Agency", terms: ["digital agency", "seo"] },
  { label: "Shopify", terms: ["shopify", "ecommerce"] },
  { label: "Python & Django", terms: ["python", "django"] },
];

function searchableText(post: BlogExplorerPost) {
  return `${post.title} ${post.excerpt} ${post.category}`.toLocaleLowerCase();
}

function BlogCard({ post }: { post: BlogExplorerPost }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] transition-all duration-300 hover:-translate-y-1 hover:border-[#ff5400]/40 hover:shadow-[0_12px_40px_rgba(255,84,0,0.08)]">
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
        <span className="inline-block w-fit rounded-full bg-[#ff5400]/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#ff5400]">
          {post.category}
        </span>
        <h2 className="mt-3 font-display text-lg font-extrabold leading-snug tracking-tight text-[var(--foreground)] transition-colors group-hover:text-[#ff5400]">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--muted)]">
          {post.excerpt}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-4">
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--muted)]">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {post.readTime}
          </span>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex min-h-11 items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#ff5400] transition-all duration-200 hover:gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400] focus-visible:ring-offset-2"
          >
            Read<span className="sr-only"> {post.title}</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function BlogExplorer({ posts }: { posts: BlogExplorerPost[] }) {
  const [query, setQuery] = useState("");
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    const queryTokens = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const keyword = keywords.find((item) => item.label === activeKeyword);

    return posts.filter((post) => {
      const text = searchableText(post);
      const matchesQuery = queryTokens.every((token) => text.includes(token));
      const matchesKeyword = !keyword || keyword.terms.some((term) => text.includes(term));
      return matchesQuery && matchesKeyword;
    });
  }, [activeKeyword, posts, query]);

  const isFiltering = query.trim().length > 0 || activeKeyword !== null;
  const [featured, ...rest] = posts;

  function resetFilters() {
    setQuery("");
    setActiveKeyword(null);
  }

  return (
    <div>
      <h1 className="sr-only">Voquarn Code blog articles</h1>

      <section className="mx-auto mt-24 w-full max-w-7xl px-5 pb-6 pt-10 sm:pt-12 lg:mt-28 lg:px-8 lg:pb-8">
        <div className="mx-auto max-w-2xl">
          <label htmlFor="blog-search" className="sr-only">
            Search blog articles
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted)]"
              aria-hidden="true"
            />
            <input
              id="blog-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search articles, topics, or technologies..."
              className="h-14 w-full rounded-full border border-[var(--border)] bg-[var(--panel)] pl-13 pr-14 text-base text-[var(--foreground)] shadow-[0_12px_40px_rgba(0,0,0,0.05)] outline-none transition-all placeholder:text-[var(--muted)] focus:border-[#ff5400]/70 focus:ring-4 focus:ring-[#ff5400]/10"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[var(--muted)] hover:bg-[#ff5400]/10 hover:text-[#ff5400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400]"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2" aria-label="Popular blog topics">
            {keywords.map((keyword) => {
              const isActive = activeKeyword === keyword.label;
              return (
                <button
                  key={keyword.label}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveKeyword(isActive ? null : keyword.label)}
                  className={`min-h-11 cursor-pointer rounded-full border px-4 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400] focus-visible:ring-offset-2 ${
                    isActive
                      ? "border-[#ff5400] bg-[#ff5400] text-white"
                      : "border-[var(--border)] bg-[var(--panel)] text-[var(--muted)] hover:border-[#ff5400]/50 hover:text-[#ff5400]"
                  }`}
                >
                  {keyword.label}
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-center text-xs font-medium text-[var(--muted)]" aria-live="polite">
            {isFiltering ? `${filteredPosts.length} matching articles` : `${posts.length} practical articles`}
          </p>
        </div>

        {!isFiltering && featured && (
          <article className="group relative mt-8 flex min-h-[300px] flex-col overflow-hidden rounded-[2rem] bg-[var(--foreground)] sm:min-h-[320px]">
            <div className="absolute inset-0">
              {featured.coverImage ? (
                <Image
                  src={featured.coverImage}
                  alt={featured.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 80vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-[#ff5400]/20 to-[#ff5400]/5" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            </div>

            <div className="relative z-10 flex flex-1 flex-col justify-end p-7 sm:p-10">
              <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#ff5400]/10 blur-3xl" />
              <span className="relative z-10 mb-4 inline-block w-fit rounded-full border border-[#ff5400]/20 bg-[#ff5400]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#ff5400]">
                {featured.category}
              </span>
              <h2 className="relative z-10 font-display text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl">
                {featured.title}
              </h2>
              <p className="relative z-10 mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
                {featured.excerpt}
              </p>
              <div className="relative z-10 mt-5 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-white/60">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {featured.readTime}
                </div>
                <Link
                  href={`/blog/${featured.slug}`}
                  className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-[#ff5400] px-5 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:gap-3 hover:bg-[#e04800] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Read article<span className="sr-only"> {featured.title}</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        )}
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-24 pt-6 lg:px-8 lg:pt-8">
        {isFiltering ? (
          filteredPosts.length > 0 ? (
            <>
              <p className="mb-6 text-[11px] font-black uppercase tracking-[0.25em] text-[var(--muted)]">
                Search Results
              </p>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--panel)] px-6 py-14 text-center">
              <h2 className="font-display text-xl font-extrabold text-[var(--foreground)]">No matching articles</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--muted)]">
                Try a broader phrase or choose a different topic to explore the full library.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 min-h-11 cursor-pointer rounded-full bg-[#ff5400] px-5 text-xs font-black uppercase tracking-wider text-white hover:bg-[#e04800] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400] focus-visible:ring-offset-2"
              >
                Show all articles
              </button>
            </div>
          )
        ) : (
          rest.length > 0 && (
            <>
              <p className="mb-6 text-[11px] font-black uppercase tracking-[0.25em] text-[var(--muted)]">
                More Articles
              </p>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {rest.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </>
          )
        )}
      </section>
    </div>
  );
}
