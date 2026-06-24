import type { AuthUser, MeData } from "@/lib/api/types";
import { resetPortfolioReviewSession } from "@/components/dashboard/portfolio-review-card";
import type { AppDispatch } from "@/store";
import { baseApi } from "@/store/api/baseApi";
import { logout, setCredentials } from "@/store/slices/authSlice";
import { resetPreferences } from "@/store/slices/preferencesSlice";

export function clearApiCache(dispatch: AppDispatch) {
  dispatch(baseApi.util.resetApiState());
}

export function signOut(dispatch: AppDispatch) {
  resetPortfolioReviewSession();
  dispatch(resetPreferences());
  dispatch(logout());
  dispatch(baseApi.util.resetApiState());
}

export function startUserSession(
  dispatch: AppDispatch,
  payload: {
    accessToken: string;
    user: AuthUser | MeData;
    rememberMe?: boolean;
  }
) {
  resetPortfolioReviewSession();
  dispatch(resetPreferences());
  dispatch(baseApi.util.resetApiState());
  dispatch(setCredentials(payload));
}
