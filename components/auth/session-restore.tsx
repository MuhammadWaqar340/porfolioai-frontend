"use client";

import { useEffect } from "react";
import { useRefreshTokenMutation } from "@/store/api/portfolioApi";
import { getStoredAccessToken } from "@/lib/auth-storage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hydrateToken, restoreSessionComplete } from "@/store/slices/authSlice";

let hasBootstrappedSession = false;

export function SessionRestore() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const sessionRestored = useAppSelector((state) => state.auth.sessionRestored);
  const [refreshToken] = useRefreshTokenMutation();

  useEffect(() => {
    if (sessionRestored || hasBootstrappedSession) return;

    const storedToken = getStoredAccessToken();
    if (storedToken) {
      hasBootstrappedSession = true;
      dispatch(hydrateToken(storedToken));
      return;
    }

    if (accessToken) {
      hasBootstrappedSession = true;
      dispatch(restoreSessionComplete());
      return;
    }

    hasBootstrappedSession = true;

    void refreshToken()
      .unwrap()
      .then((data) => {
        dispatch(hydrateToken(data.access_token));
      })
      .catch(() => {
        dispatch(restoreSessionComplete());
      });
  }, [accessToken, dispatch, refreshToken, sessionRestored]);

  return null;
}
