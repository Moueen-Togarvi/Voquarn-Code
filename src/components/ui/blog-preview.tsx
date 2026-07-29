"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { useEffect, useState } from "react";

type PreviewPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  coverImage?: string | null;
};

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(255,84,0,0.06)] hover:border-[#ff5400]/30 flex flex-col"
            >
              {/* Image */}
              {post.coverImage && (
                <div className="relative aspect-[16/9] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}

              <div className="flex flex-1 flex-col p-6">
                <span className="inline-block w-fit text-[10px] font-black uppercase tracking-[0.2em] text-[#ff5400] bg-[#ff5400]/5 rounded-full px-2.5 py-1 mb-3">
                  {post.category}
                </span>

                <h3 className="text-[17px] font-bold leading-snug text-[var(--foreground)] group-hover:text-[#ff5400] transition-colors mb-3">
                  {post.title}
                </h3>

                <p className="text-[13px] font-medium leading-6 text-[var(--muted)] flex-1 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[var(--muted)] flex items-center gap-1">
                    <Clock size={12} />
                    {post.readTime}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#ff5400] group-hover:gap-2 transition-all">
                    Read <ArrowRight size={12} />
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
