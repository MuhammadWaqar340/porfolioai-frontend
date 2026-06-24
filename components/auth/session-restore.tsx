"use client";

import { useEffect } from "react";
import { useRefreshTokenMutation } from "@/store/api/portfolioApi";
import { getStoredAccessToken } from "@/lib/auth-storage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hydrateToken, restoreSessionComplete } from "@/store/slices/authSlice";

let refreshInFlight = false;

export function SessionRestore() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const sessionRestored = useAppSelector((state) => state.auth.sessionRestored);
  const [refreshToken] = useRefreshTokenMutation();

  useEffect(() => {
    if (sessionRestored) return;

    const storedToken = getStoredAccessToken();
    if (storedToken) {
      dispatch(hydrateToken(storedToken));
      return;
    }

    if (accessToken) {
      dispatch(restoreSessionComplete());
      return;
    }

    if (refreshInFlight) return;
    refreshInFlight = true;

    void refreshToken()
      .unwrap()
      .then((data) => {
        dispatch(hydrateToken(data.access_token));
      })
      .catch(() => {
        dispatch(restoreSessionComplete());
      })
      .finally(() => {
        refreshInFlight = false;
      });
  }, [accessToken, dispatch, refreshToken, sessionRestored]);

  return null;
}
