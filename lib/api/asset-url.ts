const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001/api/v1";

function getApiOrigin(): string {
  return new URL(API_BASE_URL).origin;
}

/** Turn backend-relative upload paths into absolute URLs for the browser. */
export function resolveAssetUrl(url: string): string {
  if (!url) return url;
  if (/^(https?:|data:|blob:)/.test(url)) return url;

  const path = url.startsWith("/") ? url : `/${url}`;
  return `${getApiOrigin()}${path}`;
}

/** API-hosted uploads must bypass next/image optimization (private IP in dev). */
export function isApiHostedAsset(url: string): boolean {
  if (!url) return false;
  if (url.startsWith("/uploads/")) return true;

  try {
    return new URL(url).origin === getApiOrigin();
  } catch {
    return false;
  }
}
