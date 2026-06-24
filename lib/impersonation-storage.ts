import type { MeData } from "@/lib/api/types";
import { saveAccessToken } from "@/lib/auth-storage";

const ADMIN_TOKEN_KEY = "portfolioai_admin_token_backup";
const ADMIN_USER_KEY = "portfolioai_admin_user_backup";

export function backupAdminSession(accessToken: string, user: MeData) {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, accessToken);
  sessionStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
}

export function hasAdminSessionBackup() {
  return Boolean(sessionStorage.getItem(ADMIN_TOKEN_KEY));
}

export function restoreAdminSession(): {
  accessToken: string;
  user: MeData;
} | null {
  const accessToken = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  const rawUser = sessionStorage.getItem(ADMIN_USER_KEY);
  if (!accessToken || !rawUser) return null;
  try {
    return { accessToken, user: JSON.parse(rawUser) as MeData };
  } catch {
    return null;
  }
}

export function clearAdminSessionBackup() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_USER_KEY);
}

export function persistAccessToken(accessToken: string) {
  saveAccessToken(accessToken, true);
}
