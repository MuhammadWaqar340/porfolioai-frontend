export function getPublicProjectPath(
  username: string,
  projectId: string,
  query?: { variant?: string; share?: string }
): string {
  const path = `/${encodeURIComponent(username)}/projects/${encodeURIComponent(projectId)}`;
  const params = new URLSearchParams();
  if (query?.variant) params.set("variant", query.variant);
  if (query?.share) params.set("share", query.share);
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

export function getDemoProjectPath(projectId: string, template?: string): string {
  const path = `/demo/projects/${encodeURIComponent(projectId)}`;
  if (!template) return path;
  return `${path}?template=${encodeURIComponent(template)}`;
}

export function getPublicPortfolioProjectsHref(
  username: string,
  query?: { variant?: string; share?: string }
): string {
  const params = new URLSearchParams();
  if (query?.variant) params.set("variant", query.variant);
  if (query?.share) params.set("share", query.share);
  const qs = params.toString();
  return `/${encodeURIComponent(username)}${qs ? `?${qs}` : ""}#projects`;
}
