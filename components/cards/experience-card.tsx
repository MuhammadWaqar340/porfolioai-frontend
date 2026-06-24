"use client";

import { CalendarRange } from "lucide-react";
import { CardOverlayActions } from "@/components/cards/card-overlay-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatExperienceDuration } from "@/lib/experience-utils";
import type { Experience } from "@/types";
import { cn } from "@/lib/utils";

interface ExperienceCardProps {
  experience: Experience;
  className?: string;
  onEdit?: (experience: Experience) => void;
  onRemove?: (experience: Experience) => void;
  onDragStart?: (event: React.DragEvent) => void;
  onDragEnd?: () => void;
}

function formatDescriptionPreview(description: string) {
  return description
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function ExperienceCard({
  experience,
  className,
  onEdit,
  onRemove,
  onDragStart,
  onDragEnd,
}: ExperienceCardProps) {
  const description = formatDescriptionPreview(experience.description);

  return (
    <Card
      className={cn(
        "group flex flex-col overflow-hidden border-border/80 transition-all duration-200",
        "hover:border-primary/20 hover:shadow-md",
        className
      )}
    >
      <CardHeader className="relative space-y-2 pb-2">
        <CardOverlayActions
          dragLabel={`Reorder ${experience.position}`}
          editLabel={`Edit ${experience.position}`}
          removeLabel={`Remove ${experience.position}`}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onEdit={onEdit ? () => onEdit(experience) : undefined}
          onRemove={onRemove ? () => onRemove(experience) : undefined}
        />
        <h3 className="line-clamp-2 pr-20 text-base font-semibold leading-snug tracking-tight">
          {experience.position}
        </h3>
        <p className="line-clamp-2 text-sm font-medium text-primary">
          {experience.company}
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Badge
            variant="outline"
            className="gap-1.5 border-primary/30 bg-primary/5 font-normal text-foreground"
          >
            <CalendarRange className="h-3.5 w-3.5 text-primary" />
            {formatExperienceDuration(experience)}
          </Badge>
          {experience.isPresent ? (
            <Badge className="bg-emerald-500/15 font-normal text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-400">
              Current role
            </Badge>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {description ? (
          <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : (
          <p className="text-sm italic text-muted-foreground">No description yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
