import type { ResumeImportDraft } from "@/lib/api/types";
import type { Education, Experience, Profile, Project } from "@/types";

export type ResumeApplySection =
  | "profile"
  | "skills"
  | "experiences"
  | "projects"
  | "education";

export interface ResumeApplyOptions {
  sections: ResumeApplySection[];
  overwriteProfile?: boolean;
  skillsCategory?: string;
}

export interface ResumeDraftSummary {
  hasProfile: boolean;
  skillsCount: number;
  experiencesCount: number;
  projectsCount: number;
  educationCount: number;
}

export interface ResumeApplyResult {
  profileUpdated: boolean;
  skillsAdded: number;
  experiencesAdded: number;
  projectsAdded: number;
  educationAdded: number;
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function num(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function strArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).trim()).filter(Boolean);
}

export function summarizeResumeDraft(draft: ResumeImportDraft): ResumeDraftSummary {
  const validExperiences = draft.experiences.filter((item) => {
    const company = str(item.company);
    const position = str(item.position);
    return Boolean(company && position);
  });
  const validProjects = draft.projects.filter((item) => str(item.title));
  const validEducation = draft.education.filter((item) => {
    const degree = str(item.degree);
    const institution = str(item.institution);
    return Boolean(degree && institution);
  });

  return {
    hasProfile: Boolean(
      draft.full_name.trim() || draft.title.trim() || draft.about.trim()
    ),
    skillsCount: draft.skills.length,
    experiencesCount: validExperiences.length,
    projectsCount: validProjects.length,
    educationCount: validEducation.length,
  };
}

export function buildProfileUpdates(
  draft: ResumeImportDraft,
  current: Profile,
  overwrite: boolean
): Partial<Profile> {
  const updates: Partial<Profile> = {};

  const fields: Array<keyof Pick<Profile, "fullName" | "title" | "about">> = [
    "fullName",
    "title",
    "about",
  ];

  const draftValues = {
    fullName: draft.full_name.trim(),
    title: draft.title.trim(),
    about: draft.about.trim(),
  };

  for (const field of fields) {
    const value = draftValues[field];
    if (!value) continue;
    if (overwrite || !current[field].trim()) {
      updates[field] = value;
    }
  }

  return updates;
}

export function mapDraftExperience(
  item: Record<string, unknown>
): Omit<Experience, "id"> | null {
  const company = str(item.company);
  const position = str(item.position);
  if (!company || !position) return null;

  const now = new Date();
  const currentYear = now.getFullYear();
  const startYear = num(item.start_year) ?? currentYear - 1;
  const startMonth = num(item.start_month) ?? 1;
  const endYear = num(item.end_year);
  const endMonth = num(item.end_month);
  const isPresent =
    item.is_present === true || endYear === null || endMonth === null;

  if (isPresent) {
    return {
      company,
      position,
      description: str(item.description),
      startMonth: Math.min(12, Math.max(1, startMonth)),
      startYear,
      endMonth: null,
      endYear: null,
      isPresent: true,
    };
  }

  return {
    company,
    position,
    description: str(item.description),
    startMonth: Math.min(12, Math.max(1, startMonth)),
    startYear,
    endMonth: Math.min(12, Math.max(1, endMonth ?? 12)),
    endYear: endYear ?? currentYear,
    isPresent: false,
  };
}

export function mapDraftProject(
  item: Record<string, unknown>
): Omit<Project, "id"> | null {
  const title = str(item.title);
  if (!title) return null;

  return {
    title,
    description: str(item.description),
    imageUrl: "",
    imageUrls: [],
    technologies: strArray(item.technologies),
    githubUrl: "",
    liveUrl: "",
  };
}

export function mapDraftEducation(
  item: Record<string, unknown>
): Omit<Education, "id"> | null {
  const degree = str(item.degree);
  const institution = str(item.institution);
  if (!degree || !institution) return null;

  const currentYear = new Date().getFullYear();
  const startYear = num(item.start_year) ?? currentYear - 4;
  const endYear = num(item.end_year) ?? currentYear;

  return {
    degree,
    institution,
    startYear: Math.min(startYear, endYear),
    endYear: Math.max(startYear, endYear),
  };
}

export function getDefaultApplySections(
  draft: ResumeImportDraft
): ResumeApplySection[] {
  const summary = summarizeResumeDraft(draft);
  const sections: ResumeApplySection[] = [];

  if (summary.hasProfile) sections.push("profile");
  if (summary.skillsCount > 0) sections.push("skills");
  if (summary.experiencesCount > 0) sections.push("experiences");
  if (summary.projectsCount > 0) sections.push("projects");
  if (summary.educationCount > 0) sections.push("education");

  return sections;
}
