const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidRecruiterEmail(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 && EMAIL_RE.test(trimmed);
}
