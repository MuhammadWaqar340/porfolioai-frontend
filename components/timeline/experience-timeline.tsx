"use client";

import { useState } from "react";
import { ExperienceCard } from "@/components/cards/experience-card";
import type { Experience } from "@/types";
import { cn } from "@/lib/utils";

interface ExperienceTimelineProps {
  experiences: Experience[];
  className?: string;
  onEdit?: (experience: Experience) => void;
  onRemove?: (experience: Experience) => void;
  onReorder?: (activeId: string, overId: string) => void;
}

export function ExperienceTimeline({
  experiences,
  className,
  onEdit,
  onRemove,
  onReorder,
}: ExperienceTimelineProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  function handleDragStart(event: React.DragEvent, experienceId: string) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", experienceId);
    setDraggedId(experienceId);
  }

  function handleDragEnd() {
    setDraggedId(null);
    setDragOverId(null);
  }

  function handleDragOver(event: React.DragEvent, experienceId: string) {
    event.preventDefault();
    if (draggedId && draggedId !== experienceId) {
      setDragOverId(experienceId);
    }
  }

  function handleDrop(event: React.DragEvent, experienceId: string) {
    event.preventDefault();
    if (draggedId && draggedId !== experienceId) {
      onReorder?.(draggedId, experienceId);
    }
    handleDragEnd();
  }

  return (
    <div className={cn("relative space-y-0", className)}>
      {experiences.map((experience, index) => (
        <div
          key={experience.id}
          className={cn(
            "relative flex gap-4 pb-10 last:pb-0 sm:gap-6",
            draggedId === experience.id && "opacity-50",
            dragOverId === experience.id && "rounded-xl ring-2 ring-primary/30"
          )}
          onDragOver={(event) => handleDragOver(event, experience.id)}
          onDragLeave={() => setDragOverId(null)}
          onDrop={(event) => handleDrop(event, experience.id)}
        >
          {index < experiences.length - 1 ? (
            <div className="absolute left-[11px] top-7 h-[calc(100%-0.5rem)] w-px bg-gradient-to-b from-primary/50 via-border to-border" />
          ) : null}

          <div className="relative z-10 mt-5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background shadow-sm">
            <div className="h-2 w-2 rounded-full bg-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <ExperienceCard
              experience={experience}
              onEdit={onEdit}
              onRemove={onRemove}
              onDragStart={
                onReorder
                  ? (event) => handleDragStart(event, experience.id)
                  : undefined
              }
              onDragEnd={onReorder ? handleDragEnd : undefined}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
