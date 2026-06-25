export const TEMPLATE_SLUGS = [
  "modern",
  "minimal",
  "professional",
  "creative",
  "elegant",
  "developer",
  "bold",
  "aurora",
] as const;

export type TemplateSlug = (typeof TEMPLATE_SLUGS)[number];

export const DEFAULT_TEMPLATE_SLUG: TemplateSlug = "modern";

export function isTemplateSlug(value: string | null | undefined): value is TemplateSlug {
  return TEMPLATE_SLUGS.includes(value as TemplateSlug);
}

export function resolveTemplateSlug(value: string | null | undefined): TemplateSlug {
  return isTemplateSlug(value) ? value : DEFAULT_TEMPLATE_SLUG;
}

/** Public demo URL for a template slug */
export function getTemplateDemoPath(
  slug: TemplateSlug,
  opts?: { from?: "templates" }
): string {
  const base = `/demo/${slug}`;
  return opts?.from === "templates" ? `${base}?from=templates` : base;
}
