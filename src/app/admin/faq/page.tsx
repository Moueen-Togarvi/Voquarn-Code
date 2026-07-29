"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Loader2, Plus, HelpCircle, Pencil, X, GripVertical } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteDialog } from "@/components/admin/delete-dialog";

type Faq = { id?: number; question: string; answer: string; order: number };

const empty = { question: "", answer: "", order: 0 };

export default function AdminFaqPage() {
  const [items, setItems] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<(Faq & { isNew?: boolean }) | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/faq");
      if (res.ok) setItems(await res.json());
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSave = async () => {
    if (!editing || !editing.question.trim() || !editing.answer.trim()) {
      toast.error("Question and answer are required");
      return;
    }
    setSaving(true);
    try {
      const url = editing.isNew ? "/api/admin/faq" : `/api/admin/faq/${editing.id}`;
      const method = editing.isNew ? "POST" : "PUT";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
      if (!res.ok) throw new Error("Failed");
      toast.success(editing.isNew ? "FAQ added!" : "Updated!");
      setEditing(null);
      fetchItems();
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  const moveItem = async (index: number, direction: "up" | "down") => {
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= items.length) return;
    const newItems = [...items];
    [newItems[index], newItems[swapWith]] = [newItems[swapWith], newItems[index]];
    setItems(newItems);

    // Save order changes
    for (let i = 0; i < newItems.length; i++) {
      fetch(`/api/admin/faq/${newItems[i].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newItems[i], order: i }),
      });
    }
  };

  return (
    <div>
      <AdminPageHeader title="FAQ" description={`${items.length} item${items.length !== 1 ? "s" : ""}`} backHref="/admin" action={
        <button onClick={() => setEditing({ ...empty, isNew: true, order: items.length })} className="inline-flex items-center gap-2 rounded-xl bg-[#ff5400] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#e04800] transition-colors">
          <Plus size={16} /> Add FAQ
        </button>
      } />

      {loading ? <div className="flex items-center justify-center py-20 text-[var(--muted)]">Loading...</div> :
      items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--panel)] py-20 text-center">
          <HelpCircle size={40} className="text-[var(--muted)] mb-3" />
          <p className="text-[var(--foreground)] font-medium">No FAQ items yet</p>
          <button onClick={() => setEditing({ ...empty, isNew: true, order: 0 })} className="mt-3 text-sm text-[#ff5400] hover:underline">Add first item</button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]">
          <table className="w-full">
            <thead className="border-b border-[var(--border)] bg-[var(--surface)]">
              <tr>
                <th className="w-10 px-3 py-3"></th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Question</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Answer</th>
                <th className="w-24 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {items.map((item, index) => (
                <tr key={item.id} className="hover:bg-[var(--surface)]">
                  <td className="px-3 py-3">
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => moveItem(index, "up")} disabled={index === 0} className="text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30 text-[10px]">▲</button>
                      <button onClick={() => moveItem(index, "down")} disabled={index === items.length - 1} className="text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30 text-[10px]">▼</button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-[var(--foreground)] line-clamp-1">{item.question}</td>
                  <td className="px-4 py-3 text-sm text-[var(--muted)] line-clamp-1">{item.answer}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setEditing(item)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors"><Pencil size={15} /></button>
                      <DeleteDialog itemName="FAQ" apiPath={`/api/admin/faq/${item.id}`} onSuccess={fetchItems} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div className="mx-4 w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">{editing.isNew ? "Add FAQ" : "Edit"}</h2>
              <button onClick={() => setEditing(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface)]"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Question *</label>
                <input value={editing.question} onChange={(e) => setEditing({ ...editing, question: e.target.value })} placeholder="What is your pricing?" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Answer *</label>
                <textarea value={editing.answer} onChange={(e) => setEditing({ ...editing, answer: e.target.value })} rows={4} placeholder="Our pricing starts from..." className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none resize-none" />
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
