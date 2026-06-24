export function hasProjectUrl(url: string): boolean {
  const trimmed = url?.trim();
  return Boolean(trimmed && trimmed !== "#");
}
