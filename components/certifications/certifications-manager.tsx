"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { CertificationFormSheet } from "@/components/certifications/certification-form-sheet";
import { CertificationsGrid } from "@/components/certifications/certifications-grid";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCertifications } from "@/hooks/use-certifications";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { confirmDeleteDescription } from "@/lib/confirm-dialog-copy";
import type { NewCertification } from "@/hooks/use-certifications";
import type { Certification } from "@/types";

export function CertificationsManager() {
  const {
    certifications,
    isLoaded,
    addCertification,
    updateCertification,
    removeCertification,
    reorderCertification,
  } = useCertifications();
  const { confirm, confirmDialog } = useConfirmDialog();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingCertification, setEditingCertification] =
    useState<Certification | null>(null);

  function openAddSheet() {
    setEditingCertification(null);
    setSheetOpen(true);
  }

  function openEditSheet(certification: Certification) {
    setEditingCertification(certification);
    setSheetOpen(true);
  }

  function handleSheetOpenChange(open: boolean) {
    setSheetOpen(open);
    if (!open) {
      setEditingCertification(null);
    }
  }

  async function handleSubmit(data: NewCertification) {
    if (editingCertification) {
      await updateCertification(editingCertification.id, data);
      return;
    }

    await addCertification(data);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Certifications"
        description="Professional certifications and credentials. Drag to reorder."
      >
        <Button onClick={openAddSheet}>
          <Plus className="mr-2 h-4 w-4" />
          Add Certification
        </Button>
      </PageHeader>

      {isLoaded && certifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <p className="text-muted-foreground">
              No certifications yet. Add your first credential to get started.
            </p>
            <Button onClick={openAddSheet}>
              <Plus className="mr-2 h-4 w-4" />
              Add Certification
            </Button>
          </CardContent>
        </Card>
      ) : (
        <CertificationsGrid
          certifications={certifications}
          onEdit={openEditSheet}
          onReorder={reorderCertification}
          onRemove={(certification) => {
            confirm({
              title: "Delete certification?",
              description: confirmDeleteDescription(
                certification.name || "this certification"
              ),
              confirmLabel: "Delete",
              variant: "destructive",
              onConfirm: () => removeCertification(certification.id),
            });
          }}
        />
      )}

      {confirmDialog}

      <CertificationFormSheet
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
        certification={editingCertification}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
