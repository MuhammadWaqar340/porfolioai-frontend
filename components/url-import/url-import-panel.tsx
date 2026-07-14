"use client";

import { Briefcase, Link2, Loader2, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormAlert } from "@/components/ui/form-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  jobDraftToFormValues,
  profileDraftSummary,
  useUrlImport,
  type JobImportFormValues,
} from "@/hooks/use-url-import";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import type { JobImportDraft, ResumeImportDraft, UrlImportType } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { useGetAIStatusQuery } from "@/store/api/portfolioApi";

type UrlImportMode = "both" | "job" | "profile";

interface UrlImportPanelProps {
  mode?: UrlImportMode;
  className?: string;
  onJobReady?: (values: JobImportFormValues, sourceUrl: string) => void;
  onProfileReady?: (draft: ResumeImportDraft, provider: string) => void;
  showJobActions?: boolean;
  onSaveJob?: (values: JobImportFormValues, sourceUrl: string) => Promise<void>;
  isSavingJob?: boolean;
}

const EMPTY_JOB_FORM: JobImportFormValues = {
  company_name: "",
  job_title: "",
  recruiter_email: "",
  job_url: "",
  job_description: "",
  notes: "",
};

export function UrlImportPanel({
  mode = "both",
  className,
  onJobReady,
  onProfileReady,
  showJobActions = false,
  onSaveJob,
  isSavingJob = false,
}: UrlImportPanelProps) {
  const { data: aiStatus } = useGetAIStatusQuery();
  const { result, isImporting, importUrl, clearResult } = useUrlImport();

  const defaultTab: UrlImportType = mode === "profile" ? "profile" : "job";
  const [activeTab, setActiveTab] = useState<UrlImportType>(defaultTab);
  const [url, setUrl] = useState("");
  const [fallbackText, setFallbackText] = useState("");
  const [showFallback, setShowFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobForm, setJobForm] = useState<JobImportFormValues>(EMPTY_JOB_FORM);

  const aiReady = aiStatus?.available ?? false;
  const canImport = aiReady && url.trim().length >= 8;
  const handledResultKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!result) {
      handledResultKeyRef.current = null;
      return;
    }

    const resultKey = `${result.import_type}:${result.source_url}:${result.provider}`;
    if (handledResultKeyRef.current === resultKey) return;
    handledResultKeyRef.current = resultKey;

    if (result.import_type === "job" && result.job_draft) {
      const values = jobDraftToFormValues(result.job_draft, result.source_url);
      setJobForm(values);
      onJobReady?.(values, result.source_url);
    }

    if (result.import_type === "profile" && result.profile_draft) {
      onProfileReady?.(result.profile_draft, result.provider);
    }
  }, [result, onJobReady, onProfileReady]);

  async function handleImport() {
    setError(null);
    clearResult();
    setJobForm(EMPTY_JOB_FORM);

    const importType: UrlImportType =
      mode === "both" ? (activeTab === "profile" ? "profile" : "job") : mode;

    try {
      await importUrl(url, importType, showFallback ? fallbackText : undefined);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  function reset() {
    setUrl("");
    setFallbackText("");
    setShowFallback(false);
    setError(null);
    setJobForm(EMPTY_JOB_FORM);
    clearResult();
  }

  const profilePreview =
    result?.import_type === "profile" && result.profile_draft
      ? profileDraftSummary(result.profile_draft)
      : null;

  return (
    <div className={cn("space-y-4", className)}>
      {!aiReady ? (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
          AI is not configured. Set up Gemini in your backend to use URL import.
        </div>
      ) : null}

      {mode === "both" ? (
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as UrlImportType)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="job" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Job posting
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <UserRound className="h-4 w-4" />
              LinkedIn profile
            </TabsTrigger>
          </TabsList>
          <TabsContent value="job" className="mt-4 space-y-4">
            <ImportFields
              url={url}
              onUrlChange={setUrl}
              showFallback={showFallback}
              onToggleFallback={() => setShowFallback((value) => !value)}
              fallbackText={fallbackText}
              onFallbackChange={setFallbackText}
              placeholder="https://company.com/careers/senior-engineer"
              hint="Works best with public job boards and company career pages."
            />
          </TabsContent>
          <TabsContent value="profile" className="mt-4 space-y-4">
            <ImportFields
              url={url}
              onUrlChange={setUrl}
              showFallback={showFallback}
              onToggleFallback={() => setShowFallback((value) => !value)}
              fallbackText={fallbackText}
              onFallbackChange={setFallbackText}
              placeholder="https://linkedin.com/in/your-name"
              hint="LinkedIn often blocks automated imports — paste profile text if fetch fails."
            />
          </TabsContent>
        </Tabs>
      ) : (
        <ImportFields
          url={url}
          onUrlChange={setUrl}
          showFallback={showFallback}
          onToggleFallback={() => setShowFallback((value) => !value)}
          fallbackText={fallbackText}
          onFallbackChange={setFallbackText}
          placeholder={
            mode === "profile"
              ? "https://linkedin.com/in/your-name"
              : "https://company.com/careers/senior-engineer"
          }
          hint={
            mode === "profile"
              ? "LinkedIn often blocks automated imports — paste profile text if fetch fails."
              : "Works best with public job boards and company career pages."
          }
        />
      )}

      {error ? <FormAlert message={error} /> : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={handleImport} disabled={!canImport || isImporting}>
          {isImporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing…
            </>
          ) : (
            <>
              <Link2 className="mr-2 h-4 w-4" />
              Import from URL
            </>
          )}
        </Button>
        {result ? (
          <Button type="button" variant="outline" onClick={reset}>
            Clear
          </Button>
        ) : null}
      </div>

      {result?.warnings.length ? (
        <div className="space-y-2">
          {result.warnings.map((warning) => (
            <div
              key={warning}
              className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100"
            >
              {warning}
            </div>
          ))}
        </div>
      ) : null}

      {result ? (
        <Card className="border-border/80">
          <CardContent className="space-y-4 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">
                {result.import_type === "job" ? "Job posting" : "Profile"}
              </Badge>
              {result.page_title ? (
                <span className="text-sm text-muted-foreground">{result.page_title}</span>
              ) : null}
              <span className="text-xs text-muted-foreground">via {result.provider}</span>
            </div>

            {result.import_type === "job" ? (
              <JobPreviewForm
                values={jobForm}
                onChange={setJobForm}
                showActions={showJobActions}
                isSaving={isSavingJob}
                onSave={
                  onSaveJob
                    ? () => onSaveJob(jobForm, result.source_url)
                    : undefined
                }
              />
            ) : profilePreview ? (
              <div className="space-y-2 text-sm">
                <p className="font-medium">{profilePreview.name}</p>
                <p className="text-muted-foreground">{profilePreview.title}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{profilePreview.skillCount} skills</Badge>
                  <Badge variant="secondary">
                    {profilePreview.experienceCount} experiences
                  </Badge>
                  <Badge variant="secondary">{profilePreview.projectCount} projects</Badge>
                  <Badge variant="secondary">
                    {profilePreview.educationCount} education
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Review the extracted sections below, then apply to your portfolio.
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
                Could not extract usable data from that page.
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function ImportFields({
  url,
  onUrlChange,
  showFallback,
  onToggleFallback,
  fallbackText,
  onFallbackChange,
  placeholder,
  hint,
}: {
  url: string;
  onUrlChange: (value: string) => void;
  showFallback: boolean;
  onToggleFallback: () => void;
  fallbackText: string;
  onFallbackChange: (value: string) => void;
  placeholder: string;
  hint: string;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url-import-link">Page URL</Label>
        <Input
          id="url-import-link"
          value={url}
          onChange={(event) => onUrlChange(event.target.value)}
          placeholder={placeholder}
          type="url"
        />
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <div className="space-y-2">
        <Button type="button" variant="link" className="h-auto p-0 text-xs" onClick={onToggleFallback}>
          {showFallback ? "Hide pasted text" : "Paste page text instead (if URL fails)"}
        </Button>
        {showFallback ? (
          <Textarea
            value={fallbackText}
            onChange={(event) => onFallbackChange(event.target.value)}
            placeholder="Copy the visible page content and paste it here…"
            rows={6}
          />
        ) : null}
      </div>
    </div>
  );
}

function JobPreviewForm({
  values,
  onChange,
  showActions,
  isSaving,
  onSave,
}: {
  values: JobImportFormValues;
  onChange: (values: JobImportFormValues) => void;
  showActions?: boolean;
  isSaving?: boolean;
  onSave?: () => Promise<void>;
}) {
  function updateField<K extends keyof JobImportFormValues>(
    key: K,
    value: JobImportFormValues[K]
  ) {
    onChange({ ...values, [key]: value });
  }

  const canSave =
    values.company_name.trim().length > 0 && values.job_title.trim().length > 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Company</Label>
          <Input
            value={values.company_name}
            onChange={(event) => updateField("company_name", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Job title</Label>
          <Input
            value={values.job_title}
            onChange={(event) => updateField("job_title", event.target.value)}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Recruiter email</Label>
          <Input
            value={values.recruiter_email}
            onChange={(event) => updateField("recruiter_email", event.target.value)}
            placeholder="optional"
          />
        </div>
        <div className="space-y-2">
          <Label>Job URL</Label>
          <Input
            value={values.job_url}
            onChange={(event) => updateField("job_url", event.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Job description</Label>
        <Textarea
          value={values.job_description}
          onChange={(event) => updateField("job_description", event.target.value)}
          rows={8}
        />
      </div>
      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea
          value={values.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          rows={3}
          placeholder="Location, salary, employment type…"
        />
      </div>
      {showActions && onSave ? (
        <Button
          type="button"
          onClick={() => void onSave()}
          disabled={!canSave || isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save application"
          )}
        </Button>
      ) : null}
    </div>
  );
}

export type { JobImportDraft };
