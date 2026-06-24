import type { Certification } from "@/types";
import { MONTH_LABELS } from "@/lib/experience-utils";

const MONTH_NAME_TO_NUMBER = Object.fromEntries(
  MONTH_LABELS.map((label, index) => [label.toLowerCase(), index + 1])
) as Record<string, number>;

export function formatCertificationDate(
  certification: Pick<Certification, "issueMonth" | "issueYear">
): string {
  return `${MONTH_LABELS[certification.issueMonth - 1]} ${certification.issueYear}`;
}

export function hasCertificationUrl(url: string): boolean {
  const trimmed = url?.trim();
  return Boolean(trimmed && trimmed !== "#");
}

function parseLegacyDate(date: string): Pick<
  Certification,
  "issueMonth" | "issueYear"
> | null {
  const match = date.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (!match) return null;

  const issueMonth = MONTH_NAME_TO_NUMBER[match[1].toLowerCase()];
  if (!issueMonth) return null;

  return {
    issueMonth,
    issueYear: Number(match[2]),
  };
}

type LegacyCertification = Certification & { date?: string };

function withDefaults(
  item: Pick<
    Certification,
    "id" | "name" | "organization" | "issueMonth" | "issueYear"
  > &
    Partial<Pick<Certification, "credentialUrl" | "mediaUrl">>
): Certification {
  return {
    id: item.id,
    name: item.name,
    organization: item.organization,
    issueMonth: item.issueMonth,
    issueYear: item.issueYear,
    credentialUrl: item.credentialUrl ?? "",
    mediaUrl: item.mediaUrl ?? "",
  };
}

export function normalizeCertification(item: LegacyCertification): Certification {
  if (
    typeof item.issueMonth === "number" &&
    typeof item.issueYear === "number"
  ) {
    return withDefaults(item);
  }

  if (item.date) {
    const parsed = parseLegacyDate(item.date);
    if (parsed) {
      return withDefaults({
        id: item.id,
        name: item.name,
        organization: item.organization,
        credentialUrl: item.credentialUrl,
        mediaUrl: item.mediaUrl,
        ...parsed,
      });
    }
  }

  const now = new Date();
  return withDefaults({
    id: item.id,
    name: item.name,
    organization: item.organization,
    credentialUrl: item.credentialUrl,
    mediaUrl: item.mediaUrl,
    issueMonth: now.getMonth() + 1,
    issueYear: now.getFullYear(),
  });
}

export function normalizeCertificationList(
  items: LegacyCertification[]
): Certification[] {
  return items.map((item) => normalizeCertification(item));
}
