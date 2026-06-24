"use client";

import { useEffect, useState } from "react";
import { AITextMenu } from "@/components/ai/ai-text-menu";
import { MonthYearPicker } from "@/components/experience/month-year-picker";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { FormAlert } from "@/components/ui/form-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { NewExperience } from "@/hooks/use-experience";
import { useFormErrors } from "@/hooks/use-form-errors";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { monthYearToDate } from "@/lib/experience-utils";
import { validateExperience } from "@/lib/form-validation";
import { useGenerateExperienceDescriptionMutation } from "@/store/api/portfolioApi";
import { useTargetRole } from "@/store/hooks";
import type { Experience } from "@/types";

interface ExperienceFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience?: Experience | null;
  onSubmit: (experience: NewExperience) => void | Promise<void>;
}

type FormState = {
  company: string;
  position: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  isPresent: boolean;
  description: string;
};

type ExperienceField =
  | "position"
  | "company"
  | "startDate"
  | "endDate"
  | "description";

const emptyForm: FormState = {
  company: "",
  position: "",
  startMonth: "",
  startYear: "",
  endMonth: "",
  endYear: "",
  isPresent: false,
  description: "",
};

export function ExperienceFormSheet({
  open,
  onOpenChange,
  experience,
  onSubmit,
}: ExperienceFormSheetProps) {
  const isEditing = Boolean(experience);
  const [generateDescription, { isLoading: isGenerating }] =
    useGenerateExperienceDescriptionMutation();
  const targetRole = useTargetRole();
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const {
    formError,
    clearAll,
    clearField,
    setValidationErrors,
    applyApiErrorOrFallback,
    getError,
  } = useFormErrors<ExperienceField>();

  useEffect(() => {
    if (!open) {
      setForm(emptyForm);
      clearAll();
      setIsSubmitting(false);
      return;
    }

    if (experience) {
      setForm({
        company: experience.company,
        position: experience.position,
        startMonth: String(experience.startMonth),
        startYear: String(experience.startYear),
        endMonth: experience.endMonth ? String(experience.endMonth) : "",
        endYear: experience.endYear ? String(experience.endYear) : "",
        isPresent: experience.isPresent,
        description: experience.description,
      });
    } else {
      setForm(emptyForm);
    }

    clearAll();
  }, [open, experience, clearAll]);

  const startDate =
    form.startMonth && form.startYear
      ? monthYearToDate(Number(form.startMonth), Number(form.startYear))
      : undefined;

  const endDate =
    form.endMonth && form.endYear
      ? monthYearToDate(Number(form.endMonth), Number(form.endYear))
      : undefined;

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    if (key === "position") clearField("position");
    if (key === "company") clearField("company");
    if (key === "description") clearField("description");
  }

  function handleStartDateChange(month: string, year: string) {
    setForm((current) => {
      const next = { ...current, startMonth: month, startYear: year };

      if (
        !current.isPresent &&
        current.endMonth &&
        current.endYear &&
        month &&
        year
      ) {
        const start = Number(year) * 12 + Number(month);
        const end =
          Number(current.endYear) * 12 + Number(current.endMonth);

        if (end < start) {
          next.endMonth = "";
          next.endYear = "";
        }
      }

      return next;
    });
    clearField("startDate");
    clearField("endDate");
  }

  function handleEndDateChange(month: string, year: string) {
    setForm((current) => ({ ...current, endMonth: month, endYear: year }));
    clearField("endDate");
  }

  function handlePresentChange(checked: boolean) {
    setForm((current) => ({
      ...current,
      isPresent: checked,
      endMonth: checked ? "" : current.endMonth,
      endYear: checked ? "" : current.endYear,
    }));
    clearField("endDate");
  }

  async function handleGenerateDescription() {
    setAiError(null);
    try {
      const result = await generateDescription({
        company: form.company,
        position: form.position,
        notes: form.description,
        is_present: form.isPresent,
        target_role: targetRole,
      }).unwrap();
      updateForm("description", result.content);
    } catch (error) {
      setAiError(getApiErrorMessage(error));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearAll();

    const validationErrors = validateExperience(form);
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors(validationErrors);
      return;
    }

    const startMonth = Number(form.startMonth);
    const startYear = Number(form.startYear);
    const endMonth = form.isPresent ? null : Number(form.endMonth);
    const endYear = form.isPresent ? null : Number(form.endYear);

    setIsSubmitting(true);

    try {
      await onSubmit({
        company: form.company.trim(),
        position: form.position.trim(),
        startMonth,
        startYear,
        endMonth,
        endYear,
        isPresent: form.isPresent,
        description: form.description.trim(),
      });

      onOpenChange(false);
    } catch (error) {
      applyApiErrorOrFallback(
        error,
        "Failed to save experience. Please try again.",
        {
          start_month: "startDate",
          start_year: "startDate",
          end_month: "endDate",
          end_year: "endDate",
        } as Record<string, ExperienceField>
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Edit Experience" : "Add Experience"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update your work experience details."
              : "Add a new role to your professional work history."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-4 pb-10">
          <FormAlert message={formError} />

          <div className="space-y-2">
            <Label htmlFor="position">Job title</Label>
            <Input
              id="position"
              placeholder="e.g. Senior Full Stack Developer"
              value={form.position}
              onChange={(e) => updateForm("position", e.target.value)}
              aria-invalid={Boolean(getError("position"))}
              autoFocus
            />
            <FieldError message={getError("position")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              placeholder="e.g. TechCorp Inc."
              value={form.company}
              onChange={(e) => updateForm("company", e.target.value)}
              aria-invalid={Boolean(getError("company"))}
            />
            <FieldError message={getError("company")} />
          </div>

          <div className="space-y-4">
            <Label>Duration</Label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <MonthYearPicker
                id="start-date"
                label="Start date"
                month={form.startMonth}
                year={form.startYear}
                onChange={handleStartDateChange}
                placeholder="Start"
                maxDate={endDate}
                error={getError("startDate")}
              />

              <MonthYearPicker
                id="end-date"
                label="End date"
                month={form.endMonth}
                year={form.endYear}
                onChange={handleEndDateChange}
                disabled={form.isPresent}
                placeholder={form.isPresent ? "Present" : "End"}
                minDate={startDate}
                error={getError("endDate")}
              />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2.5">
              <div className="min-w-0 flex-1 pr-2">
                <p className="text-sm font-medium">Present</p>
                <p className="text-xs text-muted-foreground">
                  I currently work in this role
                </p>
              </div>
              <Switch
                checked={form.isPresent}
                onCheckedChange={handlePresentChange}
                aria-label="Currently work here"
                className="shrink-0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label htmlFor="description">Description</Label>
              <AITextMenu
                fieldType="experience_description"
                text={form.description}
                onApply={(content) => updateForm("description", content)}
                onGenerate={handleGenerateDescription}
                generateLabel="Generate bullets"
                isGenerating={isGenerating}
              />
            </div>
            <Textarea
              id="description"
              placeholder="Describe your responsibilities and achievements..."
              value={form.description}
              onChange={(e) => updateForm("description", e.target.value)}
              aria-invalid={Boolean(getError("description"))}
              rows={5}
            />
            {aiError && <p className="text-sm text-destructive">{aiError}</p>}
            <FieldError message={getError("description")} />
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
                  : "Add Experience"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
