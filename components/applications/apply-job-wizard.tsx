"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { UrlImportPanel } from "@/components/url-import/url-import-panel";
import { ProUpgradeCard } from "@/components/subscription/pro-upgrade-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ApplicationStatus } from "@/constants/applications";
import { APPLICATION_STATUS_LABELS } from "@/constants/applications";
import { useSubscription } from "@/hooks/use-subscription";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import type {
  CoverLetterTone,
  JobDescriptionTailorResult,
} from "@/lib/api/types";
import { slugify } from "@/lib/slug";
import { isValidRecruiterEmail } from "@/lib/application-email";
import { notifySuccess } from "@/lib/toast";
import type { JobImportFormValues } from "@/hooks/use-url-import";
import { cn } from "@/lib/utils";
import {
  useCompleteApplyWizardMutation,
  useGenerateCoverLetterMutation,
  useGetPortfolioVariantsQuery,
  useGetProjectsQuery,
  useSuggestVariantFromJobMutation,
  useTailorJobDescriptionMutation,
} from "@/store/api/portfolioApi";
import { useTargetRole } from "@/store/hooks";

const STEPS = [
  "Job details",
  "Fit analysis",
  "Portfolio variant",
  "Cover letter",
  "Share link",
  "Review",
] as const;

const TONE_OPTIONS: { id: CoverLetterTone; label: string }[] = [
  { id: "professional", label: "Professional" },
  { id: "enthusiastic", label: "Enthusiastic" },
  { id: "concise", label: "Concise" },
];

type VariantMode = "create" | "existing" | "skip";

