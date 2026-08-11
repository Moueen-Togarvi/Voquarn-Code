"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save, Plus, X } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/components/admin/image-upload";

type PortfolioFormData = {
  id?: number;
  title: string;
  slug: string;
  category: string;
  summary: string;
  outcome: string;
  stack: string[];
  liveUrl: string;
  imageUrl: string;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const categories = [
  "Web Development",
  "App Development",
  "Ecommerce",
  "SEO",
  "AI Solutions",
  "Graphic Design",
];

export function PortfolioForm({ itemId }: { itemId?: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!itemId);
  const [slugEdited, setSlugEdited] = useState(false);
  const [stackInput, setStackInput] = useState("");

  const [form, setForm] = useState<PortfolioFormData>({
    title: "",
    slug: "",
    category: "Web Development",
    summary: "",
    outcome: "",
    stack: [],
    liveUrl: "",
    imageUrl: "",
  });

  const fetchItem = useCallback(async () => {
    if (!itemId) return;
    try {
      const res = await fetch(`/api/admin/portfolio/${itemId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setForm({
        id: data.id,
        title: data.title || "",
        slug: data.slug || "",
        category: data.category || "Web Development",
        summary: data.summary || "",
        outcome: data.outcome || "",
        stack: data.stack || [],
        liveUrl: data.liveUrl || "",
        imageUrl: data.imageUrl || "",
      });
      if (data.slug) setSlugEdited(true);
    } catch {
      toast.error("Failed to load portfolio item");
    } finally {
      setFetching(false);
    }
  }, [itemId]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

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
      const url = itemId ? `/api/admin/portfolio/${itemId}` : "/api/admin/portfolio";
      const method = itemId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.error || "Failed to save");
      }

      toast.success(itemId ? "Portfolio item updated!" : "Portfolio item created!");
      router.push("/admin/portfolio");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
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
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--foreground)]">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Project title"
              required
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-base font-medium text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none focus:ring-2 focus:ring-[#ff5400]/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--foreground)]">Summary</label>
            <textarea
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="Brief summary of the project..."
              rows={3}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none focus:ring-2 focus:ring-[#ff5400]/20 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--foreground)]">Outcome</label>
            <textarea
              value={form.outcome}
              onChange={(e) => setForm({ ...form, outcome: e.target.value })}
              placeholder="What was the result? (e.g. 32% increase in bookings)"
              rows={2}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none focus:ring-2 focus:ring-[#ff5400]/20 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--foreground)]">Tech Stack</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={stackInput}
                onChange={(e) => setStackInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (stackInput.trim()) {
                      setForm((f) => ({ ...f, stack: [...f.stack, stackInput.trim()] }));
                      setStackInput("");
                    }
                  }
                }}
                placeholder="Add technology..."
                className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (stackInput.trim()) {
                    setForm((f) => ({ ...f, stack: [...f.stack, stackInput.trim()] }));
                    setStackInput("");
                  }
                }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff5400]/10 text-[#ff5400] hover:bg-[#ff5400]/20"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.stack.map((s, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--surface)] px-2.5 py-1 text-xs text-[var(--foreground)]">
                  {s}
                  <button type="button" onClick={() => setForm((f) => ({ ...f, stack: f.stack.filter((_, idx) => idx !== i) }))} className="text-[var(--muted)] hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Save</h3>
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#ff5400] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#e04800] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> {itemId ? "Update" : "Save"}</>}
            </button>
            <Link href="/admin/portfolio" className="block rounded-xl border border-[var(--border)] px-4 py-2.5 text-center text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors">
              Cancel
            </Link>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 space-y-3">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Details</h3>
            <div className="space-y-2">
              <label className="text-xs font-medium text-[var(--muted)]">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-[var(--muted)]">URL Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => { setForm({ ...form, slug: e.target.value }); setSlugEdited(true); }}
                placeholder="auto-generated"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-[var(--muted)]">Live URL</label>
              <input
                type="url"
                value={form.liveUrl}
                onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                placeholder="https://..."
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
            <ImageUpload value={form.imageUrl} onChange={(imageUrl) => setForm({ ...form, imageUrl })} label="Project Image" />
          </div>
        </div>
      </div>
    </form>
  );
}
