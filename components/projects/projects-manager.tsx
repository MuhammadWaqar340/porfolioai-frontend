"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { ProjectFormSheet } from "@/components/projects/project-form-sheet";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProjects } from "@/hooks/use-projects";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { confirmDeleteDescription } from "@/lib/confirm-dialog-copy";
import type { NewProject } from "@/hooks/use-projects";
import type { Project } from "@/types";

export function ProjectsManager() {
  const {
    projects,
    isLoaded,
    addProject,
    updateProject,
    removeProject,
    reorderProject,
  } = useProjects();
  const { confirm, confirmDialog } = useConfirmDialog();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  function openAddSheet() {
    setEditingProject(null);
    setSheetOpen(true);
  }

  function openEditSheet(project: Project) {
    setEditingProject(project);
    setSheetOpen(true);
  }

  function handleSheetOpenChange(open: boolean) {
    setSheetOpen(open);
    if (!open) {
      setEditingProject(null);
    }
  }

  async function handleSubmit(projectData: NewProject) {
    if (editingProject) {
      await updateProject(editingProject.id, projectData);
      return;
    }

    await addProject(projectData);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Projects"
        description="Showcase your best work and side projects. Drag to reorder."
      >
        <Button onClick={openAddSheet}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </PageHeader>

      {isLoaded && projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <p className="text-muted-foreground">
              No projects yet. Add your first project to showcase your work.
            </p>
            <Button onClick={openAddSheet}>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ProjectsGrid
          projects={projects}
          onEdit={openEditSheet}
          onReorder={reorderProject}
          onRemove={(project) => {
            confirm({
              title: "Delete project?",
              description: confirmDeleteDescription(project.title),
              confirmLabel: "Delete",
              variant: "destructive",
              onConfirm: () => removeProject(project.id),
            });
          }}
        />
      )}

      {confirmDialog}

      <ProjectFormSheet
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
        project={editingProject}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