export function ApplyJobWizard() {
  const router = useRouter();
  const targetRole = useTargetRole();
  const { isPro } = useSubscription();
  const { data: projects = [] } = useGetProjectsQuery();
  const { data: variants = [] } = useGetPortfolioVariantsQuery();

  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [recruiterEmail, setRecruiterEmail] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [tailorResult, setTailorResult] = useState<JobDescriptionTailorResult | null>(
    null
  );
  const [variantMode, setVariantMode] = useState<VariantMode>("create");
  const [variantName, setVariantName] = useState("");
  const [variantSlug, setVariantSlug] = useState("");
  const [titleOverride, setTitleOverride] = useState("");
  const [aboutOverride, setAboutOverride] = useState("");
  const [featuredProjectIds, setFeaturedProjectIds] = useState<string[]>([]);
  const [existingVariantId, setExistingVariantId] = useState("");

  const [tone, setTone] = useState<CoverLetterTone>("professional");
  const [coverSubject, setCoverSubject] = useState("");
  const [coverContent, setCoverContent] = useState("");

  const [shareLabel, setShareLabel] = useState("");
  const [createShareLink, setCreateShareLink] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>("saved");

  const [tailor, { isLoading: isTailoring }] = useTailorJobDescriptionMutation();
  const [suggestVariant, { isLoading: isSuggestingVariant }] =
    useSuggestVariantFromJobMutation();
  const [generateCoverLetter, { isLoading: isGeneratingCover }] =
    useGenerateCoverLetterMutation();
  const [completeWizard, { isLoading: isSubmitting }] = useCompleteApplyWizardMutation();

  const trimmedDescription = jobDescription.trim();
  const canProceedFromJob =
    companyName.trim().length > 0 &&
    jobTitle.trim().length > 0 &&
    trimmedDescription.length >= 50;

  const handleJobImport = useCallback((values: JobImportFormValues) => {
    setCompanyName(values.company_name);
    setJobTitle(values.job_title);
    setRecruiterEmail(values.recruiter_email);
    setJobUrl(values.job_url);
    setJobDescription(values.job_description);
    notifySuccess("Job details imported — review and continue.");
  }, []);

  const handleJobReady = useCallback(
    (values: JobImportFormValues) => {
      handleJobImport(values);
    },
    [handleJobImport]
  );

  const autoTailorTriggeredRef = useRef(false);
  const autoVariantTriggeredRef = useRef(false);
  const autoCoverTriggeredRef = useRef(false);

  const runTailor = useCallback(async () => {
    if (trimmedDescription.length < 50) return;
    setError(null);
    try {
      const result = await tailor({
        job_description: trimmedDescription,
        target_role: targetRole,
      }).unwrap();
      setTailorResult(result);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }, [tailor, trimmedDescription, targetRole]);

  const runSuggestVariant = useCallback(async () => {
    if (!canProceedFromJob) return;
    setError(null);
    try {
      const result = await suggestVariant({
        company_name: companyName.trim(),
        job_title: jobTitle.trim(),
        job_description: trimmedDescription,
        target_role: targetRole,
      }).unwrap();
      setVariantName(result.variant_name);
      setVariantSlug(result.slug);
      setTitleOverride(result.title_override);
      setAboutOverride(result.about_override);
      setFeaturedProjectIds(result.featured_project_ids);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }, [
    suggestVariant,
    companyName,
    jobTitle,
    trimmedDescription,
    targetRole,
    canProceedFromJob,
  ]);

  const runGenerateCoverLetter = useCallback(async () => {
    if (!canProceedFromJob) return;
    setError(null);
    try {
      const result = await generateCoverLetter({
        company_name: companyName.trim(),
        job_title: jobTitle.trim(),
        job_description: trimmedDescription,
        tone,
        target_role: targetRole,
      }).unwrap();
      setCoverSubject(result.subject_line);
      setCoverContent(result.content);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }, [
    generateCoverLetter,
    companyName,
    jobTitle,
    trimmedDescription,
    tone,
    targetRole,
    canProceedFromJob,
  ]);

  useEffect(() => {
    if (step !== 1) {
      autoTailorTriggeredRef.current = false;
      return;
    }
    if (tailorResult || isTailoring || autoTailorTriggeredRef.current) return;
    autoTailorTriggeredRef.current = true;
    void runTailor();
  }, [step, tailorResult, isTailoring, runTailor]);

  useEffect(() => {
    if (step !== 2) {
      autoVariantTriggeredRef.current = false;
      return;
    }
    if (
      variantMode !== "create" ||
      !isPro ||
      variantName ||
      isSuggestingVariant ||
      autoVariantTriggeredRef.current
    ) {
      return;
    }
    autoVariantTriggeredRef.current = true;
    void runSuggestVariant();
  }, [
    step,
    variantMode,
    isPro,
    variantName,
    isSuggestingVariant,
    runSuggestVariant,
  ]);

  useEffect(() => {
    if (step !== 3) {
      autoCoverTriggeredRef.current = false;
      return;
    }
    if (coverContent || isGeneratingCover || autoCoverTriggeredRef.current) return;
    autoCoverTriggeredRef.current = true;
    void runGenerateCoverLetter();
  }, [step, coverContent, isGeneratingCover, runGenerateCoverLetter]);

  useEffect(() => {
    if (step === 4 && !shareLabel) {
      setShareLabel(`${companyName.trim()} – ${jobTitle.trim()}`.slice(0, 120));
    }
  }, [step, shareLabel, companyName, jobTitle]);

  function toggleProject(projectId: string) {
    setFeaturedProjectIds((current) => {
      if (current.includes(projectId)) {
        return current.filter((id) => id !== projectId);
      }
      if (current.length >= 3) return current;
      return [...current, projectId];
    });
  }

  async function handleSubmit() {
    setError(null);
    if (recruiterEmail.trim() && !isValidRecruiterEmail(recruiterEmail)) {
      setError("Enter a valid recruiter email or leave it blank.");
      return;
    }
    const finalSlug = variantSlug || slugify(variantName || `${companyName}-${jobTitle}`);

    try {
      await completeWizard({
        company_name: companyName.trim(),
        job_title: jobTitle.trim(),
        recruiter_email: recruiterEmail.trim() || undefined,
        job_url: jobUrl.trim() || undefined,
        job_description: trimmedDescription,
        status: applicationStatus,
        fit_score: tailorResult?.fit_score,
        create_variant: variantMode === "create" && isPro,
        variant:
          variantMode === "create" && isPro
            ? {
                name: variantName.trim(),
                slug: finalSlug,
                title_override: titleOverride.trim() || undefined,
                about_override: aboutOverride.trim() || undefined,
                featured_project_ids: featuredProjectIds,
              }
            : undefined,
        existing_variant_id:
          variantMode === "existing" && existingVariantId
            ? existingVariantId
            : undefined,
        cover_letter_subject: coverSubject.trim(),
        cover_letter_content: coverContent.trim(),
        create_share_link: createShareLink && isPro,
        share_link_label: shareLabel.trim() || undefined,
        share_link_expires_in_days: 30,
      }).unwrap();

      notifySuccess("Application package saved.");
      router.push("/applications");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  function goNext() {
    setError(null);
    if (step === 0 && !canProceedFromJob) {
      setError("Enter company, job title, and at least 50 characters of job description.");
      return;
    }
    if (step === 2 && variantMode === "create" && isPro) {
      if (!variantName.trim() || !finalSlugValid(variantSlug || slugify(variantName))) {
        setError("Variant name and a valid slug are required.");
        return;
      }
    }
    if (step === 2 && variantMode === "existing" && !existingVariantId) {
      setError("Select an existing portfolio variant.");
      return;
    }
    if (step === 3 && (!coverSubject.trim() || !coverContent.trim())) {
      setError("Cover letter subject and body are required.");
      return;
    }
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  }

  function goBack() {
    setError(null);
    setStep((current) => Math.max(current - 1, 0));
  }

  const busy = isTailoring || isSuggestingVariant || isGeneratingCover || isSubmitting;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Apply to this job"
        description="Paste a role, analyze fit, tailor your portfolio, generate a cover letter, and save everything to your tracker."
      >
        <Button variant="outline" render={<Link href="/applications" />} nativeButton={false}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to tracker
        </Button>
      </PageHeader>

      <nav className="flex flex-wrap gap-2">
        {STEPS.map((label, index) => (
          <div
            key={label}
            className={cn(
              "flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
              index === step && "border-primary bg-primary/10 text-primary",
              index < step && "border-border text-muted-foreground",
              index > step && "border-border/60 text-muted-foreground"
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium",
                index <= step ? "bg-primary text-primary-foreground" : "bg-muted"
              )}
            >
              {index < step ? <Check className="h-3 w-3" /> : index + 1}
            </span>
            {label}
          </div>
        ))}
      </nav>

      <Card>
        <CardContent className="space-y-6 p-6">
          {step === 0 ? (
            <div className="space-y-6">
              <div className="rounded-lg border border-dashed border-border/80 bg-muted/30 p-4">
                <p className="mb-3 text-sm font-medium">Import from job posting URL</p>
                <UrlImportPanel mode="job" onJobReady={handleJobReady} />
              </div>
              <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="wizard-company">Company</Label>
                  <Input
                    id="wizard-company"
                    value={companyName}
                    onChange={(event) => setCompanyName(event.target.value)}
                    placeholder="Acme Corp"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wizard-title">Job title</Label>
                  <Input
                    id="wizard-title"
                    value={jobTitle}
                    onChange={(event) => setJobTitle(event.target.value)}
                    placeholder="Senior Frontend Engineer"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wizard-url">Job posting URL (optional)</Label>
                <Input
                  id="wizard-url"
                  type="url"
                  value={jobUrl}
                  onChange={(event) => setJobUrl(event.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wizard-recruiter">
                  Recruiter / hiring manager email (optional)
                </Label>
                <Input
                  id="wizard-recruiter"
                  type="email"
                  value={recruiterEmail}
                  onChange={(event) => setRecruiterEmail(event.target.value)}
                  placeholder="recruiter@company.com"
                />
                <p className="text-xs text-muted-foreground">
                  Shown on the application card so you can copy it when you email the recruiter.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wizard-jd">Job description</Label>
                <Textarea
                  id="wizard-jd"
                  value={jobDescription}
                  onChange={(event) => setJobDescription(event.target.value)}
                  rows={8}
                  placeholder="Paste requirements, responsibilities, and tech stack…"
                  className="max-h-56 min-h-32 resize-none overflow-y-auto [field-sizing:fixed]"
                />
                <p className="text-xs text-muted-foreground">
                  {trimmedDescription.length >= 50
                    ? `${trimmedDescription.length.toLocaleString()} characters`
                    : "Minimum 50 characters"}
                </p>
              </div>
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-4">
              {isTailoring ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing fit against your portfolio…
                </div>
              ) : tailorResult ? (
                <>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Fit: {tailorResult.fit_score}/100</Badge>
                    <Badge variant="outline" className="text-[10px]">
                      via {tailorResult.provider}
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed">{tailorResult.summary}</p>
                  {tailorResult.matching_strengths.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {tailorResult.matching_strengths.map((item) => (
                        <Badge key={item} variant="outline" className="text-[11px]">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </>
              ) : (
                <Button type="button" size="sm" onClick={() => void runTailor()}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze fit
                </Button>
              )}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              {!isPro ? (
                <ProUpgradeCard
                  title="Portfolio variants are Pro"
                  description="Upgrade to create a job-specific variant in this wizard, or skip and save the application with your cover letter only."
                />
              ) : null}

              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["create", "Create new variant"],
                    ["existing", "Use existing"],
                    ["skip", "Skip variant"],
                  ] as const
                ).map(([mode, label]) => (
                  <Button
                    key={mode}
                    type="button"
                    size="sm"
                    variant={variantMode === mode ? "default" : "outline"}
                    disabled={mode !== "skip" && !isPro}
                    onClick={() => setVariantMode(mode)}
                  >
                    {label}
                  </Button>
                ))}
              </div>

              {variantMode === "create" && isPro ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-muted-foreground">
                      AI suggests a tailored headline, about section, and featured projects.
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={isSuggestingVariant}
                      onClick={() => void runSuggestVariant()}
                    >
                      {isSuggestingVariant ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      Regenerate
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Variant name</Label>
                      <Input
                        value={variantName}
                        onChange={(event) => {
                          setVariantName(event.target.value);
                          if (!variantSlug) setVariantSlug(slugify(event.target.value));
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Slug</Label>
                      <Input
                        value={variantSlug}
                        onChange={(event) => setVariantSlug(slugify(event.target.value))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Headline override</Label>
                    <Input
                      value={titleOverride}
                      onChange={(event) => setTitleOverride(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>About override</Label>
                    <Textarea
                      value={aboutOverride}
                      onChange={(event) => setAboutOverride(event.target.value)}
                      rows={5}
                      className="resize-none"
                    />
                  </div>
                  {projects.length > 0 ? (
                    <div className="space-y-2">
                      <Label>Featured projects (up to 3)</Label>
                      <div className="flex flex-wrap gap-2">
                        {projects.map((project) => {
                          const selected = featuredProjectIds.includes(project.id);
                          return (
                            <Button
                              key={project.id}
                              type="button"
                              size="sm"
                              variant={selected ? "default" : "outline"}
                              onClick={() => toggleProject(project.id)}
                            >
                              {project.title}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {variantMode === "existing" && isPro ? (
                <div className="space-y-2">
                  <Label>Existing variant</Label>
                  <select
                    value={existingVariantId}
                    onChange={(event) => setExistingVariantId(event.target.value)}
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Select a variant…</option>
                    {variants.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        {variant.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {TONE_OPTIONS.map((option) => (
                  <Button
                    key={option.id}
                    type="button"
                    size="sm"
                    variant={tone === option.id ? "default" : "outline"}
                    onClick={() => setTone(option.id)}
                  >
                    {option.label}
                  </Button>
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isGeneratingCover}
                  onClick={() => void runGenerateCoverLetter()}
                >
                  {isGeneratingCover ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Regenerate
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Email subject</Label>
                <Input
                  value={coverSubject}
                  onChange={(event) => setCoverSubject(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Cover letter</Label>
                <Textarea
                  value={coverContent}
                  onChange={(event) => setCoverContent(event.target.value)}
                  rows={10}
                  className="max-h-72 min-h-40 resize-none overflow-y-auto leading-relaxed [field-sizing:fixed]"
                />
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-4">
              {!isPro ? (
                <ProUpgradeCard
                  title="Share links are Pro"
                  description="You can still save this application and cover letter without a trackable share link."
                />
              ) : (
                <>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={createShareLink}
                      onChange={(event) => setCreateShareLink(event.target.checked)}
                      className="rounded border-input"
                    />
                    Create a private share link for this application
                  </label>
                  {createShareLink ? (
                    <div className="space-y-2">
                      <Label>Share link label</Label>
                      <Input
                        value={shareLabel}
                        onChange={(event) => setShareLabel(event.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Expires in 30 days. Linked to your{" "}
                        {variantMode === "skip" ? "default portfolio" : "selected variant"}.
                      </p>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          ) : null}

          {step === 5 ? (
            <div className="space-y-4 text-sm">
              <div className="rounded-lg border bg-muted/20 p-4 space-y-2">
                <p>
                  <span className="text-muted-foreground">Role:</span>{" "}
                  <strong>
                    {jobTitle} at {companyName}
                  </strong>
                </p>
                {tailorResult ? (
                  <p>
                    <span className="text-muted-foreground">Fit score:</span>{" "}
                    {tailorResult.fit_score}/100
                  </p>
                ) : null}
                <p>
                  <span className="text-muted-foreground">Variant:</span>{" "}
                  {variantMode === "skip"
                    ? "None"
                    : variantMode === "existing"
                      ? variants.find((v) => v.id === existingVariantId)?.name ?? "—"
                      : variantName || "New variant"}
                </p>
                <p>
                  <span className="text-muted-foreground">Share link:</span>{" "}
                  {createShareLink && isPro ? shareLabel || "Yes" : "No"}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Save as status</Label>
                <select
                  value={applicationStatus}
                  onChange={(event) =>
                    setApplicationStatus(event.target.value as ApplicationStatus)
                  }
                  className="flex h-9 w-full max-w-xs rounded-lg border border-input bg-background px-3 text-sm"
                >
                  {(["saved", "applied", "interview"] as const).map((status) => (
                    <option key={status} value={status}>
                      {APPLICATION_STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : null}

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="flex flex-wrap justify-between gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={goBack} disabled={step === 0 || busy}>
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={goNext} disabled={busy}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="button" onClick={() => void handleSubmit()} disabled={busy}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Save application package
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function finalSlugValid(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
