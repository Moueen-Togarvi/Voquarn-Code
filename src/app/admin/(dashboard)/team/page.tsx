"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Users, Pencil, X, Star, Link2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { ImageUpload } from "@/components/admin/image-upload";

type Member = { id?: number; name: string; role: string; bio: string; imageUrl: string | null; linkedinUrl: string | null; order: number };

const emptyMember = { name: "", role: "", bio: "", imageUrl: "", linkedinUrl: "", order: 0 };

export default function AdminTeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<(Member & { isNew?: boolean }) | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/team");
      if (res.ok) setMembers(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const handleSave = async () => {
    if (!editing || !editing.name.trim() || !editing.role.trim()) {
      toast.error("Name and role are required");
      return;
    }
    setSaving(true);
    try {
      const url = editing.isNew ? "/api/admin/team" : `/api/admin/team/${editing.id}`;
      const method = editing.isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success(editing.isNew ? "Team member added!" : "Updated!");
      setEditing(null);
      fetchMembers();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminPageHeader title="Team Members" description={`${members.length} member${members.length !== 1 ? "s" : ""}`} backHref="/admin" action={
        <button onClick={() => setEditing({ ...emptyMember, isNew: true })} className="inline-flex items-center gap-2 rounded-xl bg-[#ff5400] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#e04800] transition-colors">
          <Plus size={16} /> Add Member
        </button>
      } />

      {loading ? <div className="flex items-center justify-center py-20 text-[var(--muted)]">Loading...</div> :
      members.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--panel)] py-20 text-center">
          <Users size={40} className="text-[var(--muted)] mb-3" />
          <p className="text-[var(--foreground)] font-medium">No team members yet</p>
          <button onClick={() => setEditing({ ...emptyMember, isNew: true })} className="mt-3 text-sm text-[#ff5400] hover:underline">Add first member</button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((m) => (
            <div key={m.id} className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff5400]/10 text-[#ff5400] font-bold text-lg">
                  {m.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium text-[var(--foreground)]">{m.name}</h3>
                  <p className="text-xs text-[var(--muted)]">{m.role}</p>
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-1">
                <button onClick={() => setEditing(m)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors" title="Edit"><Pencil size={15} /></button>
                <DeleteDialog itemName="Team Member" apiPath={`/api/admin/team/${m.id}`} onSuccess={fetchMembers} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div className="mx-4 w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">{editing.isNew ? "Add Team Member" : "Edit Member"}</h2>
              <button onClick={() => setEditing(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface)]"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Name *</label>
                <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="John Doe" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Role *</label>
                <input value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} placeholder="Lead Developer" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Bio</label>
                <textarea value={editing.bio} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} rows={3} placeholder="Short bio..." className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none resize-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)] flex items-center gap-1.5">
                  <Link2 size={14} className="text-[#0077b5]" /> LinkedIn URL <span className="text-xs font-normal text-[var(--muted)]">(optional)</span>
                </label>
                <input
                  type="url"
                  value={editing.linkedinUrl ?? ""}
                  onChange={(e) => setEditing({ ...editing, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
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
