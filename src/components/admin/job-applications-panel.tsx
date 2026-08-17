"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Download,
  ExternalLink,
  Loader2,
  Mail,
  MessageSquareText,
  Phone,
  Search,
  Send,
  Star,
  UserRoundCheck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  applicationStatusLabels,
  applicationStatuses,
  type ApplicationStatus,
} from "@/lib/job-applications";
import { cn } from "@/lib/utils";

type JobApplication = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  githubUrl: string;
  websiteUrl: string | null;
  message: string | null;
  cvFileName: string;
  status: ApplicationStatus;
  statusNote: string | null;
  interviewAt: string | null;
  interviewTimezone: string | null;
  interviewLocation: string | null;
  interviewNotes: string | null;
  statusUpdatedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type EmailActionStatus = "shortlisted" | "selected" | "rejected";

// The detail dialog swaps between these screens instead of opening a second
// dialog on top — nested overlays stack their focus traps and dim the page twice.
type DetailView = "detail" | "interview" | EmailActionStatus;

const statusStyles: Record<ApplicationStatus, string> = {
  new: "border-blue-200 bg-blue-50 text-blue-700",
  reviewing: "border-amber-200 bg-amber-50 text-amber-700",
  shortlisted: "border-violet-200 bg-violet-50 text-violet-700",
  interview: "border-cyan-200 bg-cyan-50 text-cyan-700",
  selected: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
};

const actionCopy: Record<EmailActionStatus, { title: string; description: string; button: string }> = {
  shortlisted: {
    title: "Shortlist applicant?",
    description: "The applicant will immediately receive a shortlisted email.",
    button: "Shortlist & send email",
  },
  selected: {
    title: "Select applicant?",
    description: "The applicant will immediately receive a successful selection email.",
    button: "Select & send email",
  },
  rejected: {
    title: "Reject application?",
    description: "The applicant will immediately receive a rejection email. Check the name and note before sending.",
    button: "Reject & send email",
  },
};

const dateTimeFormat = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" });

