"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Loader2, Plus, DollarSign, Pencil, X, Star } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { Switch } from "@/components/ui/switch";

type PricingPlan = { id?: number; name: string; description: string; pricePkr: number | null; priceUsd: number | null; featured: boolean; features: string[]; order: number };

const empty = { name: "", description: "", pricePkr: null as number | null, priceUsd: null as number | null, featured: false, features: [] as string[], order: 0 };

export default function AdminPricingPage() {
  const [items, setItems] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<(PricingPlan & { isNew?: boolean }) | null>(null);
  const [saving, setSaving] = useState(false);
  const [featureInput, setFeatureInput] = useState("");

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/pricing");
      if (res.ok) setItems(await res.json());
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSave = async () => {
    if (!editing || !editing.name.trim()) {
      toast.error("Plan name is required");
      return;
    }
    setSaving(true);
    try {
      const url = editing.isNew ? "/api/admin/pricing" : `/api/admin/pricing/${editing.id}`;
      const method = editing.isNew ? "POST" : "PUT";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
      if (!res.ok) throw new Error("Failed");
      toast.success(editing.isNew ? "Plan added!" : "Updated!");
      setEditing(null);
      fetchItems();
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  const addFeature = () => {
    if (!editing || !featureInput.trim()) return;
    setEditing({ ...editing, features: [...editing.features, featureInput.trim()] });
    setFeatureInput("");
  };

  const removeFeature = (index: number) => {
    if (!editing) return;
    setEditing({ ...editing, features: editing.features.filter((_, i) => i !== index) });
  };

  return (
    <div>
      <AdminPageHeader title="Pricing Plans" description={`${items.length} plan${items.length !== 1 ? "s" : ""}`} backHref="/admin" action={
        <button onClick={() => setEditing({ ...empty, isNew: true, order: items.length })} className="inline-flex items-center gap-2 rounded-xl bg-[#ff5400] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#e04800] transition-colors">
          <Plus size={16} /> Add Plan
        </button>
      } />

      {loading ? <div className="flex items-center justify-center py-20 text-[var(--muted)]">Loading...</div> :
      items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--panel)] py-20 text-center">
          <DollarSign size={40} className="text-[var(--muted)] mb-3" />
          <p className="text-[var(--foreground)] font-medium">No pricing plans yet</p>
          <button onClick={() => setEditing({ ...empty, isNew: true, order: 0 })} className="mt-3 text-sm text-[#ff5400] hover:underline">Add first plan</button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((plan) => (
            <div key={plan.id} className={`rounded-2xl border bg-[var(--panel)] p-5 ${plan.featured ? "border-[#ff5400]" : "border-[var(--border)]"}`}>
              {plan.featured && <span className="inline-block mb-2 text-[10px] font-bold uppercase tracking-widest text-[#ff5400]">Featured</span>}
              <h3 className="text-lg font-bold text-[var(--foreground)]">{plan.name}</h3>
              <div className="mt-2 flex items-baseline gap-2">
                {plan.pricePkr && <span className="text-xl font-bold text-[var(--foreground)]">PKR {plan.pricePkr.toLocaleString()}</span>}
                {plan.priceUsd && <span className="text-sm text-[var(--muted)]">(${plan.priceUsd})</span>}
              </div>
              {plan.description && <p className="mt-2 text-sm text-[var(--muted)]">{plan.description}</p>}
              <ul className="mt-3 space-y-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="text-xs text-[var(--muted)]">✓ {f}</li>
                ))}
              </ul>
              <div className="mt-4 flex justify-end gap-1">
                <button onClick={() => { setEditing(plan); setFeatureInput(""); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors"><Pencil size={15} /></button>
                <DeleteDialog itemName="Pricing Plan" apiPath={`/api/admin/pricing/${plan.id}`} onSuccess={fetchItems} />
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div className="mx-4 w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">{editing.isNew ? "Add Pricing Plan" : "Edit"}</h2>
              <button onClick={() => setEditing(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface)]"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Plan Name *</label>
                <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Growth" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Description</label>
                <input value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="For growing teams" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--foreground)]">Price (PKR)</label>
                  <input type="number" value={editing.pricePkr ?? ""} onChange={(e) => setEditing({ ...editing, pricePkr: e.target.value ? Number(e.target.value) : null })} placeholder="45000" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--foreground)]">Price (USD)</label>
                  <input type="number" value={editing.priceUsd ?? ""} onChange={(e) => setEditing({ ...editing, priceUsd: e.target.value ? Number(e.target.value) : null })} placeholder="160" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[var(--foreground)]">Featured plan</label>
                <Switch checked={editing.featured} onCheckedChange={(checked) => setEditing({ ...editing, featured: checked })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Features (one per line)</label>
                <textarea value={editing.features.join("\n")} onChange={(e) => setEditing({ ...editing, features: e.target.value.split("\n").filter(Boolean) })} rows={4} placeholder={"5-page website\nLead form setup\nBasic SEO structure"} className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none resize-none" />
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
