export function getPublicPortfolioUrl(username: string) {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/${username}`;
  }
  return `/${username}`;
}

export function buildLinkedInShareUrl(portfolioUrl: string, displayName?: string) {
  const text = displayName
    ? `Check out my portfolio — ${displayName}`
    : "Check out my portfolio";
  const params = new URLSearchParams({
    url: portfolioUrl,
    text,
  });
  return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
}

export function buildQrCodeImageUrl(data: string, size = 200) {
  const params = new URLSearchParams({
    size: `${size}x${size}`,
    data,
    margin: "8",
  });
  return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
}
