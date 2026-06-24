"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { ExperienceFormSheet } from "@/components/experience/experience-form-sheet";
import { ExperienceTimeline } from "@/components/timeline/experience-timeline";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useExperience } from "@/hooks/use-experience";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { confirmDeleteDescription } from "@/lib/confirm-dialog-copy";
import type { NewExperience } from "@/hooks/use-experience";
import type { Experience } from "@/types";

export function ExperienceManager() {
  const {
    experiences,
    isLoaded,
    addExperience,
    updateExperience,
    removeExperience,
    reorderExperience,
  } = useExperience();
  const { confirm, confirmDialog } = useConfirmDialog();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null
  );

  function openAddSheet() {
    setEditingExperience(null);
    setSheetOpen(true);
  }

  function openEditSheet(experience: Experience) {
    setEditingExperience(experience);
    setSheetOpen(true);
  }

  function handleSheetOpenChange(open: boolean) {
    setSheetOpen(open);
    if (!open) {
      setEditingExperience(null);
    }
  }

  async function handleSubmit(data: NewExperience) {
    if (editingExperience) {
      await updateExperience(editingExperience.id, data);
      return;
    }

    await addExperience(data);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Experience"
        description="Your professional work history and achievements. Drag to reorder."
      >
        <Button onClick={openAddSheet}>
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </PageHeader>

      {isLoaded && experiences.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <p className="text-muted-foreground">
              No experience added yet. Add your first role to get started.
            </p>
            <Button onClick={openAddSheet}>
              <Plus className="mr-2 h-4 w-4" />
              Add Experience
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ExperienceTimeline
          experiences={experiences}
          onEdit={openEditSheet}
          onReorder={reorderExperience}
          onRemove={(exp) => {
            confirm({
              title: "Delete experience?",
              description: confirmDeleteDescription(
                exp.position || exp.company || "this role"
              ),
              confirmLabel: "Delete",
              variant: "destructive",
              onConfirm: () => removeExperience(exp.id),
            });
          }}
        />
      )}

      {confirmDialog}

      <ExperienceFormSheet
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
        experience={editingExperience}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
