import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { ApiSuccess, TokenData } from "@/lib/api/types";
import { getRememberMePreference, saveAccessToken } from "@/lib/auth-storage";
import { logout, setCredentials, hydrateToken } from "@/store/slices/authSlice";
import type { AuthState } from "@/store/slices/authSlice";

type AppState = { auth: AuthState };

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

const PUBLIC_AUTH_PATHS = new Set([
  "/auth/login",
  "/auth/register",
  "/auth/google",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/refresh",
  "/auth/verify-email",
]);

function getRequestPath(args: string | FetchArgs): string {
  const url = typeof args === "string" ? args : args.url;
  try {
    return new URL(url, API_BASE_URL).pathname.replace(/^\/api\/v1/, "");
  } catch {
    return url;
  }
}

function isPublicAuthRequest(args: string | FetchArgs): boolean {
  return PUBLIC_AUTH_PATHS.has(getRequestPath(args));
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as AppState;
    const token = state.auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401 && !isPublicAuthRequest(args)) {
    const refreshResult = await rawBaseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const payload = refreshResult.data as ApiSuccess<TokenData>;
      const state = api.getState() as AppState;
      saveAccessToken(payload.data.access_token, getRememberMePreference());
      if (state.auth.user) {
        api.dispatch(
          setCredentials({
            accessToken: payload.data.access_token,
            user: state.auth.user,
            rememberMe: getRememberMePreference(),
          })
        );
      } else {
        api.dispatch(hydrateToken(payload.data.access_token));
      }
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
      api.dispatch(baseApi.util.resetApiState());
    }
  }

  return result;
};

export const tagTypes = [
  "User",
  "SubscriptionPlan",
  "Profile",
  "Skills",
  "Projects",
  "Experience",
  "Education",
  "Certifications",
  "Templates",
  "PortfolioSettings",
  "DashboardStats",
  "Preferences",
  "PortfolioAnalytics",
  "Notifications",
  "PortfolioVariants",
  "ShareLinks",
  "JobApplications",
  "PortfolioMessages",
  "PortfolioFeedback",
  "Testimonials",
  "IntroVideo",
  "InactivityNudge",
  "Meetings",
  "Admin",
  "PlatformConfig",
] as const;

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [...tagTypes],
  endpoints: () => ({}),
});

export function unwrapApi<T>(response: ApiSuccess<T>): T {
  return response.data;
}
