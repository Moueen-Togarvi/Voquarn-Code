"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Circle, Clock, Grip } from "lucide-react";
import { useEffect, useState } from "react";

type PreviewPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  coverImage?: string | null;
};

const fallbackBlogImages: Record<string, string> = {
  "technical-seo-basics-for-service-sites":
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
  "when-to-build-a-client-portal":
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
  "using-ai-without-breaking-operations":
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop",
};

const formatReadTime = (readTime: string) => readTime.replace(/\s*read$/i, "").toUpperCase();

export function BlogPreview() {
  const [posts, setPosts] = useState<PreviewPost[]>([]);

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => setPosts(data.slice(0, 3) || []))
      .catch(() => setPosts([]));
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="relative w-full py-20 md:py-24 bg-[var(--background)] border-b border-[var(--section-border)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#ff5400]" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#ff5400]">
                Blog
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-display text-[var(--foreground)]">
              Latest Insights
            </h2>
            <p className="mt-3 max-w-lg text-[15px] font-medium leading-7 text-[var(--muted)]">
              Practical thinking on SEO, product design, and AI adoption for growing businesses.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)] px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-all"
          >
            View all posts <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex min-h-[360px] flex-col overflow-hidden rounded-[18px] border border-neutral-200 bg-white text-neutral-950 shadow-[0_14px_35px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#ff5400]/45 hover:shadow-[0_22px_48px_rgba(255,84,0,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400] focus-visible:ring-offset-2"
            >
              <div className="relative aspect-[1.6/1] overflow-hidden bg-neutral-950">
                <Image
                  src={post.coverImage || fallbackBlogImages[post.slug] || fallbackBlogImages["when-to-build-a-client-portal"]}
                  alt={post.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover grayscale brightness-[0.48] contrast-125 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
                <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/65 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
                  <Circle className="h-1.5 w-1.5 fill-[#ff5400] text-[#ff5400]" />
                  {post.category}
                </span>
                <div className="absolute bottom-4 right-4 inline-flex h-12 w-12 flex-col items-center justify-center rounded-2xl bg-black/55 text-white shadow-[0_10px_24px_rgba(0,0,0,0.25)] backdrop-blur-md">
                  <Clock className="h-3 w-3 text-[#ff5400]" />
                  <span className="mt-0.5 text-[10px] font-black leading-none">{formatReadTime(post.readTime)}</span>
                </div>
              </div>

              <div className="flex flex-1 flex-col border-t-[3px] border-[#ff5400] bg-white p-4 sm:p-5">
                <Grip className="mb-2 h-4 w-4 text-[#ff5400]" />

                <h3 className="mb-2 text-[18px] font-black leading-[1.18] tracking-tight text-neutral-950 transition-colors group-hover:text-[#ff5400]">
                  {post.title}
                </h3>

                <p className="mb-3 line-clamp-2 flex-1 text-[12px] font-medium leading-5 text-neutral-600">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#d94700]">
                    Read Article
                  </span>
                  <span className="h-px flex-1 bg-[#ff5400]/25 transition-colors group-hover:bg-[#ff5400]/60" />
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#ff5400] text-white shadow-[0_10px_24px_rgba(255,84,0,0.24)] transition-all duration-300 group-hover:translate-x-1 group-hover:bg-[#e04800]">
                    <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
