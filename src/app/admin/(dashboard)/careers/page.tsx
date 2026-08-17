"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Briefcase, Pencil, X, Inbox } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { JobApplicationsPanel } from "@/components/admin/job-applications-panel";

type Job = {
  id?: number;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  tags: string[];
  order: number;
};

const emptyJob: Job = {
  title: "",
  department: "",
  location: "",
  type: "Full-time",
  salary: "",
  description: "",
  tags: [],
  order: 0,
};

export default function AdminCareersPage() {
  const [activeView, setActiveView] = useState<"applications" | "roles">("applications");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<(Job & { isNew?: boolean }) | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/careers");
      if (res.ok) setJobs(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleSave = async () => {
    if (!editing || !editing.title.trim() || !editing.department.trim() || !editing.location.trim() || !editing.description.trim()) {
      toast.error("Title, department, location, and description are required");
      return;
    }
    setSaving(true);
    try {
      const url = editing.isNew ? "/api/admin/careers" : `/api/admin/careers/${editing.id}`;
      const method = editing.isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success(editing.isNew ? "Job posted!" : "Updated!");
      setEditing(null);
      fetchJobs();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Careers"
        description={activeView === "applications" ? "Review candidates and manage hiring updates" : `${jobs.length} open role${jobs.length !== 1 ? "s" : ""}`}
        backHref="/admin"
        action={activeView === "roles" ? (
          <button onClick={() => setEditing({ ...emptyJob, isNew: true })} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#ff5400] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#e04800]">
            <Plus size={16} /> Post Role
          </button>
        ) : undefined}
      />

      <div className="mb-5 inline-flex rounded-xl border border-[var(--border)] bg-[var(--panel)] p-1" role="tablist" aria-label="Career admin views">
        <button
          type="button"
          role="tab"
          aria-selected={activeView === "applications"}
          onClick={() => setActiveView("applications")}
          className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors ${activeView === "applications" ? "bg-[#ff5400] text-white" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
        >
          <Inbox size={16} /> Applications
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeView === "roles"}
          onClick={() => setActiveView("roles")}
          className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors ${activeView === "roles" ? "bg-[#ff5400] text-white" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
        >
          <Briefcase size={16} /> Open Roles
        </button>
      </div>

      {activeView === "applications" ? <JobApplicationsPanel /> : (
        <>

      {loading ? <div className="flex items-center justify-center py-20 text-[var(--muted)]">Loading...</div> :
      jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--panel)] py-20 text-center">
          <Briefcase size={40} className="text-[var(--muted)] mb-3" />
          <p className="text-[var(--foreground)] font-medium">No open roles yet</p>
          <button onClick={() => setEditing({ ...emptyJob, isNew: true })} className="mt-3 text-sm text-[#ff5400] hover:underline">Post the first role</button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium text-[var(--foreground)]">{job.title}</h3>
                  <p className="mt-1 text-xs text-[var(--muted)]">{job.department} • {job.location} • {job.type}</p>
                  {job.salary && <p className="mt-1 text-xs font-medium text-[#ff5400]">{job.salary}</p>}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditing(job)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors" title="Edit"><Pencil size={15} /></button>
                  <DeleteDialog itemName="Job Opening" apiPath={`/api/admin/careers/${job.id}`} onSuccess={fetchJobs} />
                </div>
              </div>
              {job.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {job.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-[var(--surface)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--muted)]">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">{editing.isNew ? "Post a Role" : "Edit Role"}</h2>
              <button onClick={() => setEditing(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface)]"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Title *</label>
                <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Senior Next.js Engineer" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--foreground)]">Department *</label>
                  <input value={editing.department} onChange={(e) => setEditing({ ...editing, department: e.target.value })} placeholder="Engineering" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--foreground)]">Type *</label>
                  <input value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value })} placeholder="Full-time" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--foreground)]">Location *</label>
                  <input value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} placeholder="Remote / Lahore" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--foreground)]">Salary</label>
                  <input value={editing.salary} onChange={(e) => setEditing({ ...editing, salary: e.target.value })} placeholder="$80k - $120k" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Description *</label>
                <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} placeholder="Role description..." className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none resize-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Tags (one per line)</label>
                <textarea value={editing.tags.join("\n")} onChange={(e) => setEditing({ ...editing, tags: e.target.value.split("\n").filter(Boolean) })} rows={3} placeholder={"Next.js\nTypeScript\nAI LLMs"} className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none resize-none" />
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
        </>
      )}
    </div>
  );
}
