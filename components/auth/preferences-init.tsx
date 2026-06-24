"use client";

import { useEffect } from "react";
import { useGetPreferencesQuery } from "@/store/api/portfolioApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hydratePreferences } from "@/store/slices/preferencesSlice";

export function PreferencesInit() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.accessToken);
  const sessionRestored = useAppSelector((state) => state.auth.sessionRestored);
  const { data, isSuccess } = useGetPreferencesQuery(undefined, {
    skip: !token || !sessionRestored,
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(
        hydratePreferences({
          target_role: data.target_role,
          onboarding_complete: data.onboarding_complete,
          onboarding_banner_dismissed: data.onboarding_banner_dismissed,
        })
      );
    }
  }, [isSuccess, data, dispatch]);

  return null;
}
