"use client";

import { useState } from "react";
import { UrlImportPanel } from "@/components/url-import/url-import-panel";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { JobImportFormValues } from "@/hooks/use-url-import";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { notifySuccess } from "@/lib/toast";
import { useCreateJobApplicationMutation } from "@/store/api/portfolioApi";

interface UrlImportSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UrlImportSheet({ open, onOpenChange }: UrlImportSheetProps) {
  const [createApplication, { isLoading }] = useCreateJobApplicationMutation();
  const [error, setError] = useState<string | null>(null);

  async function handleSave(values: JobImportFormValues, sourceUrl: string) {
    setError(null);
    try {
      await createApplication({
        company_name: values.company_name.trim(),
        job_title: values.job_title.trim(),
        recruiter_email: values.recruiter_email.trim() || undefined,
        job_url: values.job_url.trim() || sourceUrl,
        job_description: values.job_description.trim() || undefined,
        notes: values.notes.trim() || undefined,
        status: "saved",
      }).unwrap();
      notifySuccess("Application imported from URL.");
      onOpenChange(false);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Import from URL</SheetTitle>
          <SheetDescription>
            Paste a job posting link. AI extracts company, title, and description for you to
            review before saving.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <UrlImportPanel mode="job" showJobActions isSavingJob={isLoading} onSaveJob={handleSave} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
