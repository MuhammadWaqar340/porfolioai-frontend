"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
} from "@/constants/applications";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { FormAlert } from "@/components/ui/form-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  FollowUpReminderPicker,
  fromDatetimeLocal,
  toDatetimeLocal,
} from "@/components/applications/follow-up-reminder-picker";
import { ApplicationCoverLetterField } from "@/components/applications/application-cover-letter-field";
import { useFormErrors } from "@/hooks/use-form-errors";
import type { JobApplication } from "@/lib/api/types";
import { isValidRecruiterEmail } from "@/lib/application-email";
import { cn } from "@/lib/utils";
import {
  useGetPortfolioVariantsQuery,
  useGetShareLinksQuery,
} from "@/store/api/portfolioApi";

export interface ApplicationFormValues {
  company_name: string;
  job_title: string;
  recruiter_email: string;
  job_url: string;
  job_description: string;
  status: ApplicationStatus;
  fit_score: string;
  notes: string;
  follow_up_at: string;
  portfolio_variant_id: string;
  share_link_id: string;
  cover_letter_subject: string;
  cover_letter_content: string;
}

type ApplicationField =
  | "company_name"
  | "job_title"
  | "recruiter_email"
  | "job_url"
  | "fit_score"
  | "job_description"
  | "notes";

const emptyForm: ApplicationFormValues = {
  company_name: "",
  job_title: "",
  recruiter_email: "",
  job_url: "",
  job_description: "",
  status: "saved",
  fit_score: "",
  notes: "",
  follow_up_at: "",
  portfolio_variant_id: "",
  share_link_id: "",
  cover_letter_subject: "",
  cover_letter_content: "",
};

const selectClassName = cn(
  "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
);

function applicationToForm(application: JobApplication): ApplicationFormValues {
  return {
    company_name: application.company_name,
    job_title: application.job_title,
    recruiter_email: application.recruiter_email ?? "",
    job_url: application.job_url ?? "",
    job_description: application.job_description ?? "",
    status: application.status,
    fit_score: application.fit_score != null ? String(application.fit_score) : "",
    notes: application.notes ?? "",
    follow_up_at: toDatetimeLocal(application.follow_up_at),
    portfolio_variant_id: application.portfolio_variant_id ?? "",
    share_link_id: application.share_link_id ?? "",
    cover_letter_subject: application.cover_letter_subject ?? "",
    cover_letter_content: application.cover_letter_content ?? "",
  };
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-sm font-medium">{title}</h3>
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

interface ApplicationFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application?: JobApplication | null;
  onSubmit: (values: ApplicationFormValues) => Promise<void>;
}

