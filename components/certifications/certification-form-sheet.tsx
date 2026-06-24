"use client";

import { Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AITextMenu } from "@/components/ai/ai-text-menu";
import { MonthYearPicker } from "@/components/experience/month-year-picker";
import { ProjectImage } from "@/components/projects/project-image";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { FormAlert } from "@/components/ui/form-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ACCEPTED_PROJECT_IMAGE_TYPES,
  MAX_PROJECT_IMAGE_SIZE_MB,
} from "@/constants/projects";
import type { NewCertification } from "@/hooks/use-certifications";
import { useFormErrors } from "@/hooks/use-form-errors";
import { resolveAssetUrl } from "@/lib/api/asset-url";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { validateCertification } from "@/lib/form-validation";
import { useUploadCertificationMediaMutation, useSuggestCertificationEntryMutation } from "@/store/api/portfolioApi";
import { useTargetRole } from "@/store/hooks";
import type { Certification } from "@/types";

interface CertificationFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certification?: Certification | null;
  onSubmit: (certification: NewCertification) => void | Promise<void>;
}

type FormState = {
  name: string;
  organization: string;
  issueMonth: string;
  issueYear: string;
  credentialUrl: string;
  mediaUrl: string;
};

const emptyForm: FormState = {
  name: "",
  organization: "",
  issueMonth: "",
  issueYear: "",
  credentialUrl: "",
  mediaUrl: "",
};

type CertificationField =
  | "name"
  | "organization"
  | "issueDate"
  | "credentialUrl"
  | "mediaUrl";

