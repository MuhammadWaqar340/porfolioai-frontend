export const SKILL_CATEGORIES = [
  "Frontend",
  "Backend",
  "Database",
  "Tools",
] as const;

export type SkillCategoryName = (typeof SKILL_CATEGORIES)[number];
