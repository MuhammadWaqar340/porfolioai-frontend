"use client";

import { GripVertical, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillBadgeProps {
  name: string;
  className?: string;
  onRemove?: () => void;
  onDragStart?: (event: React.DragEvent) => void;
  onDragEnd?: () => void;
}

const actionVisibility =
  "opacity-100 sm:opacity-0 sm:group-hover/skill:opacity-100 sm:group-focus-within/skill:opacity-100";

export function SkillBadge({
  name,
  className,
  onRemove,
  onDragStart,
  onDragEnd,
}: SkillBadgeProps) {
  const interactive = Boolean(onRemove || onDragStart);

  if (!interactive) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-lg border border-border/80 bg-background px-3 py-1.5 text-sm font-medium shadow-sm",
          className
        )}
      >
        {name}
      </span>
    );
  }

  return (
    <div
      className={cn(
        "group/skill inline-flex max-w-full items-center overflow-hidden rounded-lg border border-border/80 bg-background shadow-sm transition-all duration-200",
        "hover:border-primary/25 hover:shadow-md",
        className
      )}
    >
      {onDragStart ? (
        <button
          type="button"
          draggable
          className={cn(
            "flex h-8 w-7 shrink-0 cursor-grab items-center justify-center border-r border-border/60 bg-muted/50 text-muted-foreground transition-opacity active:cursor-grabbing",
            "hover:bg-muted hover:text-foreground",
            actionVisibility
          )}
          aria-label={`Reorder ${name}`}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
      ) : null}

      <span className="truncate px-2.5 py-1.5 text-sm font-medium">{name}</span>

      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className={cn(
            "mr-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-opacity",
            "hover:bg-destructive/10 hover:text-destructive",
            actionVisibility
          )}
          aria-label={`Remove ${name}`}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}
