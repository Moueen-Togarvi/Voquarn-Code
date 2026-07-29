"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { BlogEditor } from "@/components/admin/blog-editor";
import { ImageUpload } from "@/components/admin/image-upload";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";

type BlogFormData = {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: Record<string, unknown>[] | null;
  coverImage: string;
  category: string;
  readTime: string;
  published: boolean;
  publishedAt: string | null;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function BlogForm({ postId }: { postId?: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!postId);
  const [slugEdited, setSlugEdited] = useState(false);

  const [form, setForm] = useState<BlogFormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: null,
    coverImage: "",
    category: "",
    readTime: "",
    published: false,
    publishedAt: null,
  });

  const fetchPost = useCallback(async () => {
    if (!postId) return;
    try {
      const res = await fetch(`/api/admin/blog/${postId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setForm({
        id: data.id,
        title: data.title || "",
        slug: data.slug || "",
        excerpt: data.excerpt || "",
        content: data.content || null,
        coverImage: data.coverImage || "",
        category: data.category || "",
        readTime: data.readTime || "",
        published: data.published || false,
        publishedAt: data.publishedAt,
      });
      if (data.slug) setSlugEdited(true);
    } catch {
      toast.error("Failed to load blog post");
    } finally {
      setFetching(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugEdited) {
      setForm((f) => ({ ...f, slug: slugify(f.title) }));
    }
  }, [slugEdited]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!form.title.trim()) {
      toast.error("Title is required");
      setLoading(false);
      return;
    }

    try {
      const url = postId ? `/api/admin/blog/${postId}` : "/api/admin/blog";
      const method = postId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.error || "Failed to save");
      }

      toast.success(postId ? "Blog post updated!" : "Blog post created!");
      router.push("/admin/blog");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[var(--muted)]" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--foreground)]">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter blog post title"
              required
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-base font-medium text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none focus:ring-2 focus:ring-[#ff5400]/20"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--foreground)]">
              URL Slug
            </label>
            <div className="flex items-center rounded-xl border border-[var(--border)] bg-[var(--panel)] pr-4">
              <span className="pl-4 text-sm text-[var(--muted)]">/blog/</span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => {
                  setForm({ ...form, slug: e.target.value });
                  setSlugEdited(true);
                }}
                placeholder="auto-generated-from-title"
                className="flex-1 bg-transparent px-1 py-3 text-sm text-[var(--foreground)] focus:outline-none"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--foreground)]">
              Excerpt
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="A short summary of the article..."
              rows={3}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none focus:ring-2 focus:ring-[#ff5400]/20 resize-none"
            />
          </div>

          {/* Content Editor */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--foreground)]">
              Content
            </label>
            <BlogEditor
              content={form.content || undefined}
              onChange={(content) => setForm({ ...form, content })}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Box */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
            <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">
              Publish
            </h3>
            <div className="flex items-center justify-between">
              <label className="text-sm text-[var(--muted)]">
                {form.published ? "Published" : "Draft"}
              </label>
              <Switch
                checked={form.published}
                onCheckedChange={(checked) =>
                  setForm({ ...form, published: checked })
                }
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-[#ff5400] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#e04800] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {postId ? "Update Post" : "Save Post"}
                </>
              )}
            </button>
            <Link
              href="/admin/blog"
              className="mt-2 block rounded-xl border border-[var(--border)] px-4 py-2.5 text-center text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
            >
              Cancel
            </Link>
          </div>

          {/* Category & Read Time */}
          <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Details
            </h3>
            <div className="space-y-2">
              <label className="text-xs font-medium text-[var(--muted)]">
                Category
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                placeholder="SEO Articles"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-[var(--muted)]">
                Read Time
              </label>
              <input
                type="text"
                value={form.readTime}
                onChange={(e) =>
                  setForm({ ...form, readTime: e.target.value })
                }
                placeholder="5 min read"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
            <ImageUpload
              value={form.coverImage}
              onChange={(coverImage) => setForm({ ...form, coverImage })}
              label="Cover Image"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
