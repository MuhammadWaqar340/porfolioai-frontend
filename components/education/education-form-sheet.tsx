"use client";

import { useEffect, useState } from "react";
import { AITextMenu } from "@/components/ai/ai-text-menu";
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
import type { NewEducation } from "@/hooks/use-education";
import { useFormErrors } from "@/hooks/use-form-errors";
import { getYearOptions } from "@/lib/experience-utils";
import { validateEducation } from "@/lib/form-validation";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { cn } from "@/lib/utils";
import { useSuggestEducationEntryMutation } from "@/store/api/portfolioApi";
import { useTargetRole } from "@/store/hooks";
import type { Education } from "@/types";

interface EducationFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  education?: Education | null;
  onSubmit: (education: NewEducation) => void | Promise<void>;
}

type FormState = {
  degree: string;
  institution: string;
  startYear: string;
  endYear: string;
};

type EducationField = "degree" | "institution" | "startYear" | "endYear";

const emptyForm: FormState = {
  degree: "",
  institution: "",
  startYear: "",
  endYear: "",
};

const selectClassName = cn(
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
);

export function EducationFormSheet({
  open,
  onOpenChange,
  education,
  onSubmit,
}: EducationFormSheetProps) {
  const isEditing = Boolean(education);
  const [suggestEntry, { isLoading: isSuggesting }] = useSuggestEducationEntryMutation();
  const targetRole = useTargetRole();
  const [aiNotes, setAiNotes] = useState("");
  const [aiError, setAiError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    formError,
    clearAll,
    clearField,
    setValidationErrors,
    applyApiErrorOrFallback,
    getError,
  } = useFormErrors<EducationField>();
  const yearOptions = getYearOptions();

  useEffect(() => {
    if (!open) {
      setForm(emptyForm);
      setAiNotes("");
      setAiError(null);
      clearAll();
      setIsSubmitting(false);
      return;
    }

    if (education) {
      setForm({
        degree: education.degree,
        institution: education.institution,
        startYear: String(education.startYear),
        endYear: String(education.endYear),
      });
    } else {
      setForm(emptyForm);
    }

    clearAll();
  }, [open, education, clearAll]);

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value };

      if (
        key === "startYear" &&
        next.endYear &&
        Number(next.endYear) < Number(value)
      ) {
        next.endYear = "";
      }

      return next;
    });
    clearField(key as EducationField);
    if (key === "startYear") clearField("endYear");
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
        degree: result.degree || current.degree,
        institution: result.institution || current.institution,
        startYear: result.start_year ? String(result.start_year) : current.startYear,
        endYear: result.end_year ? String(result.end_year) : current.endYear,
      }));
    } catch (error) {
      setAiError(getApiErrorMessage(error));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearAll();

    const validationErrors = validateEducation(form);
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        degree: form.degree.trim(),
        institution: form.institution.trim(),
        startYear: Number(form.startYear),
        endYear: Number(form.endYear),
      });

      onOpenChange(false);
    } catch (error) {
      applyApiErrorOrFallback(
        error,
        "Failed to save education. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const endYearOptions = form.startYear
    ? yearOptions.filter((year) => year >= Number(form.startYear))
    : yearOptions;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Edit Education" : "Add Education"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update your education details."
              : "Add a degree, bootcamp, or qualification to your profile."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-4 pb-10">
          <FormAlert message={formError} />

          <div className="space-y-2 rounded-lg border bg-muted/20 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label htmlFor="ai-notes">AI assist</Label>
              <AITextMenu
                fieldType="education_degree"
                text={form.degree}
                onApply={(content) => updateForm("degree", content)}
                onGenerate={handleSuggestEntry}
                generateLabel="Suggest entry"
                isGenerating={isSuggesting}
              />
            </div>
            <textarea
              id="ai-notes"
              className={cn(
                "min-h-16 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
              )}
              placeholder="Optional notes for AI (e.g. bootcamp, self-taught path, target role context)"
              value={aiNotes}
              onChange={(e) => setAiNotes(e.target.value)}
            />
            {aiError ? <p className="text-xs text-destructive">{aiError}</p> : null}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="degree">Degree / Program</Label>
              <AITextMenu
                fieldType="education_degree"
                text={form.degree}
                onApply={(content) => updateForm("degree", content)}
              />
            </div>
            <Input
              id="degree"
              placeholder="e.g. B.S. Computer Science"
              value={form.degree}
              onChange={(e) => updateForm("degree", e.target.value)}
              aria-invalid={Boolean(getError("degree"))}
              autoFocus
            />
            <FieldError message={getError("degree")} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="institution">Institution</Label>
              <AITextMenu
                fieldType="education_institution"
                text={form.institution}
                onApply={(content) => updateForm("institution", content)}
              />
            </div>
            <Input
              id="institution"
              placeholder="e.g. University of California, Berkeley"
              value={form.institution}
              onChange={(e) => updateForm("institution", e.target.value)}
              aria-invalid={Boolean(getError("institution"))}
            />
            <FieldError message={getError("institution")} />
          </div>

          <div className="space-y-2">
            <Label>Years</Label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Start year</p>
                <select
                  id="startYear"
                  aria-label="Start year"
                  className={selectClassName}
                  value={form.startYear}
                  onChange={(e) => updateForm("startYear", e.target.value)}
                  aria-invalid={Boolean(getError("startYear"))}
                >
                  <option value="">Start</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={String(year)}>
                      {year}
                    </option>
                  ))}
                </select>
                <FieldError message={getError("startYear")} />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">End year</p>
                <select
                  id="endYear"
                  aria-label="End year"
                  className={selectClassName}
                  value={form.endYear}
                  onChange={(e) => updateForm("endYear", e.target.value)}
                  disabled={!form.startYear}
                  aria-invalid={Boolean(getError("endYear"))}
                >
                  <option value="">End</option>
                  {endYearOptions.map((year) => (
                    <option key={year} value={String(year)}>
                      {year}
                    </option>
                  ))}
                </select>
                <FieldError message={getError("endYear")} />
              </div>
            </div>
          </div>

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
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Add Education"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
