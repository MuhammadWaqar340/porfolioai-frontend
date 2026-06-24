import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export type FieldErrors<T extends string = string> = Partial<Record<T, string>>;

interface ApiValidationDetail {
  field?: string;
  message?: string;
}

interface ApiErrorBody {
  success?: boolean;
  error?: {
    code?: string;
    message?: string;
    details?: ApiValidationDetail[];
  };
}

const SNAKE_TO_CAMEL_MAP: Record<string, string> = {
  first_name: "firstName",
  last_name: "lastName",
  full_name: "fullName",
  image_url: "imageUrl",
  image_urls: "imageUrls",
  github_url: "githubUrl",
  live_url: "liveUrl",
  credential_url: "credentialUrl",
  media_url: "mediaUrl",
  issue_month: "issueMonth",
  issue_year: "issueYear",
  start_month: "startMonth",
  start_year: "startYear",
  end_month: "endMonth",
  end_year: "endYear",
  is_present: "isPresent",
};

export function normalizeApiFieldName(apiField: string): string {
  const field = apiField.replace(/^body\./, "").replace(/^\d+\./, "");
  return (
    SNAKE_TO_CAMEL_MAP[field] ??
    field.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase())
  );
}

export function normalizeValidationMessage(message: string): string {
  return message
    .replace(/^Value error,\s*/i, "")
    .replace(
      /^String should have at least (\d+) characters?/i,
      "Must be at least $1 characters."
    )
    .trim();
}

function extractApiErrorBody(error: unknown): ApiErrorBody | null {
  if (!error || typeof error !== "object" || !("data" in error)) {
    return null;
  }

  const data = (error as FetchBaseQueryError).data;
  if (!data || typeof data !== "object") {
    return null;
  }

  return data as ApiErrorBody;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  const body = extractApiErrorBody(error);
  return body?.error?.message ?? fallback;
}

export function parseApiFormErrors<T extends string = string>(
  error: unknown,
  fieldMap?: Record<string, T>
): { fieldErrors: FieldErrors<T>; formError: string | null } {
  const body = extractApiErrorBody(error);
  const details = body?.error?.details;

  if (!details?.length) {
    return { fieldErrors: {}, formError: body?.error?.message ?? null };
  }

  const fieldErrors: FieldErrors<T> = {};

  for (const detail of details) {
    if (!detail.field || !detail.message) continue;

    const normalized = normalizeApiFieldName(detail.field);
    const formField = (fieldMap?.[detail.field] ??
      fieldMap?.[normalized] ??
      normalized) as T;
    const message = normalizeValidationMessage(detail.message);

    if (!fieldErrors[formField]) {
      fieldErrors[formField] = message;
    }
  }

  const formError =
    Object.keys(fieldErrors).length > 0
      ? (body?.error?.message ?? "Please fix the errors below.")
      : (body?.error?.message ?? null);

  return { fieldErrors, formError };
}

export const SIGNUP_API_FIELD_MAP = {
  first_name: "firstName",
  last_name: "lastName",
  email: "email",
  password: "password",
} as const;
