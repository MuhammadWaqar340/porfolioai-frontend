"use client";

import { useState } from "react";
import { EducationCard } from "@/components/cards/education-card";
import type { Education } from "@/types";
import { cn } from "@/lib/utils";

interface EducationGridProps {
  education: Education[];
  className?: string;
  onEdit?: (item: Education) => void;
  onRemove?: (item: Education) => void;
  onReorder?: (activeId: string, overId: string) => void;
}

export function EducationGrid({
  education,
  className,
  onEdit,
  onRemove,
  onReorder,
}: EducationGridProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  function handleDragStart(event: React.DragEvent, educationId: string) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", educationId);
    setDraggedId(educationId);
  }

  function handleDragEnd() {
    setDraggedId(null);
    setDragOverId(null);
  }

  function handleDragOver(event: React.DragEvent, educationId: string) {
    event.preventDefault();
    if (draggedId && draggedId !== educationId) {
      setDragOverId(educationId);
    }
  }

  function handleDrop(event: React.DragEvent, educationId: string) {
    event.preventDefault();
    if (draggedId && draggedId !== educationId) {
      onReorder?.(draggedId, educationId);
    }
    handleDragEnd();
  }

  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {education.map((item) => (
        <div
          key={item.id}
          className={cn(
            "h-full",
            draggedId === item.id && "opacity-50",
            dragOverId === item.id && "rounded-xl ring-2 ring-primary/30"
          )}
          onDragOver={(event) => handleDragOver(event, item.id)}
          onDragLeave={() => setDragOverId(null)}
          onDrop={(event) => handleDrop(event, item.id)}
        >
          <EducationCard
            education={item}
            onEdit={onEdit}
            onRemove={onRemove}
            onDragStart={
              onReorder
                ? (event) => handleDragStart(event, item.id)
                : undefined
            }
            onDragEnd={onReorder ? handleDragEnd : undefined}
          />
        </div>
      ))}
    </div>
  );
}
