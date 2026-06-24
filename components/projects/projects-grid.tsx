"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/cards/project-card";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

interface ProjectsGridProps {
  projects: Project[];
  className?: string;
  onEdit?: (project: Project) => void;
  onRemove?: (project: Project) => void;
  onReorder?: (activeId: string, overId: string) => void;
}

export function ProjectsGrid({
  projects,
  className,
  onEdit,
  onRemove,
  onReorder,
}: ProjectsGridProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  function handleDragStart(event: React.DragEvent, projectId: string) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", projectId);
    setDraggedId(projectId);
  }

  function handleDragEnd() {
    setDraggedId(null);
    setDragOverId(null);
  }

  function handleDragOver(event: React.DragEvent, projectId: string) {
    event.preventDefault();
    if (draggedId && draggedId !== projectId) {
      setDragOverId(projectId);
    }
  }

  function handleDrop(event: React.DragEvent, projectId: string) {
    event.preventDefault();
    if (draggedId && draggedId !== projectId) {
      onReorder?.(draggedId, projectId);
    }
    handleDragEnd();
  }

  return (
    <div
      className={cn(
        "grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {projects.map((project) => (
        <div
          key={project.id}
          className={cn(
            "h-full",
            draggedId === project.id && "opacity-50",
            dragOverId === project.id && "rounded-xl ring-2 ring-primary/30"
          )}
          onDragOver={(event) => handleDragOver(event, project.id)}
          onDragLeave={() => setDragOverId(null)}
          onDrop={(event) => handleDrop(event, project.id)}
        >
          <ProjectCard
            project={project}
            onEdit={onEdit}
            onRemove={onRemove}
            onDragStart={
              onReorder
                ? (event) => handleDragStart(event, project.id)
                : undefined
            }
            onDragEnd={onReorder ? handleDragEnd : undefined}
          />
        </div>
      ))}
    </div>
  );
}
