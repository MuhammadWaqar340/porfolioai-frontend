"use client";

import { useCallback, useState } from "react";
import {
  parseApiFormErrors,
  type FieldErrors,
} from "@/lib/api/form-errors";

export function useFormErrors<T extends string = string>() {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<T>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const clearAll = useCallback(() => {
    setFieldErrors({});
    setFormError(null);
  }, []);

  const clearField = useCallback((field: T) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const setValidationErrors = useCallback((errors: FieldErrors<T>) => {
    setFieldErrors(errors);
    setFormError(null);
  }, []);

  const applyApiError = useCallback(
    (error: unknown, fieldMap?: Record<string, T>) => {
      const { fieldErrors: next, formError: message } = parseApiFormErrors<T>(
        error,
        fieldMap
      );
      setFieldErrors(next);
      setFormError(message);
    },
    []
  );

  const applyApiErrorOrFallback = useCallback(
    (error: unknown, fallback: string, fieldMap?: Record<string, T>) => {
      const { fieldErrors: next, formError: message } = parseApiFormErrors<T>(
        error,
        fieldMap
      );

      if (Object.keys(next).length > 0 || message) {
        setFieldErrors(next);
        setFormError(message);
        return;
      }

      setFieldErrors({});
      setFormError(fallback);
    },
    []
  );

  const getError = useCallback(
    (field: T) => fieldErrors[field] ?? null,
    [fieldErrors]
  );

  return {
    fieldErrors,
    formError,
    clearAll,
    clearField,
    setValidationErrors,
    applyApiError,
    applyApiErrorOrFallback,
    getError,
    setFormError,
  };
}
