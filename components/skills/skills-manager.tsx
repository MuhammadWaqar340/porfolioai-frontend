"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { AddSkillSheet } from "@/components/skills/add-skill-sheet";
import { SkillsCategoriesGrid } from "@/components/skills/skills-categories-grid";
import { SkillsSuggestionsPanel } from "@/components/skills/skills-suggestions-panel";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSkills } from "@/hooks/use-skills";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { confirmDeleteDescription } from "@/lib/confirm-dialog-copy";
import { notifyError, notifyInfo } from "@/lib/toast";
import type { SkillCategory } from "@/types";

export function SkillsManager() {
  const {
    skills,
    isLoaded,
    addSkills,
    removeSkill,
    reorderCategories,
    reorderSkills,
    renameCategory,
    deleteCategory,
  } = useSkills();
  const { confirm, confirmDialog } = useConfirmDialog();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleAddMany(names: string[], category: string) {
    const result = await addSkills(names, category);

    if (result.skipped.length > 0) {
      notifyInfo(`Skipped duplicates: ${result.skipped.join(", ")}.`);
    }

    return result;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Skills"
        description="Organize your technical skills by category. Drag to reorder categories and skills."
      >
        <Button onClick={() => setSheetOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </PageHeader>

      {errorMessage && (
        <div className="break-words rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      <SkillsSuggestionsPanel
        categories={skills}
        onAddMany={handleAddMany}
      />

      {isLoaded && skills.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <p className="text-muted-foreground">
              No skills yet. Add your first skill to get started.
            </p>
            <Button onClick={() => setSheetOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Skill
            </Button>
          </CardContent>
        </Card>
      ) : (
        <SkillsCategoriesGrid
          categories={skills}
          onReorderCategory={reorderCategories}
          onReorderSkill={reorderSkills}
          onRenameCategory={async (categoryId, name) => {
            setErrorMessage(null);
            try {
              await renameCategory(categoryId, name);
            } catch (error) {
              const message = getApiErrorMessage(error);
              setErrorMessage(message);
              notifyError(message);
              throw error;
            }
          }}
          onDeleteCategory={async (category: SkillCategory) => {
            setErrorMessage(null);
            try {
              await deleteCategory(category.id);
            } catch (error) {
              const message = getApiErrorMessage(error);
              setErrorMessage(message);
              notifyError(message);
              throw error;
            }
          }}
          onRemoveSkill={(skill) => {
            confirm({
              title: "Remove skill?",
              description: confirmDeleteDescription(
                skill.name,
                `from ${skill.category}`
              ),
              confirmLabel: "Remove",
              variant: "destructive",
              onConfirm: () => removeSkill(skill.id),
            });
          }}
        />
      )}

      {confirmDialog}

      <AddSkillSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onAddMany={handleAddMany}
        categories={skills}
      />
    </div>
  );
}
