"use client";

import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const overlayVisibility =
  "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100";

interface CardOverlayActionsProps {
  dragLabel: string;
  editLabel: string;
  removeLabel: string;
  onDragStart?: (event: React.DragEvent) => void;
  onDragEnd?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
}

export function CardOverlayActions({
  dragLabel,
  editLabel,
  removeLabel,
  onDragStart,
  onDragEnd,
  onEdit,
  onRemove,
}: CardOverlayActionsProps) {
  const hasActions = Boolean(onEdit || onRemove);

  return (
    <>
      {onDragStart ? (
        <button
          type="button"
          draggable
          className={cn(
            "absolute left-2 top-2 z-10 flex h-8 w-8 cursor-grab items-center justify-center rounded-md",
            "border border-white/20 bg-black/40 text-white backdrop-blur-sm",
            "transition-opacity active:cursor-grabbing",
            overlayVisibility
          )}
          aria-label={dragLabel}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      ) : null}

      {hasActions ? (
        <div
          className={cn(
            "absolute right-2 top-2 z-10 flex items-center gap-1",
            "transition-opacity",
            overlayVisibility
          )}
        >
          {onEdit ? (
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              className="h-8 w-8 border border-white/20 bg-black/40 text-white backdrop-blur-sm hover:bg-black/55 hover:text-white"
              onClick={onEdit}
              aria-label={editLabel}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          ) : null}
          {onRemove ? (
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              className="h-8 w-8 border border-white/20 bg-black/40 text-white backdrop-blur-sm hover:bg-destructive/90 hover:text-white"
              onClick={onRemove}
              aria-label={removeLabel}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

export function CardHeroPattern({ className }: { className?: string }) {
  return (
    <div
      className={cn("absolute inset-0 opacity-30", className)}
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
        backgroundSize: "20px 20px",
      }}
      aria-hidden
    />
  );
}
