const ACCESS_TOKEN_KEY = "portfolio_access_token";
const REMEMBER_ME_KEY = "portfolio_remember_me";

function getBrowserStorage(rememberMe: boolean): Storage {
  return rememberMe ? localStorage : sessionStorage;
}

export function getRememberMePreference(): boolean {
  if (typeof window === "undefined") return true;
  if (localStorage.getItem(REMEMBER_ME_KEY) === "1") return true;
  if (sessionStorage.getItem(REMEMBER_ME_KEY) === "0") return false;
  return localStorage.getItem(ACCESS_TOKEN_KEY) !== null;
}

export function setRememberMePreference(rememberMe: boolean) {
  if (typeof window === "undefined") return;
  if (rememberMe) {
    localStorage.setItem(REMEMBER_ME_KEY, "1");
    sessionStorage.removeItem(REMEMBER_ME_KEY);
  } else {
    sessionStorage.setItem(REMEMBER_ME_KEY, "0");
    localStorage.removeItem(REMEMBER_ME_KEY);
  }
}

export function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem(ACCESS_TOKEN_KEY) ??
    sessionStorage.getItem(ACCESS_TOKEN_KEY)
  );
}

export function saveAccessToken(token: string, rememberMe = true) {
  if (typeof window === "undefined") return;

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  setRememberMePreference(rememberMe);
  getBrowserStorage(rememberMe).setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REMEMBER_ME_KEY);
  sessionStorage.removeItem(REMEMBER_ME_KEY);
}
