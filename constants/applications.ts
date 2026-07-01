export const APPLICATION_STATUSES = [
  "saved",
  "applied",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const ACTIVE_APPLICATION_STATUSES: ApplicationStatus[] = [
  "saved",
  "applied",
  "interview",
];

export const CLOSED_APPLICATION_STATUSES: ApplicationStatus[] = [
  "offer",
  "rejected",
  "withdrawn",
];

export const FREE_ACTIVE_APPLICATION_LIMIT = 5;

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  saved: "Saved",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export const APPLICATION_BOARD_COLUMNS = [
  { id: "saved" as const, label: "Saved", description: "Roles you are preparing for" },
  { id: "applied" as const, label: "Applied", description: "Applications submitted" },
  { id: "interview" as const, label: "Interview", description: "Active interview stages" },
  { id: "closed" as const, label: "Closed", description: "Offer, rejected, or withdrawn" },
];

export function isActiveApplicationStatus(status: string): status is ApplicationStatus {
  return ACTIVE_APPLICATION_STATUSES.includes(status as ApplicationStatus);
}

export function isClosedApplicationStatus(status: string): boolean {
  return CLOSED_APPLICATION_STATUSES.includes(status as ApplicationStatus);
}

export function applicationMatchesColumn(
  status: ApplicationStatus,
  columnId: (typeof APPLICATION_BOARD_COLUMNS)[number]["id"]
): boolean {
  if (columnId === "closed") {
    return isClosedApplicationStatus(status);
  }
  return status === columnId;
}
