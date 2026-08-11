"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Building2, Pencil, X, Tag } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { ImageUpload } from "@/components/admin/image-upload";

type LogoItem = { id?: number; name: string; logoUrl: string; order: number };
type CategoryItem = { id?: number; label: string; order: number };

const emptyLogo = { name: "", logoUrl: "", order: 0 };
const emptyCategory = { label: "", order: 0 };

export default function AdminTrustedClientsPage() {
  const [logos, setLogos] = useState<LogoItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLogo, setEditingLogo] = useState<(LogoItem & { isNew?: boolean }) | null>(null);
  const [editingCategory, setEditingCategory] = useState<(CategoryItem & { isNew?: boolean }) | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [logosRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/client-logos"),
        fetch("/api/admin/client-categories"),
      ]);
      if (logosRes.ok) setLogos(await logosRes.json());
      if (categoriesRes.ok) setCategories(await categoriesRes.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleSaveLogo = async () => {
    if (!editingLogo || !editingLogo.name.trim() || !editingLogo.logoUrl.trim()) {
      toast.error("Name and logo image are required");
      return;
    }
    setSaving(true);
    try {
      const url = editingLogo.isNew ? "/api/admin/client-logos" : `/api/admin/client-logos/${editingLogo.id}`;
      const method = editingLogo.isNew ? "POST" : "PUT";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingLogo) });
      if (!res.ok) throw new Error("Failed");
      toast.success(editingLogo.isNew ? "Logo added!" : "Updated!");
      setEditingLogo(null);
      fetchAll();
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  const handleSaveCategory = async () => {
    if (!editingCategory || !editingCategory.label.trim()) {
      toast.error("Label is required");
      return;
    }
    setSaving(true);
    try {
      const url = editingCategory.isNew ? "/api/admin/client-categories" : `/api/admin/client-categories/${editingCategory.id}`;
      const method = editingCategory.isNew ? "POST" : "PUT";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingCategory) });
      if (!res.ok) throw new Error("Failed");
      toast.success(editingCategory.isNew ? "Category added!" : "Updated!");
      setEditingCategory(null);
      fetchAll();
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  return (
    <div className="space-y-10">
      <AdminPageHeader title="Trusted Clients" description="The 'Teams we've worked with' section on the homepage" backHref="/admin" />

      {loading ? (
        <div className="flex items-center justify-center py-20 text-[var(--muted)]">Loading...</div>
      ) : (
        <>
          {/* ── Client Logos ── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-[var(--foreground)]">Client Logos</h2>
                <p className="text-xs text-[var(--muted)] mt-0.5">{logos.length} logo{logos.length !== 1 ? "s" : ""} in the marquee</p>
              </div>
              <button onClick={() => setEditingLogo({ ...emptyLogo, isNew: true })} className="inline-flex items-center gap-2 rounded-xl bg-[#ff5400] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#e04800] transition-colors">
                <Plus size={16} /> Add Logo
              </button>
            </div>

            {logos.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--panel)] py-16 text-center">
                <Building2 size={36} className="text-[var(--muted)] mb-3" />
                <p className="text-[var(--foreground)] font-medium">No client logos yet</p>
                <button onClick={() => setEditingLogo({ ...emptyLogo, isNew: true })} className="mt-3 text-sm text-[#ff5400] hover:underline">Add first logo</button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {logos.map((l) => (
                  <div key={l.id} className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 text-center">
                    <div className="relative mx-auto mb-3 h-16 w-16 overflow-hidden rounded-xl bg-[var(--surface)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={l.logoUrl} alt={l.name} className="h-full w-full object-contain" />
                    </div>
                    <p className="text-sm font-medium text-[var(--foreground)] truncate">{l.name}</p>
                    <div className="mt-2 flex justify-center gap-1">
                      <button onClick={() => setEditingLogo(l)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors"><Pencil size={15} /></button>
                      <DeleteDialog itemName="Logo" apiPath={`/api/admin/client-logos/${l.id}`} onSuccess={fetchAll} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Category Chips ── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-[var(--foreground)]">Category Chips</h2>
                <p className="text-xs text-[var(--muted)] mt-0.5">{categories.length} categor{categories.length !== 1 ? "ies" : "y"} in the second marquee row</p>
              </div>
              <button onClick={() => setEditingCategory({ ...emptyCategory, isNew: true })} className="inline-flex items-center gap-2 rounded-xl bg-[#ff5400] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#e04800] transition-colors">
                <Plus size={16} /> Add Category
              </button>
            </div>

            {categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--panel)] py-16 text-center">
                <Tag size={36} className="text-[var(--muted)] mb-3" />
                <p className="text-[var(--foreground)] font-medium">No categories yet</p>
                <button onClick={() => setEditingCategory({ ...emptyCategory, isNew: true })} className="mt-3 text-sm text-[#ff5400] hover:underline">Add first category</button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {categories.map((c) => (
                  <div key={c.id} className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)] py-2 pl-4 pr-2">
                    <span className="text-sm text-[var(--foreground)]">{c.label}</span>
                    <button onClick={() => setEditingCategory(c)} className="flex h-6 w-6 items-center justify-center rounded-full text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors"><Pencil size={12} /></button>
                    <DeleteDialog itemName="Category" apiPath={`/api/admin/client-categories/${c.id}`} onSuccess={fetchAll} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* Edit Logo Modal */}
      {editingLogo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setEditingLogo(null)}>
          <div className="mx-4 w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">{editingLogo.isNew ? "Add Logo" : "Edit Logo"}</h2>
              <button onClick={() => setEditingLogo(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface)]"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Client Name *</label>
                <input value={editingLogo.name} onChange={(e) => setEditingLogo({ ...editingLogo, name: e.target.value })} placeholder="Acme Corp" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none" />
              </div>
              <ImageUpload value={editingLogo.logoUrl} onChange={(logoUrl) => setEditingLogo({ ...editingLogo, logoUrl })} label="Logo *" aspect="aspect-square" />
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Order</label>
                <input
                  type="number"
                  value={editingLogo.order}
                  onChange={(e) => setEditingLogo({ ...editingLogo, order: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSaveLogo} disabled={saving} className="flex-1 rounded-xl bg-[#ff5400] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#e04800] disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Save"}
                </button>
                <button onClick={() => setEditingLogo(null)} className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)]">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setEditingCategory(null)}>
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">{editingCategory.isNew ? "Add Category" : "Edit Category"}</h2>
              <button onClick={() => setEditingCategory(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface)]"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Label *</label>
                <input value={editingCategory.label} onChange={(e) => setEditingCategory({ ...editingCategory, label: e.target.value })} placeholder="Healthcare Clinics" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Order</label>
                <input
                  type="number"
                  value={editingCategory.order}
                  onChange={(e) => setEditingCategory({ ...editingCategory, order: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSaveCategory} disabled={saving} className="flex-1 rounded-xl bg-[#ff5400] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#e04800] disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Save"}
                </button>
                <button onClick={() => setEditingCategory(null)} className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)]">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
