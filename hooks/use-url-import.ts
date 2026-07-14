"use client";

import { useCallback, useState } from "react";
import type { JobImportDraft, ResumeImportDraft, UrlImportResult, UrlImportType } from "@/lib/api/types";
import { useImportFromUrlMutation } from "@/store/api/portfolioApi";

export function useUrlImport() {
  const [importFromUrl, { isLoading: isImporting }] = useImportFromUrlMutation();
  const [result, setResult] = useState<UrlImportResult | null>(null);

  const importUrl = useCallback(
    async (
      url: string,
      importType: UrlImportType = "auto",
      fallbackText?: string
    ) => {
      const response = await importFromUrl({
        url,
        import_type: importType,
        fallback_text: fallbackText?.trim() || undefined,
      }).unwrap();
      setResult(response);
      return response;
    },
    [importFromUrl]
  );

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  return {
    result,
    isImporting,
    importUrl,
    clearResult,
  };
}

export function jobDraftToFormValues(draft: JobImportDraft, sourceUrl: string) {
  return {
    company_name: draft.company_name,
    job_title: draft.job_title,
    recruiter_email: draft.recruiter_email ?? "",
    job_url: draft.job_url ?? sourceUrl,
    job_description: draft.job_description ?? "",
    notes: draft.notes ?? "",
  };
}

export type JobImportFormValues = ReturnType<typeof jobDraftToFormValues>;

export function profileDraftSummary(draft: ResumeImportDraft) {
  return {
    name: draft.full_name || "Unknown",
    title: draft.title || "No title",
    skillCount: draft.skills.length,
    experienceCount: draft.experiences.length,
    projectCount: draft.projects.length,
    educationCount: draft.education.length,
  };
}
