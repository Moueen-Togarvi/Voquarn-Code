"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Loader2, Plus, BarChart3, Pencil, X } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteDialog } from "@/components/admin/delete-dialog";

type StatItem = { id?: number; label: string; value: number; suffix: string; order: number };

const empty = { label: "", value: 0, suffix: "", order: 0 };

export default function AdminStatsPage() {
  const [items, setItems] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<(StatItem & { isNew?: boolean }) | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) setItems(await res.json());
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSave = async () => {
    if (!editing || !editing.label.trim()) {
      toast.error("Label is required");
      return;
    }
    setSaving(true);
    try {
      const url = editing.isNew ? "/api/admin/stats" : `/api/admin/stats/${editing.id}`;
      const method = editing.isNew ? "POST" : "PUT";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
      if (!res.ok) throw new Error("Failed");
      toast.success(editing.isNew ? "Stat added!" : "Updated!");
      setEditing(null);
      fetchItems();
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  return (
    <div>
      <AdminPageHeader title="Stats" description={`${items.length} stat${items.length !== 1 ? "s" : ""} shown on the homepage`} backHref="/admin" action={
        <button onClick={() => setEditing({ ...empty, isNew: true })} className="inline-flex items-center gap-2 rounded-xl bg-[#ff5400] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#e04800] transition-colors">
          <Plus size={16} /> Add Stat
        </button>
      } />

      {loading ? <div className="flex items-center justify-center py-20 text-[var(--muted)]">Loading...</div> :
      items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--panel)] py-20 text-center">
          <BarChart3 size={40} className="text-[var(--muted)] mb-3" />
          <p className="text-[var(--foreground)] font-medium">No stats yet</p>
          <button onClick={() => setEditing({ ...empty, isNew: true })} className="mt-3 text-sm text-[#ff5400] hover:underline">Add first stat</button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((s) => (
            <div key={s.id} className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 text-center">
              <p className="text-3xl font-black text-[#ff5400]">{s.value}{s.suffix}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{s.label}</p>
              <div className="mt-3 flex justify-center gap-1">
                <button onClick={() => setEditing(s)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors"><Pencil size={15} /></button>
                <DeleteDialog itemName="Stat" apiPath={`/api/admin/stats/${s.id}`} onSuccess={fetchItems} />
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div className="mx-4 w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">{editing.isNew ? "Add Stat" : "Edit Stat"}</h2>
              <button onClick={() => setEditing(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface)]"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Label *</label>
                <input value={editing.label} onChange={(e) => setEditing({ ...editing, label: e.target.value })} placeholder="Projects launched" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--foreground)]">Value *</label>
                  <input
                    type="number"
                    value={editing.value}
                    onChange={(e) => setEditing({ ...editing, value: Number(e.target.value) })}
                    placeholder="48"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--foreground)]">Suffix</label>
                  <input value={editing.suffix} onChange={(e) => setEditing({ ...editing, suffix: e.target.value })} placeholder="h, %, +" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Order</label>
                <input
                  type="number"
                  value={editing.order}
                  onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none"
                />
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
