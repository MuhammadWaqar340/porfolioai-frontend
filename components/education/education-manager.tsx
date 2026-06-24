"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { EducationFormSheet } from "@/components/education/education-form-sheet";
import { EducationGrid } from "@/components/education/education-grid";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEducation } from "@/hooks/use-education";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { confirmDeleteDescription } from "@/lib/confirm-dialog-copy";
import type { NewEducation } from "@/hooks/use-education";
import type { Education } from "@/types";

export function EducationManager() {
  const {
    education,
    isLoaded,
    addEducation,
    updateEducation,
    removeEducation,
    reorderEducation,
  } = useEducation();
  const { confirm, confirmDialog } = useConfirmDialog();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(
    null
  );

  function openAddSheet() {
    setEditingEducation(null);
    setSheetOpen(true);
  }

  function openEditSheet(item: Education) {
    setEditingEducation(item);
    setSheetOpen(true);
  }

  function handleSheetOpenChange(open: boolean) {
    setSheetOpen(open);
    if (!open) {
      setEditingEducation(null);
    }
  }

  async function handleSubmit(data: NewEducation) {
    if (editingEducation) {
      await updateEducation(editingEducation.id, data);
      return;
    }

    await addEducation(data);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Education"
        description="Your academic background and qualifications. Drag to reorder."
      >
        <Button onClick={openAddSheet}>
          <Plus className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      </PageHeader>

      {isLoaded && education.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <p className="text-muted-foreground">
              No education added yet. Add your first qualification to get started.
            </p>
            <Button onClick={openAddSheet}>
              <Plus className="mr-2 h-4 w-4" />
              Add Education
            </Button>
          </CardContent>
        </Card>
      ) : (
        <EducationGrid
          education={education}
          onEdit={openEditSheet}
          onReorder={reorderEducation}
          onRemove={(item) => {
            confirm({
              title: "Delete education entry?",
              description: confirmDeleteDescription(
                item.degree || item.institution || "this entry"
              ),
              confirmLabel: "Delete",
              variant: "destructive",
              onConfirm: () => removeEducation(item.id),
            });
          }}
        />
      )}

      {confirmDialog}

      <EducationFormSheet
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
        education={editingEducation}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
