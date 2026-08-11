"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Loader2, Plus, MessageSquare, Pencil, X, Star, Video as VideoIcon } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { MediaUpload } from "@/components/admin/media-upload";

type MediaType = "image" | "video";

type Testimonial = {
  id?: number;
  name: string;
  company: string;
  review: string;
  stars: number;
  mediaUrl: string;
  mediaType: MediaType | null;
  order: number;
};

const empty = { name: "", company: "", review: "", stars: 5, mediaUrl: "", mediaType: null, order: 0 };

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<(Testimonial & { isNew?: boolean }) | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/testimonials");
      if (res.ok) setItems(await res.json());
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSave = async () => {
    if (!editing || !editing.name.trim() || !editing.review.trim()) {
      toast.error("Name and review are required");
      return;
    }
    setSaving(true);
    try {
      const url = editing.isNew ? "/api/admin/testimonials" : `/api/admin/testimonials/${editing.id}`;
      const method = editing.isNew ? "POST" : "PUT";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
      if (!res.ok) throw new Error("Failed");
      toast.success(editing.isNew ? "Testimonial added!" : "Updated!");
      setEditing(null);
      fetchItems();
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  return (
    <div>
      <AdminPageHeader title="Testimonials" description={`${items.length} testimonial${items.length !== 1 ? "s" : ""}`} backHref="/admin" action={
        <button onClick={() => setEditing({ ...empty, isNew: true })} className="inline-flex items-center gap-2 rounded-xl bg-[#ff5400] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#e04800] transition-colors">
          <Plus size={16} /> Add Testimonial
        </button>
      } />

      {loading ? <div className="flex items-center justify-center py-20 text-[var(--muted)]">Loading...</div> :
      items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--panel)] py-20 text-center">
          <MessageSquare size={40} className="text-[var(--muted)] mb-3" />
          <p className="text-[var(--foreground)] font-medium">No testimonials yet</p>
          <button onClick={() => setEditing({ ...empty, isNew: true })} className="mt-3 text-sm text-[#ff5400] hover:underline">Add first testimonial</button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <div key={t.id} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]">
              {t.mediaUrl && (
                <div className="relative aspect-[4/3] bg-[var(--surface)]">
                  {t.mediaType === "video" ? (
                    <video src={t.mediaUrl} className="h-full w-full object-cover" muted playsInline />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.mediaUrl} alt={t.name} className="h-full w-full object-cover" />
                  )}
                  {t.mediaType === "video" && (
                    <div className="absolute left-2 top-2 flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-[10px] font-medium text-white backdrop-blur">
                      <VideoIcon size={12} /> Video
                    </div>
                  )}
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < t.stars ? "fill-amber-400 text-amber-400" : "text-[var(--muted)]"} />
                  ))}
                </div>
                <p className="text-sm text-[var(--muted)] line-clamp-3">&ldquo;{t.review}&rdquo;</p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-[var(--foreground)]">{t.name}</p>
                    {t.company && <p className="text-xs text-[var(--muted)]">{t.company}</p>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setEditing(t)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors"><Pencil size={15} /></button>
                    <DeleteDialog itemName="Testimonial" apiPath={`/api/admin/testimonials/${t.id}`} onSuccess={fetchItems} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8" onClick={() => setEditing(null)}>
          <div className="mx-4 w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">{editing.isNew ? "Add Testimonial" : "Edit"}</h2>
              <button onClick={() => setEditing(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface)]"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <MediaUpload
                value={editing.mediaUrl}
                mediaType={editing.mediaType}
                onChange={(url, type) => setEditing({ ...editing, mediaUrl: url, mediaType: type })}
                label="Photo or Video (optional)"
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--foreground)]">Name *</label>
                  <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Client name" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--foreground)]">Company</label>
                  <input value={editing.company} onChange={(e) => setEditing({ ...editing, company: e.target.value })} placeholder="Company" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Stars</label>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button key={i} type="button" onClick={() => setEditing({ ...editing, stars: i + 1 })} className="transition-colors">
                      <Star size={24} className={i < editing.stars ? "fill-amber-400 text-amber-400" : "text-[var(--muted)]"} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Review *</label>
                <textarea value={editing.review} onChange={(e) => setEditing({ ...editing, review: e.target.value })} rows={4} placeholder="Client testimonial..." className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving} className="flex-1 rounded-xl bg-[#ff5400] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#e04800] disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Save"}
                </button>
                <button onClick={() => setEditing(null)} className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)]">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