export function ApplicationFormSheet({
  open,
  onOpenChange,
  application,
  onSubmit,
}: ApplicationFormSheetProps) {
  const isEditing = Boolean(application);
  const { data: variants = [] } = useGetPortfolioVariantsQuery();
  const { data: shareLinks = [] } = useGetShareLinksQuery();
  const [form, setForm] = useState<ApplicationFormValues>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    formError,
    clearAll,
    clearField,
    setValidationErrors,
    applyApiErrorOrFallback,
    getError,
  } = useFormErrors<ApplicationField>();

  useEffect(() => {
    if (!open) {
      setForm(emptyForm);
      clearAll();
      setIsSubmitting(false);
      return;
    }

    setForm(application ? applicationToForm(application) : emptyForm);
    clearAll();
  }, [open, application, clearAll]);

  function updateField<K extends keyof ApplicationFormValues>(
    key: K,
    value: ApplicationFormValues[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    if (key in { company_name: 1, job_title: 1, recruiter_email: 1, job_url: 1, fit_score: 1, job_description: 1, notes: 1 }) {
      clearField(key as ApplicationField);
    }
  }

  function validate(): boolean {
    const errors: Partial<Record<ApplicationField, string>> = {};
    if (!form.company_name.trim()) errors.company_name = "Company is required.";
    if (!form.job_title.trim()) errors.job_title = "Job title is required.";
    if (form.recruiter_email.trim() && !isValidRecruiterEmail(form.recruiter_email)) {
      errors.recruiter_email = "Enter a valid recruiter email.";
    }
    if (form.fit_score.trim()) {
      const score = Number(form.fit_score);
      if (Number.isNaN(score) || score < 0 || score > 100) {
        errors.fit_score = "Fit score must be between 0 and 100.";
      }
    }
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return false;
    }
    return true;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearAll();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(form);
      onOpenChange(false);
    } catch (error) {
      applyApiErrorOrFallback(error, "Failed to save application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Application" : "Add Application"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update this role in your tracker and keep materials linked."
              : "Track a role you are preparing for or have already applied to."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-4 pb-10">
          <FormAlert message={formError} />

          <FormSection title="Role details">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company</Label>
              <Input
                id="company_name"
                value={form.company_name}
                onChange={(event) => updateField("company_name", event.target.value)}
                placeholder="e.g. Acme Corp"
                aria-invalid={Boolean(getError("company_name"))}
                autoFocus
              />
              <FieldError message={getError("company_name")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_title">Job title</Label>
              <Input
                id="job_title"
                value={form.job_title}
                onChange={(event) => updateField("job_title", event.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                aria-invalid={Boolean(getError("job_title"))}
              />
              <FieldError message={getError("job_title")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_url">
                Job posting URL{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="job_url"
                type="url"
                value={form.job_url}
                onChange={(event) => updateField("job_url", event.target.value)}
                placeholder="https://..."
                aria-invalid={Boolean(getError("job_url"))}
              />
              <FieldError message={getError("job_url")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recruiter_email">
                Recruiter / hiring manager email{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="recruiter_email"
                type="email"
                value={form.recruiter_email}
                onChange={(event) => updateField("recruiter_email", event.target.value)}
                placeholder="recruiter@company.com"
                aria-invalid={Boolean(getError("recruiter_email"))}
              />
              <FieldError message={getError("recruiter_email")} />
              <p className="text-xs text-muted-foreground">
                Saved on the application card for quick reference when you reach out.
              </p>
            </div>
          </FormSection>

          <Separator />

          <FormSection
            title="Pipeline"
            description="Track where this application sits and when to follow up."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(event) =>
                    updateField("status", event.target.value as ApplicationStatus)
                  }
                  className={selectClassName}
                >
                  {APPLICATION_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {APPLICATION_STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fit_score">
                  Fit score{" "}
                  <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="fit_score"
                  inputMode="numeric"
                  value={form.fit_score}
                  onChange={(event) => updateField("fit_score", event.target.value)}
                  placeholder="e.g. 78"
                  aria-invalid={Boolean(getError("fit_score"))}
                />
                <FieldError message={getError("fit_score")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="follow_up_at">
                Follow-up reminder{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <FollowUpReminderPicker
                id="follow_up_at"
                value={form.follow_up_at}
                onChange={(value) => updateField("follow_up_at", value)}
              />
              <p className="text-xs text-muted-foreground">
                When this time passes, you&apos;ll get an in-app notification and an email
                (if email updates are enabled in Settings).
              </p>
            </div>
          </FormSection>

          <Separator />

          <FormSection title="Notes">
            <div className="space-y-2">
              <Label htmlFor="job_description">
                Job description{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="job_description"
                value={form.job_description}
                onChange={(event) => updateField("job_description", event.target.value)}
                rows={4}
                placeholder="Paste key requirements or responsibilities from the posting…"
                className="max-h-52 min-h-[120px] resize-none overflow-y-auto leading-relaxed [field-sizing:fixed]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">
                Private notes{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(event) => updateField("notes", event.target.value)}
                rows={3}
                placeholder="Recruiter name, referral, interview prep notes…"
                className="resize-none"
              />
            </div>
          </FormSection>

          <Separator />

          <FormSection
            title="Portfolio materials"
            description="Link the variant or share URL you used for this application."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="portfolio_variant_id">Portfolio variant</Label>
                <select
                  id="portfolio_variant_id"
                  value={form.portfolio_variant_id}
                  onChange={(event) => updateField("portfolio_variant_id", event.target.value)}
                  className={selectClassName}
                >
                  <option value="">None</option>
                  {variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="share_link_id">Share link</Label>
                <select
                  id="share_link_id"
                  value={form.share_link_id}
                  onChange={(event) => updateField("share_link_id", event.target.value)}
                  className={selectClassName}
                >
                  <option value="">None</option>
                  {shareLinks.map((link) => (
                    <option key={link.id} value={link.id}>
                      {link.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {variants.length === 0 && shareLinks.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Create variants and share links in{" "}
                <Link href="/settings" className="text-primary hover:underline">
                  Settings
                </Link>
                .
              </p>
            ) : null}

            <ApplicationCoverLetterField
              companyName={form.company_name}
              jobTitle={form.job_title}
              jobDescription={form.job_description}
              notes={form.notes}
              subject={form.cover_letter_subject}
              content={form.cover_letter_content}
              onSubjectChange={(value) => updateField("cover_letter_subject", value)}
              onContentChange={(value) => updateField("cover_letter_content", value)}
            />

          </FormSection>

          <SheetFooter className="px-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving…"
                : isEditing
                  ? "Save Changes"
                  : "Add Application"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export function buildApplicationPayload(form: ApplicationFormValues) {
  const fitScore = form.fit_score.trim();
  return {
    company_name: form.company_name.trim(),
    job_title: form.job_title.trim(),
    recruiter_email: form.recruiter_email.trim() || undefined,
    job_url: form.job_url.trim() || undefined,
    job_description: form.job_description.trim() || undefined,
    status: form.status,
    fit_score: fitScore ? Number(fitScore) : undefined,
    notes: form.notes.trim() || undefined,
    follow_up_at: fromDatetimeLocal(form.follow_up_at),
    portfolio_variant_id: form.portfolio_variant_id || null,
    share_link_id: form.share_link_id || null,
    cover_letter_subject: form.cover_letter_subject.trim() || undefined,
    cover_letter_content: form.cover_letter_content.trim() || undefined,
  };
}