export function CertificationFormSheet({
  open,
  onOpenChange,
  certification,
  onSubmit,
}: CertificationFormSheetProps) {
  const isEditing = Boolean(certification);
  const [suggestEntry, { isLoading: isSuggesting }] = useSuggestCertificationEntryMutation();
  const targetRole = useTargetRole();
  const [aiNotes, setAiNotes] = useState("");
  const [aiError, setAiError] = useState<string | null>(null);
  const [uploadCertificationMedia, { isLoading: isUploading }] =
    useUploadCertificationMediaMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingMediaFileRef = useRef<File | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    formError,
    clearAll,
    clearField,
    setValidationErrors,
    applyApiErrorOrFallback,
    getError,
  } = useFormErrors<CertificationField>();

  useEffect(() => {
    if (!open) {
      setForm(emptyForm);
      setAiNotes("");
      setAiError(null);
      clearAll();
      setIsSubmitting(false);
      pendingMediaFileRef.current = null;
      return;
    }

    if (certification) {
      setForm({
        name: certification.name,
        organization: certification.organization,
        issueMonth: String(certification.issueMonth),
        issueYear: String(certification.issueYear),
        credentialUrl: certification.credentialUrl,
        mediaUrl: certification.mediaUrl,
      });
    } else {
      setForm(emptyForm);
    }

    pendingMediaFileRef.current = null;
    clearAll();
  }, [open, certification, clearAll]);

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    if (key === "name") clearField("name");
    if (key === "organization") clearField("organization");
    if (key === "credentialUrl") clearField("credentialUrl");
    if (key === "mediaUrl") clearField("mediaUrl");
  }

  function handleIssueDateChange(month: string, year: string) {
    setForm((current) => ({
      ...current,
      issueMonth: month,
      issueYear: year,
    }));
    clearField("issueDate");
  }

  function handleMediaUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (
      !ACCEPTED_PROJECT_IMAGE_TYPES.includes(
        file.type as (typeof ACCEPTED_PROJECT_IMAGE_TYPES)[number]
      )
    ) {
      setValidationErrors({
        mediaUrl: "Please upload a JPG, PNG, WebP, or GIF image.",
      });
      return;
    }

    if (file.size > MAX_PROJECT_IMAGE_SIZE_MB * 1024 * 1024) {
      setValidationErrors({
        mediaUrl: `Image must be smaller than ${MAX_PROJECT_IMAGE_SIZE_MB}MB.`,
      });
      return;
    }

    pendingMediaFileRef.current = file;
    updateForm("mediaUrl", URL.createObjectURL(file));
    clearField("mediaUrl");
  }

  function handleRemoveMedia() {
    pendingMediaFileRef.current = null;
    updateForm("mediaUrl", "");
    clearField("mediaUrl");
  }

  async function handleSuggestEntry() {
    setAiError(null);
    try {
      const result = await suggestEntry({
        notes: aiNotes,
        target_role: targetRole,
      }).unwrap();
      setForm((current) => ({
        ...current,
        name: result.name || current.name,
        organization: result.organization || current.organization,
      }));
    } catch (error) {
      setAiError(getApiErrorMessage(error));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearAll();

    const validationErrors = validateCertification(form);
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      let mediaUrl = form.mediaUrl.trim();

      if (pendingMediaFileRef.current) {
        const formData = new FormData();
        formData.append("file", pendingMediaFileRef.current);
        const result = await uploadCertificationMedia(formData).unwrap();
        mediaUrl = resolveAssetUrl(result.media_url);
        pendingMediaFileRef.current = null;
      } else if (mediaUrl.startsWith("data:") || mediaUrl.startsWith("blob:")) {
        setValidationErrors({
          mediaUrl: "Please re-upload the certification media.",
        });
        return;
      }

      await onSubmit({
        name: form.name.trim(),
        organization: form.organization.trim(),
        issueMonth: Number(form.issueMonth),
        issueYear: Number(form.issueYear),
        credentialUrl: form.credentialUrl.trim(),
        mediaUrl,
      });

      onOpenChange(false);
    } catch (error) {
      applyApiErrorOrFallback(
        error,
        "Failed to save certification. Please try again.",
        {
          issue_month: "issueDate",
          issue_year: "issueDate",
        } as Record<string, CertificationField>
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const isBusy = isSubmitting || isUploading;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Edit Certification" : "Add Certification"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update your certification details."
              : "Add a professional certification or credential."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-4 pb-10">
          <FormAlert message={formError} />

          <div className="space-y-2 rounded-lg border bg-muted/20 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label htmlFor="cert-ai-notes">AI assist</Label>
              <AITextMenu
                fieldType="certification_name"
                text={form.name}
                onApply={(content) => updateForm("name", content)}
                onGenerate={handleSuggestEntry}
                generateLabel="Suggest entry"
                isGenerating={isSuggesting}
              />
            </div>
            <textarea
              id="cert-ai-notes"
              className="min-h-16 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
              placeholder="Optional notes (e.g. cloud certs for your target role)"
              value={aiNotes}
              onChange={(e) => setAiNotes(e.target.value)}
            />
            {aiError ? <p className="text-xs text-destructive">{aiError}</p> : null}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="name">Certification name</Label>
              <AITextMenu
                fieldType="certification_name"
                text={form.name}
                onApply={(content) => updateForm("name", content)}
              />
            </div>
            <Input
              id="name"
              placeholder="e.g. AWS Certified Solutions Architect"
              value={form.name}
              onChange={(e) => updateForm("name", e.target.value)}
              aria-invalid={Boolean(getError("name"))}
              autoFocus
            />
            <FieldError message={getError("name")} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="organization">
                Issuing organization<span className="text-destructive">*</span>
              </Label>
              <AITextMenu
                fieldType="certification_organization"
                text={form.organization}
                onApply={(content) => updateForm("organization", content)}
              />
            </div>
            <Input
              id="organization"
              placeholder="e.g. Amazon Web Services"
              value={form.organization}
              onChange={(e) => updateForm("organization", e.target.value)}
              aria-invalid={Boolean(getError("organization"))}
            />
            <FieldError message={getError("organization")} />
          </div>

          <MonthYearPicker
            id="issue-date"
            label="Issue date"
            month={form.issueMonth}
            year={form.issueYear}
            onChange={handleIssueDateChange}
            placeholder="Pick issue date"
            error={getError("issueDate")}
          />

          <div className="space-y-2">
            <Label htmlFor="credentialUrl">Credential URL</Label>
            <Input
              id="credentialUrl"
              type="url"
              placeholder="https://www.credly.com/badges/..."
              value={form.credentialUrl}
              onChange={(e) => updateForm("credentialUrl", e.target.value)}
              aria-invalid={Boolean(getError("credentialUrl"))}
            />
            <FieldError message={getError("credentialUrl")} />
          </div>

          <div className="space-y-3">
            <Label>Media</Label>
            <ProjectImage
              src={form.mediaUrl}
              alt="Certification media preview"
              className="aspect-[4/3] rounded-lg border"
              sizes="(max-width: 512px) 100vw, 512px"
            />
            {!form.mediaUrl && (
              <p className="text-xs text-muted-foreground">
                Upload a badge or certificate image (optional).
              </p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_PROJECT_IMAGE_TYPES.join(",")}
              className="hidden"
              onChange={handleMediaUpload}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {form.mediaUrl ? "Change Media" : "Upload Media"}
            </Button>
            {form.mediaUrl && (
              <Button
                type="button"
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={handleRemoveMedia}
              >
                Remove Media
              </Button>
            )}
            <FieldError message={getError("mediaUrl")} />
          </div>

          <SheetFooter className="px-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isBusy}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isBusy}>
              {isBusy
                ? isUploading
                  ? "Uploading media..."
                  : "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Add Certification"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
