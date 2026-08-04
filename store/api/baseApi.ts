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

/** Paths that never require a visitor session — a 401 here is NOT "logged out". */
const PUBLIC_DATA_PATH_PREFIXES = [
  "/portfolio/public/",
  "/portfolio/discover",
  "/portfolio/share/",
  "/meetings/public/",
  "/companies/public/",
  "/companies/discover",
  "/platform/",
  "/templates",
  "/support/",
];

function getRequestPath(args: string | FetchArgs): string {
  const url = typeof args === "string" ? args : args.url;
  try {
    return new URL(url, API_BASE_URL).pathname.replace(/^\/api\/v1/, "");
  } catch {
    return url.startsWith("/") ? url : `/${url}`;
  }
}

function isPublicAuthRequest(args: string | FetchArgs): boolean {
  return PUBLIC_AUTH_PATHS.has(getRequestPath(args));
}

function isPublicDataRequest(args: string | FetchArgs): boolean {
  const path = getRequestPath(args);
  return PUBLIC_DATA_PATH_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(prefix),
  );
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

let refreshRequest: Promise<boolean> | null = null;

async function refreshAccessToken(
  api: Parameters<BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>>[1],
  extraOptions: Parameters<BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>>[2]
): Promise<boolean> {
  if (!refreshRequest) {
    refreshRequest = (async () => {
      const refreshResult = await rawBaseQuery(
        { url: "/auth/refresh", method: "POST" },
        api,
        extraOptions
      );

      if (!refreshResult.data) {
        return false;
      }

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
      return true;
    })().finally(() => {
      refreshRequest = null;
    });
  }

  return refreshRequest;
}

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401 && !isPublicAuthRequest(args)) {
    // Public portfolio/meeting endpoints must never trigger session refresh.
    // (e.g. Google Calendar token expiry used to return 401 and caused an
    // infinite refresh → resetApiState → refetch loop on public pages.)
    if (isPublicDataRequest(args)) {
      return result;
    }

    const state = api.getState() as AppState;
    // No access token means there is no session to renew — don't POST /auth/refresh.
    if (!state.auth.accessToken) {
      return result;
    }

    const refreshed = await refreshAccessToken(api, extraOptions);

    if (refreshed) {
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
  "Companies",
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
