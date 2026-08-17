export const applicationStatuses = [
  "new",
  "reviewing",
  "shortlisted",
  "interview",
  "selected",
  "rejected",
] as const;

export type ApplicationStatus = (typeof applicationStatuses)[number];

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  shortlisted: "Shortlisted",
  interview: "Interview",
  selected: "Selected successfully",
  rejected: "Rejected",
};

export function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return typeof value === "string" && applicationStatuses.includes(value as ApplicationStatus);
}
