"use client";

import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SkillBadge } from "@/components/cards/skill-badge";
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
import { SKILL_CATEGORIES } from "@/constants/skills";
import type { AddSkillsResult } from "@/hooks/use-skills";
import { useFormErrors } from "@/hooks/use-form-errors";
import { validateAddSkills } from "@/lib/form-validation";
import { cn } from "@/lib/utils";
import type { SkillCategory } from "@/types";

interface AddSkillSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMany: (
    names: string[],
    category: string
  ) => AddSkillsResult | Promise<AddSkillsResult>;
  categories: SkillCategory[];
}

type SkillField = "category" | "skills" | "skillInput";

const selectClassName = cn(
  "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
);

export function AddSkillSheet({
  open,
  onOpenChange,
  onAddMany,
  categories,
}: AddSkillSheetProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [skillInput, setSkillInput] = useState("");
  const [pendingSkills, setPendingSkills] = useState<string[]>([]);
  const [category, setCategory] = useState<string>(SKILL_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const {
    formError,
    clearAll,
    clearField,
    setValidationErrors,
    getError,
    setFormError,
  } = useFormErrors<SkillField>();

  const existingCategories = [
    ...new Set([
      ...SKILL_CATEGORIES,
      ...categories.map((item) => item.name),
    ]),
  ];

  useEffect(() => {
    if (!open) {
      setSkillInput("");
      setPendingSkills([]);
      setCategory(SKILL_CATEGORIES[0]);
      setCustomCategory("");
      setUseCustomCategory(false);
      clearAll();
    }
  }, [open, clearAll]);

  function addPendingSkill() {
    const trimmed = skillInput.trim();

    if (!trimmed) {
      setValidationErrors({ skillInput: "Please enter a skill name." });
      return;
    }

    const isDuplicate = pendingSkills.some(
      (skill) => skill.toLowerCase() === trimmed.toLowerCase()
    );

    if (isDuplicate) {
      setValidationErrors({
        skillInput: `"${trimmed}" is already in your list.`,
      });
      return;
    }

    setPendingSkills((current) => [...current, trimmed]);
    setSkillInput("");
    clearField("skillInput");
    clearField("skills");
    inputRef.current?.focus();
  }

  function removePendingSkill(name: string) {
    setPendingSkills((current) => current.filter((skill) => skill !== name));
    clearField("skills");
  }

  function handleSkillInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addPendingSkill();
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearAll();

    const selectedCategory = useCustomCategory
      ? customCategory.trim()
      : category;

    const validationErrors = validateAddSkills({
      pendingSkills,
      category: selectedCategory,
    });

    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors(validationErrors);
      return;
    }

    const result = await onAddMany(pendingSkills, selectedCategory);

    if (result.added.length === 0) {
      setFormError(
        result.skipped.length > 0
          ? "All skills in your list already exist in this category."
          : "No skills were added. Please try again."
      );
      return;
    }

    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Add Skills</SheetTitle>
          <SheetDescription>
            Type a skill name and click + to add it to your list. When you are
            done, click Add Skills to save them.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-4 pb-8">
          <FormAlert message={formError} />

          <div className="space-y-3">
            <Label>Category</Label>
            {!useCustomCategory ? (
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  clearField("category");
                }}
                className={selectClassName}
                aria-invalid={Boolean(getError("category"))}
              >
                {existingCategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                placeholder="e.g. DevOps"
                value={customCategory}
                onChange={(e) => {
                  setCustomCategory(e.target.value);
                  clearField("category");
                }}
                aria-invalid={Boolean(getError("category"))}
              />
            )}
            <FieldError message={getError("category")} />
            <button
              type="button"
              onClick={() => {
                setUseCustomCategory((current) => !current);
                clearField("category");
              }}
              className="text-sm text-primary hover:underline"
            >
              {useCustomCategory
                ? "Use existing category"
                : "Create new category"}
            </button>
          </div>

          <div className="space-y-3">
            <Label htmlFor="skillName">Skill name</Label>
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                id="skillName"
                className="min-w-0 flex-1"
                placeholder="e.g. GraphQL"
                value={skillInput}
                onChange={(e) => {
                  setSkillInput(e.target.value);
                  clearField("skillInput");
                }}
                aria-invalid={Boolean(getError("skillInput"))}
                onKeyDown={handleSkillInputKeyDown}
                autoFocus
              />
              <Button
                type="button"
                size="icon"
                onClick={addPendingSkill}
                aria-label="Add skill to list"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <FieldError message={getError("skillInput")} />
            <p className="text-xs text-muted-foreground">
              Press Enter or click + to add each skill to your list.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Skills to add ({pendingSkills.length})</Label>
            <div
              className={cn(
                "min-h-24 rounded-lg border bg-muted/30 p-3",
                getError("skills") && "border-destructive"
              )}
            >
              {pendingSkills.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No skills added yet. Start typing and click +.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {pendingSkills.map((skill) => (
                    <SkillBadge
                      key={skill}
                      name={skill}
                      onRemove={() => removePendingSkill(skill)}
                    />
                  ))}
                </div>
              )}
            </div>
            <FieldError message={getError("skills")} />
          </div>

          <SheetFooter className="px-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pendingSkills.length === 0}>
              Add {pendingSkills.length > 0 ? pendingSkills.length : ""} Skill
              {pendingSkills.length === 1 ? "" : "s"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