function defaultInterviewDate() {
  const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
  date.setMinutes(0, 0, 0);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

async function responseError(response: Response, fallback: string) {
  const data = await response.json().catch(() => null);
  return data?.error || fallback;
}

export function JobApplicationsPanel() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ApplicationStatus>("all");
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [view, setView] = useState<DetailView>("detail");
  const [actionNote, setActionNote] = useState("");
  const [interviewAt, setInterviewAt] = useState(defaultInterviewDate);
  const [interviewTimezone, setInterviewTimezone] = useState(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Karachi",
  );
  const [interviewLocation, setInterviewLocation] = useState("");
  const [interviewNotes, setInterviewNotes] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/admin/applications", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error(await responseError(response, "Failed to load applications"));
        return response.json();
      })
      .then((data) => {
        if (active) setApplications(data);
      })
      .catch((error) => {
        if (active) toast.error(error instanceof Error ? error.message : "Failed to load applications");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const filteredApplications = useMemo(() => {
    const term = search.trim().toLowerCase();
    return applications.filter((application) => {
      const matchesStatus = statusFilter === "all" || application.status === statusFilter;
      const matchesSearch = !term || [
        application.name,
        application.email,
        application.phone,
        application.role,
        application.message || "",
      ].some((value) => value.toLowerCase().includes(term));
      return matchesStatus && matchesSearch;
    });
  }, [applications, search, statusFilter]);

  // Read the open application out of the list rather than copying it into state,
  // so a status update re-renders the detail view without a second setState.
  const selected = useMemo(
    () => applications.find((application) => application.id === selectedId) || null,
    [applications, selectedId],
  );

  function openDetail(application: JobApplication) {
    setSelectedId(application.id);
    setView("detail");
    setActionNote("");
  }

  function closeDetail() {
    setSelectedId(null);
    setView("detail");
    setActionNote("");
  }

  async function updateStatus(
    application: JobApplication,
    status: ApplicationStatus,
    details: Record<string, string> = {},
  ) {
    const key = `${application.id}-${status}`;
    setPendingKey(key);
    try {
      const response = await fetch(`/api/admin/applications/${application.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...details }),
      });
      if (!response.ok) throw new Error(await responseError(response, "Failed to update application"));
      const updated = await response.json();
      setApplications((current) => current.map((item) => (
        item.id === application.id ? { ...item, ...updated } : item
      )));
      toast.success(
        status === "reviewing"
          ? `${application.name} moved to reviewing`
          : `${applicationStatusLabels[status]} email sent to ${application.email}`,
      );
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update application");
      return false;
    } finally {
      setPendingKey(null);
    }
  }

  function openEmailAction(status: EmailActionStatus) {
    setActionNote("");
    setView(status);
  }

  async function submitEmailAction() {
    if (!selected || view === "detail" || view === "interview") return;
    const success = await updateStatus(selected, view, { note: actionNote });
    if (success) setView("detail");
  }

  function openInterview(application: JobApplication) {
    setInterviewAt(defaultInterviewDate());
    setInterviewLocation(application.interviewLocation || "");
    setInterviewNotes(application.interviewNotes || "");
    setView("interview");
  }

  async function submitInterview() {
    if (!selected) return;
    if (!interviewAt || !interviewTimezone.trim() || !interviewLocation.trim()) {
      toast.error("Date, timezone, and location or meeting link are required");
      return;
    }

    const date = new Date(interviewAt);
    if (Number.isNaN(date.getTime())) {
      toast.error("Enter a valid interview date and time");
      return;
    }

    const success = await updateStatus(selected, "interview", {
      interviewAt: date.toISOString(),
      interviewTimezone,
      interviewLocation,
      interviewNotes,
    });
    if (success) setView("detail");
  }

  const sending = Boolean(pendingKey);

  return (
    <section aria-labelledby="applications-heading" className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="applications-heading" className="font-semibold text-[var(--foreground)]">
            Candidate inbox
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {applications.length} total application{applications.length === 1 ? "" : "s"}
            {filteredApplications.length !== applications.length && ` · ${filteredApplications.length} shown`}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative block">
            <span className="sr-only">Search applications</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, role, message..."
              className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2 pl-9 pr-3 text-sm text-[var(--foreground)] outline-none focus:border-[#ff5400] sm:w-64"
            />
          </label>
          <label>
            <span className="sr-only">Filter by status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as "all" | ApplicationStatus)}
              className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[#ff5400] sm:w-40"
            >
              <option value="all">All statuses</option>
              {applicationStatuses.map((status) => (
                <option key={status} value={status}>{applicationStatusLabels[status]}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-52 items-center justify-center gap-2 text-sm text-[var(--muted)]">
          <Loader2 size={18} className="animate-spin" /> Loading applications...
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--panel)] px-6 py-16 text-center">
          <UserRoundCheck className="mx-auto text-[var(--muted)]" size={36} />
          <p className="mt-3 font-medium text-[var(--foreground)]">No applications found</p>
          <p className="mt-1 text-sm text-[var(--muted)]">New career applications will appear here automatically.</p>
        </div>
      ) : (
        <ul className="divide-y divide-[var(--border)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]">
          {filteredApplications.map((application) => (
            <li key={application.id} className="flex items-center gap-2 pr-2 transition-colors hover:bg-[var(--surface)]">
              <button
                type="button"
                onClick={() => openDetail(application)}
                aria-label={`Open ${application.name}'s application`}
                className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3.5 text-left outline-none focus-visible:bg-[var(--surface)]"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="truncate font-semibold text-[var(--foreground)]">{application.name}</span>
                    <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-semibold", statusStyles[application.status])}>
                      {applicationStatusLabels[application.status]}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-[#ff5400]">{application.role}</p>
                  <p className="mt-0.5 truncate text-xs text-[var(--muted)]">
                    #{application.id} · {application.email} · {dateTimeFormat.format(new Date(application.createdAt))}
                  </p>
                </div>
                <ChevronRight size={18} className="shrink-0 text-[var(--muted)]" />
              </button>
              <DeleteDialog
                itemName={`${application.name}'s application`}
                apiPath={`/api/admin/applications/${application.id}`}
                onSuccess={() => {
                  if (selectedId === application.id) closeDetail();
                  setApplications((current) => current.filter((item) => item.id !== application.id));
                }}
              />
            </li>
          ))}
        </ul>
      )}

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && closeDetail()}>
        <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl">
          {selected && view === "detail" && (
            <>
              <DialogHeader>
                <DialogTitle className="flex flex-wrap items-center gap-2 pr-6">
                  {selected.name}
                  <span className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold", statusStyles[selected.status])}>
                    {applicationStatusLabels[selected.status]}
                  </span>
                </DialogTitle>
                <DialogDescription>
                  {selected.role} · applied {dateTimeFormat.format(new Date(selected.createdAt))}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  <a href={`mailto:${selected.email}`} className="inline-flex min-h-8 items-center gap-1.5 text-[var(--foreground)] hover:text-[#ff5400]">
                    <Mail size={15} /> {selected.email}
                  </a>
                  <a href={`tel:${selected.phone}`} className="inline-flex min-h-8 items-center gap-1.5 text-[var(--foreground)] hover:text-[#ff5400]">
                    <Phone size={15} /> {selected.phone}
                  </a>
                  <a href={selected.githubUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-8 items-center gap-1.5 text-[var(--foreground)] hover:text-[#ff5400]">
                    GitHub <ExternalLink size={14} />
                  </a>
                  {selected.websiteUrl && (
                    <a href={selected.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-8 items-center gap-1.5 text-[var(--foreground)] hover:text-[#ff5400]">
                      Portfolio <ExternalLink size={14} />
                    </a>
                  )}
                  <a href={`/api/admin/applications/${selected.id}/cv`} className="inline-flex min-h-8 items-center gap-1.5 font-medium text-[#ff5400] hover:underline">
                    <Download size={15} /> {selected.cvFileName}
                  </a>
                </div>

                <div className="rounded-xl bg-[var(--surface)] p-3">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    <MessageSquareText size={14} /> Applicant message
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--foreground)]">
                    {selected.message || "No message provided."}
                  </p>
                </div>

                {selected.status === "interview" && selected.interviewAt && (
                  <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-3 text-sm text-cyan-900">
                    <p className="font-semibold">Interview details</p>
                    <p className="mt-1">
                      {dateTimeFormat.format(new Date(selected.interviewAt))}
                      {selected.interviewTimezone ? ` (${selected.interviewTimezone})` : ""}
                    </p>
                    <p className="mt-1 break-words">{selected.interviewLocation}</p>
                    {selected.interviewNotes && <p className="mt-1 whitespace-pre-wrap">{selected.interviewNotes}</p>}
                  </div>
                )}

                {selected.statusNote && (
                  <div className="rounded-xl border border-[var(--border)] p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Last note sent</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--foreground)]">{selected.statusNote}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Hiring actions
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Shortlist, interview, select, and reject each send an email to the applicant.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <ActionButton
                      label="Reviewing"
                      icon={Star}
                      active={selected.status === "reviewing"}
                      loading={pendingKey === `${selected.id}-reviewing`}
                      onClick={() => updateStatus(selected, "reviewing")}
                    />
                    <ActionButton
                      label="Shortlist"
                      icon={CheckCircle2}
                      active={selected.status === "shortlisted"}
                      loading={false}
                      onClick={() => openEmailAction("shortlisted")}
                    />
                    <ActionButton
                      label={selected.status === "interview" ? "Reschedule" : "Interview"}
                      icon={CalendarClock}
                      active={false}
                      loading={false}
                      onClick={() => openInterview(selected)}
                    />
                    <ActionButton
                      label="Select"
                      icon={UserRoundCheck}
                      active={selected.status === "selected"}
                      loading={false}
                      onClick={() => openEmailAction("selected")}
                    />
                    <ActionButton
                      label="Reject"
                      icon={XCircle}
                      active={selected.status === "rejected"}
                      loading={false}
                      destructive
                      onClick={() => openEmailAction("rejected")}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {selected && (view === "shortlisted" || view === "selected" || view === "rejected") && (
            <>
              <DialogHeader>
                <DialogTitle className="pr-6">{actionCopy[view].title}</DialogTitle>
                <DialogDescription>
                  {`${selected.name} (${selected.email}). ${actionCopy[view].description}`}
                </DialogDescription>
              </DialogHeader>
              <label className="space-y-2">
                <span className="text-sm font-medium text-[var(--foreground)]">Optional note included in email</span>
                <textarea
                  value={actionNote}
                  onChange={(event) => setActionNote(event.target.value)}
                  rows={4}
                  maxLength={3000}
                  placeholder="Add a personal note..."
                  className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[#ff5400]"
                />
              </label>
              <DialogFooter>
                <BackButton disabled={sending} onClick={() => setView("detail")} />
                <button
                  onClick={submitEmailAction}
                  disabled={sending}
                  className={cn(
                    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium text-white disabled:opacity-50",
                    view === "rejected" ? "bg-red-600 hover:bg-red-700" : "bg-[#ff5400] hover:bg-[#e04800]",
                  )}
                >
                  {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {sending ? "Sending..." : actionCopy[view].button}
                </button>
              </DialogFooter>
            </>
          )}

          {selected && view === "interview" && (
            <>
              <DialogHeader>
                <DialogTitle className="pr-6">Schedule interview</DialogTitle>
                <DialogDescription>
                  {`${selected.name} will immediately receive these interview details by email.`}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-[var(--foreground)]">Date and time *</span>
                  <input type="datetime-local" value={interviewAt} onChange={(event) => setInterviewAt(event.target.value)} className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[#ff5400]" />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-[var(--foreground)]">Timezone *</span>
                  <input value={interviewTimezone} onChange={(event) => setInterviewTimezone(event.target.value)} placeholder="Asia/Karachi" className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[#ff5400]" />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-[var(--foreground)]">Location or meeting link *</span>
                  <input value={interviewLocation} onChange={(event) => setInterviewLocation(event.target.value)} placeholder="Google Meet link or office address" maxLength={1000} className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[#ff5400]" />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-[var(--foreground)]">Optional preparation note</span>
                  <textarea value={interviewNotes} onChange={(event) => setInterviewNotes(event.target.value)} rows={3} maxLength={3000} placeholder="What should the candidate prepare?" className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[#ff5400]" />
                </label>
              </div>
              <DialogFooter>
                <BackButton disabled={sending} onClick={() => setView("detail")} />
                <button onClick={submitInterview} disabled={sending} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#ff5400] px-4 text-sm font-medium text-white hover:bg-[#e04800] disabled:opacity-50">
                  {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {sending ? "Sending..." : "Schedule & send email"}
                </button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function BackButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] px-4 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)] disabled:opacity-50"
    >
      <ArrowLeft size={15} /> Back
    </button>
  );
}

function ActionButton({
  label,
  icon: Icon,
  active,
  loading,
  destructive = false,
  onClick,
}: {
  label: string;
  icon: typeof Star;
  active: boolean;
  loading: boolean;
  destructive?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={active || loading}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition-colors disabled:cursor-default disabled:opacity-55",
        destructive
          ? "border-red-200 text-red-600 hover:bg-red-50"
          : "border-[var(--border)] text-[var(--foreground)] hover:border-[#ff5400] hover:text-[#ff5400]",
        active && "bg-[var(--surface)]",
      )}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Icon size={14} />}
      {active ? `${label} ✓` : label}
    </button>
  );
}
