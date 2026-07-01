import type { Project } from "@/types";

export function hasProjectUrl(url: string): boolean {
  const trimmed = url?.trim();
  return Boolean(trimmed && trimmed !== "#");
}

export function formatDescriptionPreview(description: string) {
  return description
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function getProjectCompleteness(project: Project): number {
  let score = 0;
  if (project.imageUrl?.trim()) score += 25;
  if (formatDescriptionPreview(project.description)) score += 35;
  if (project.technologies.length > 0) score += 20;
  if (hasProjectUrl(project.githubUrl)) score += 10;
  if (hasProjectUrl(project.liveUrl)) score += 10;
  return score;
}

export function getProjectMissingFields(project: Project): string[] {
  const missing: string[] = [];
  if (!formatDescriptionPreview(project.description)) missing.push("description");
  if (!project.imageUrl?.trim()) missing.push("image");
  if (project.technologies.length === 0) missing.push("technologies");
  if (!hasProjectUrl(project.githubUrl) && !hasProjectUrl(project.liveUrl)) {
    missing.push("links");
  }
  return missing;
}

export function projectPlaceholderHue(title: string): number {
  let hash = 0;
  for (const char of title.trim()) {
    hash = (hash * 31 + char.charCodeAt(0)) % 360;
  }
  return hash;
}
