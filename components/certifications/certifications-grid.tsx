"use client";

import { useState } from "react";
import { CertificationCard } from "@/components/cards/certification-card";
import type { Certification } from "@/types";
import { cn } from "@/lib/utils";

interface CertificationsGridProps {
  certifications: Certification[];
  className?: string;
  onEdit?: (certification: Certification) => void;
  onRemove?: (certification: Certification) => void;
  onReorder?: (activeId: string, overId: string) => void;
}

export function CertificationsGrid({
  certifications,
  className,
  onEdit,
  onRemove,
  onReorder,
}: CertificationsGridProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  function handleDragStart(event: React.DragEvent, certificationId: string) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", certificationId);
    setDraggedId(certificationId);
  }

  function handleDragEnd() {
    setDraggedId(null);
    setDragOverId(null);
  }

  function handleDragOver(event: React.DragEvent, certificationId: string) {
    event.preventDefault();
    if (draggedId && draggedId !== certificationId) {
      setDragOverId(certificationId);
    }
  }

  function handleDrop(event: React.DragEvent, certificationId: string) {
    event.preventDefault();
    if (draggedId && draggedId !== certificationId) {
      onReorder?.(draggedId, certificationId);
    }
    handleDragEnd();
  }

  return (
    <div className={cn("grid gap-4 sm:grid-cols-2", className)}>
      {certifications.map((certification) => (
        <div
          key={certification.id}
          className={cn(
            "h-full",
            draggedId === certification.id && "opacity-50",
            dragOverId === certification.id && "rounded-xl ring-2 ring-primary/30"
          )}
          onDragOver={(event) => handleDragOver(event, certification.id)}
          onDragLeave={() => setDragOverId(null)}
          onDrop={(event) => handleDrop(event, certification.id)}
        >
          <CertificationCard
            certification={certification}
            onEdit={onEdit}
            onRemove={onRemove}
            onDragStart={
              onReorder
                ? (event) => handleDragStart(event, certification.id)
                : undefined
            }
            onDragEnd={onReorder ? handleDragEnd : undefined}
          />
        </div>
      ))}
    </div>
  );
}
