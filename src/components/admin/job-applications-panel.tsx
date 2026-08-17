"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
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
type EmailAction = { application: JobApplication; status: EmailActionStatus };

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
  const [emailAction, setEmailAction] = useState<EmailAction | null>(null);
  const [actionNote, setActionNote] = useState("");
  const [interviewApplication, setInterviewApplication] = useState<JobApplication | null>(null);
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

  function openEmailAction(application: JobApplication, status: EmailActionStatus) {
    setActionNote("");
    setEmailAction({ application, status });
  }

  async function submitEmailAction() {
    if (!emailAction) return;
    const success = await updateStatus(emailAction.application, emailAction.status, { note: actionNote });
    if (success) setEmailAction(null);
  }

  function openInterview(application: JobApplication) {
    setInterviewApplication(application);
    setInterviewAt(defaultInterviewDate());
    setInterviewLocation(application.interviewLocation || "");
    setInterviewNotes(application.interviewNotes || "");
  }

  async function submitInterview() {
    if (!interviewApplication || !interviewAt || !interviewTimezone.trim() || !interviewLocation.trim()) {
      toast.error("Date, timezone, and location or meeting link are required");
      return;
    }

    const date = new Date(interviewAt);
    if (Number.isNaN(date.getTime())) {
      toast.error("Enter a valid interview date and time");
      return;
    }

    const success = await updateStatus(interviewApplication, "interview", {
      interviewAt: date.toISOString(),
      interviewTimezone,
      interviewLocation,
      interviewNotes,
    });
    if (success) setInterviewApplication(null);
  }

  return (
    <section aria-labelledby="applications-heading" className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="applications-heading" className="font-semibold text-[var(--foreground)]">
            Candidate inbox
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {applications.length} total application{applications.length === 1 ? "" : "s"}
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
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <article key={application.id} className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-[var(--foreground)]">{application.name}</h3>
                    <span className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold", statusStyles[application.status])}>
                      {applicationStatusLabels[application.status]}
                    </span>
                    <span className="text-xs text-[var(--muted)]">#{application.id}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-[#ff5400]">{application.role}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Applied {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(application.createdAt))}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                    <a href={`mailto:${application.email}`} className="inline-flex min-h-8 items-center gap-1.5 text-[var(--foreground)] hover:text-[#ff5400]">
                      <Mail size={15} /> {application.email}
                    </a>
                    <a href={`tel:${application.phone}`} className="inline-flex min-h-8 items-center gap-1.5 text-[var(--foreground)] hover:text-[#ff5400]">
                      <Phone size={15} /> {application.phone}
                    </a>
                    <a href={application.githubUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-8 items-center gap-1.5 text-[var(--foreground)] hover:text-[#ff5400]">
                      GitHub <ExternalLink size={14} />
                    </a>
                    {application.websiteUrl && (
                      <a href={application.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-8 items-center gap-1.5 text-[var(--foreground)] hover:text-[#ff5400]">
                        Portfolio <ExternalLink size={14} />
                      </a>
                    )}
                    <a href={`/api/admin/applications/${application.id}/cv`} className="inline-flex min-h-8 items-center gap-1.5 font-medium text-[#ff5400] hover:underline">
                      <Download size={15} /> {application.cvFileName}
                    </a>
                  </div>

                  <div className="mt-4 rounded-xl bg-[var(--surface)] p-3">
                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                      <MessageSquareText size={14} /> Applicant message
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--foreground)]">
                      {application.message || "No message provided."}
                    </p>
                  </div>

                  {application.status === "interview" && application.interviewAt && (
                    <div className="mt-3 rounded-xl border border-cyan-200 bg-cyan-50 p-3 text-sm text-cyan-900">
                      <p className="font-semibold">Interview details</p>
                      <p className="mt-1">
                        {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(application.interviewAt))}
                        {application.interviewTimezone ? ` (${application.interviewTimezone})` : ""}
                      </p>
                      <p className="mt-1 break-words">{application.interviewLocation}</p>
                    </div>
                  )}
                </div>

                <div className="flex w-full flex-wrap gap-2 lg:w-72 lg:justify-end">
                  <ActionButton
                    label="Reviewing"
                    icon={Star}
                    active={application.status === "reviewing"}
                    loading={pendingKey === `${application.id}-reviewing`}
                    onClick={() => updateStatus(application, "reviewing")}
                  />
                  <ActionButton
                    label="Shortlist"
                    icon={CheckCircle2}
                    active={application.status === "shortlisted"}
                    loading={pendingKey === `${application.id}-shortlisted`}
                    onClick={() => openEmailAction(application, "shortlisted")}
                  />
                  <ActionButton
                    label={application.status === "interview" ? "Reschedule" : "Interview"}
                    icon={CalendarClock}
                    active={false}
                    loading={pendingKey === `${application.id}-interview`}
                    onClick={() => openInterview(application)}
                  />
                  <ActionButton
                    label="Select"
                    icon={UserRoundCheck}
                    active={application.status === "selected"}
                    loading={pendingKey === `${application.id}-selected`}
                    onClick={() => openEmailAction(application, "selected")}
                  />
                  <ActionButton
                    label="Reject"
                    icon={XCircle}
                    active={application.status === "rejected"}
                    loading={pendingKey === `${application.id}-rejected`}
                    destructive
                    onClick={() => openEmailAction(application, "rejected")}
                  />
                  <DeleteDialog
                    itemName={`${application.name}'s application`}
                    apiPath={`/api/admin/applications/${application.id}`}
                    onSuccess={() => setApplications((current) => current.filter((item) => item.id !== application.id))}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog open={Boolean(emailAction)} onOpenChange={(open) => !open && setEmailAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{emailAction ? actionCopy[emailAction.status].title : "Update application"}</DialogTitle>
            <DialogDescription>
              {emailAction && `${emailAction.application.name} (${emailAction.application.email}). ${actionCopy[emailAction.status].description}`}
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
            <button onClick={() => setEmailAction(null)} disabled={Boolean(pendingKey)} className="min-h-11 rounded-xl border border-[var(--border)] px-4 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)] disabled:opacity-50">
              Cancel
            </button>
            <button
              onClick={submitEmailAction}
              disabled={!emailAction || Boolean(pendingKey)}
              className={cn(
                "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium text-white disabled:opacity-50",
                emailAction?.status === "rejected" ? "bg-red-600 hover:bg-red-700" : "bg-[#ff5400] hover:bg-[#e04800]",
              )}
            >
              {pendingKey ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {pendingKey ? "Sending..." : emailAction ? actionCopy[emailAction.status].button : "Send email"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(interviewApplication)} onOpenChange={(open) => !open && setInterviewApplication(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule interview</DialogTitle>
            <DialogDescription>
              {interviewApplication && `${interviewApplication.name} will immediately receive these interview details by email.`}
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
            <button onClick={() => setInterviewApplication(null)} disabled={Boolean(pendingKey)} className="min-h-11 rounded-xl border border-[var(--border)] px-4 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)] disabled:opacity-50">Cancel</button>
            <button onClick={submitInterview} disabled={Boolean(pendingKey)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#ff5400] px-4 text-sm font-medium text-white hover:bg-[#e04800] disabled:opacity-50">
              {pendingKey ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {pendingKey ? "Sending..." : "Schedule & send email"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
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
