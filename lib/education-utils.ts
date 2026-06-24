import type { Education } from "@/types";

export function formatEducationYears(
  education: Pick<Education, "startYear" | "endYear">
): string {
  return `${education.startYear} to ${education.endYear}`;
}

type LegacyEducation = Education & { year?: string };

export function normalizeEducation(item: LegacyEducation): Education {
  if (
    typeof item.startYear === "number" &&
    typeof item.endYear === "number"
  ) {
    return {
      id: item.id,
      degree: item.degree,
      institution: item.institution,
      startYear: item.startYear,
      endYear: item.endYear,
    };
  }

  if (item.year) {
    const year = Number(item.year);
    if (!Number.isNaN(year)) {
      return {
        id: item.id,
        degree: item.degree,
        institution: item.institution,
        startYear: year,
        endYear: year,
      };
    }
  }

  const currentYear = new Date().getFullYear();
  return {
    id: item.id,
    degree: item.degree,
    institution: item.institution,
    startYear: currentYear,
    endYear: currentYear,
  };
}

export function normalizeEducationList(items: LegacyEducation[]): Education[] {
  return items.map((item) => normalizeEducation(item));
}
