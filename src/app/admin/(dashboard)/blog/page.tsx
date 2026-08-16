"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { FileText, Search, ExternalLink } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";

type Post = {
  title: string;
  slug: string;
  category: string | null;
  published: boolean;
  publishedAt: string | null;
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/blog");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <AdminPageHeader
        title="Blog Posts"
        description={`${posts.length} Markdown post${posts.length !== 1 ? "s" : ""} in content/blogs`}
        backHref="/admin"
      />

      <p className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">
        Blog posts are read from Markdown files and are not stored or edited in the database.
      </p>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
        />
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] py-2.5 pl-10 pr-4 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-[var(--muted)]">
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText size={40} className="text-[var(--muted)] mb-3" />
            <p className="text-[var(--foreground)] font-medium">
              {search ? "No posts found" : "No blog posts yet"}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-[var(--border)] bg-[var(--surface)]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Title
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)] sm:table-cell">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Status
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)] md:table-cell">
                  Date
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((post) => (
                <tr key={post.slug} className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3">
                    <div className="font-medium text-[var(--foreground)]">
                      {post.title}
                    </div>
                    <div className="text-xs text-[var(--muted)]">
                      /{post.slug}
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    {post.category && (
                      <Badge variant="secondary">{post.category}</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {post.published ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="outline">Draft</Badge>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-[var(--muted)] md:table-cell">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {post.published && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors"
                          title="View"
                        >
                          <ExternalLink size={15} />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
