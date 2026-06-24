"use client";

import { CalendarRange, GraduationCap } from "lucide-react";
import { CardOverlayActions } from "@/components/cards/card-overlay-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatEducationYears } from "@/lib/education-utils";
import type { Education } from "@/types";
import { cn } from "@/lib/utils";

interface EducationCardProps {
  education: Education;
  className?: string;
  onEdit?: (education: Education) => void;
  onRemove?: (education: Education) => void;
  onDragStart?: (event: React.DragEvent) => void;
  onDragEnd?: () => void;
}

export function EducationCard({
  education,
  className,
  onEdit,
  onRemove,
  onDragStart,
  onDragEnd,
}: EducationCardProps) {
  return (
    <Card
      className={cn(
        "group flex h-full flex-col overflow-hidden border-border/80 pb-0 transition-all duration-200",
        "hover:border-primary/20 hover:shadow-md",
        className
      )}
    >
      <CardHeader className="relative space-y-2 pb-2">
        <CardOverlayActions
          dragLabel={`Reorder ${education.degree}`}
          editLabel={`Edit ${education.degree}`}
          removeLabel={`Remove ${education.degree}`}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onEdit={onEdit ? () => onEdit(education) : undefined}
          onRemove={onRemove ? () => onRemove(education) : undefined}
        />
        <h3 className="line-clamp-2 pr-20 text-base font-semibold leading-snug tracking-tight">
          {education.degree}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {education.institution}
        </p>
      </CardHeader>

      <CardContent className="flex-1 pt-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <GraduationCap className="h-4 w-4 shrink-0 text-primary/70" />
          <span>Academic program</span>
        </div>
      </CardContent>

      <CardFooter className="mt-auto border-t bg-muted/20 px-4 py-3">
        <Badge
          variant="outline"
          className="gap-1.5 border-primary/30 bg-primary/5 font-normal text-foreground"
        >
          <CalendarRange className="h-3.5 w-3.5 text-primary" />
          {formatEducationYears(education)}
        </Badge>
      </CardFooter>
    </Card>
  );
}
