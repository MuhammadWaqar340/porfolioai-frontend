import type { Experience } from "@/types";

export const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const MONTH_ABBREVIATIONS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const MONTH_ABBREV_TO_NUMBER = Object.fromEntries(
  MONTH_ABBREVIATIONS.map((label, index) => [label.toLowerCase(), index + 1])
) as Record<string, number>;

export const EARLIEST_YEAR = 1970;

export function monthYearToDate(month: number, year: number): Date {
  return new Date(year, month - 1, 1);
}

export function formatMonthYearLabel(month: number, year: number): string {
  return `${MONTH_LABELS[month - 1]} ${year}`;
}

export function getYearOptions(): number[] {
  const currentYear = new Date().getFullYear();
  return Array.from(
    { length: currentYear - EARLIEST_YEAR + 1 },
    (_, index) => currentYear - index
  );
}

export function formatExperienceDuration(experience: Pick<
  Experience,
  "startMonth" | "startYear" | "endMonth" | "endYear" | "isPresent"
>): string {
  const start = `${MONTH_ABBREVIATIONS[experience.startMonth - 1]} ${experience.startYear}`;

  if (experience.isPresent) {
    return `${start} – Present`;
  }

  if (experience.endMonth && experience.endYear) {
    const end = `${MONTH_ABBREVIATIONS[experience.endMonth - 1]} ${experience.endYear}`;
    return `${start} – ${end}`;
  }

  return start;
}

export function compareMonthYear(
  monthA: number,
  yearA: number,
  monthB: number,
  yearB: number
): number {
  if (yearA !== yearB) return yearA - yearB;
  return monthA - monthB;
}

function parseLegacyDuration(duration: string): Pick<
  Experience,
  "startMonth" | "startYear" | "endMonth" | "endYear" | "isPresent"
> | null {
  const presentMatch = duration.match(
    /^([A-Za-z]{3})\s+(\d{4})\s*[–-]\s*Present$/i
  );
  if (presentMatch) {
    const startMonth = MONTH_ABBREV_TO_NUMBER[presentMatch[1].toLowerCase()];
    if (!startMonth) return null;

    return {
      startMonth,
      startYear: Number(presentMatch[2]),
      endMonth: null,
      endYear: null,
      isPresent: true,
    };
  }

  const rangeMatch = duration.match(
    /^([A-Za-z]{3})\s+(\d{4})\s*[–-]\s*([A-Za-z]{3})\s+(\d{4})$/i
  );
  if (!rangeMatch) return null;

  const startMonth = MONTH_ABBREV_TO_NUMBER[rangeMatch[1].toLowerCase()];
  const endMonth = MONTH_ABBREV_TO_NUMBER[rangeMatch[3].toLowerCase()];
  if (!startMonth || !endMonth) return null;

  return {
    startMonth,
    startYear: Number(rangeMatch[2]),
    endMonth,
    endYear: Number(rangeMatch[4]),
    isPresent: false,
  };
}

type LegacyExperience = Experience & { duration?: string };

export function normalizeExperience(item: LegacyExperience): Experience {
  if (
    typeof item.startMonth === "number" &&
    typeof item.startYear === "number" &&
    typeof item.isPresent === "boolean"
  ) {
    return {
      id: item.id,
      company: item.company,
      position: item.position,
      startMonth: item.startMonth,
      startYear: item.startYear,
      endMonth: item.isPresent ? null : item.endMonth ?? null,
      endYear: item.isPresent ? null : item.endYear ?? null,
      isPresent: item.isPresent,
      description: item.description,
    };
  }

  if (item.duration) {
    const parsed = parseLegacyDuration(item.duration);
    if (parsed) {
      return {
        id: item.id,
        company: item.company,
        position: item.position,
        description: item.description,
        ...parsed,
      };
    }
  }

  const now = new Date();
  return {
    id: item.id,
    company: item.company,
    position: item.position,
    startMonth: now.getMonth() + 1,
    startYear: now.getFullYear(),
    endMonth: null,
    endYear: null,
    isPresent: true,
    description: item.description,
  };
}
