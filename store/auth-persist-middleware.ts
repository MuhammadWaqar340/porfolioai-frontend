import type { Middleware } from "@reduxjs/toolkit";
import { clearAccessToken, getRememberMePreference, saveAccessToken } from "@/lib/auth-storage";
import {
  hydrateToken,
  logout,
  setCredentials,
} from "@/store/slices/authSlice";

export const authPersistMiddleware: Middleware = () => (next) => (action) => {
  const result = next(action);

  if (setCredentials.match(action)) {
    saveAccessToken(
      action.payload.accessToken,
      action.payload.rememberMe ?? true
    );
  } else if (hydrateToken.match(action)) {
    saveAccessToken(action.payload, getRememberMePreference());
  } else if (logout.match(action)) {
    clearAccessToken();
  }

  return result;
};
