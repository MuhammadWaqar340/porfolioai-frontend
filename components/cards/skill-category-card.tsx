"use client";

import { Check, Layers, Sparkles, X } from "lucide-react";
import { SkillBadge } from "@/components/cards/skill-badge";
import { CardOverlayActions } from "@/components/cards/card-overlay-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Skill, SkillCategory } from "@/types";
import { cn } from "@/lib/utils";

interface SkillCategoryCardProps {
  category: SkillCategory;
  className?: string;
  isDragged?: boolean;
  isDragOver?: boolean;
  isEditing?: boolean;
  editingName?: string;
  isBusy?: boolean;
  draggedSkillId?: string | null;
  dragOverSkillId?: string | null;
  onEditingNameChange?: (value: string) => void;
  onSaveEdit?: () => void;
  onCancelEdit?: () => void;
  onCategoryDragStart?: (event: React.DragEvent) => void;
  onCategoryDragEnd?: () => void;
  onCategoryDragOver?: (event: React.DragEvent) => void;
  onCategoryDragLeave?: () => void;
  onCategoryDrop?: (event: React.DragEvent) => void;
  onRename?: () => void;
  onDelete?: () => void;
  onRemoveSkill?: (skill: Skill) => void;
  onSkillDragStart?: (event: React.DragEvent, skillId: string) => void;
  onSkillDragEnd?: () => void;
  onSkillDragOver?: (event: React.DragEvent, skillId: string) => void;
  onSkillDragLeave?: () => void;
  onSkillDrop?: (event: React.DragEvent, skillId: string) => void;
}

export function SkillCategoryCard({
  category,
  className,
  isDragged,
  isDragOver,
  isEditing,
  editingName = "",
  isBusy,
  draggedSkillId,
  dragOverSkillId,
  onEditingNameChange,
  onSaveEdit,
  onCancelEdit,
  onCategoryDragStart,
  onCategoryDragEnd,
  onCategoryDragOver,
  onCategoryDragLeave,
  onCategoryDrop,
  onRename,
  onDelete,
  onRemoveSkill,
  onSkillDragStart,
  onSkillDragEnd,
  onSkillDragOver,
  onSkillDragLeave,
  onSkillDrop,
}: SkillCategoryCardProps) {
  const skillCount = category.skills.length;

  return (
    <Card
      className={cn(
        "group flex h-full flex-col overflow-hidden border-border/80 pb-0 transition-all duration-200",
        "hover:border-primary/20 hover:shadow-md",
        isDragged && "opacity-50",
        isDragOver && "ring-2 ring-primary/30",
        className
      )}
      onDragOver={onCategoryDragOver}
      onDragLeave={onCategoryDragLeave}
      onDrop={onCategoryDrop}
    >
      <CardHeader className="relative space-y-2 pb-2">
        <CardOverlayActions
          dragLabel={`Reorder ${category.name} category`}
          editLabel={`Rename ${category.name}`}
          removeLabel={`Delete ${category.name}`}
          onDragStart={onCategoryDragStart}
          onDragEnd={onCategoryDragEnd}
          onEdit={onRename}
          onRemove={onDelete}
        />
        {isEditing ? (
          <div className="flex min-w-0 items-center gap-2 pr-16">
            <Input
              value={editingName}
              onChange={(event) => onEditingNameChange?.(event.target.value)}
              className="h-9"
              disabled={isBusy}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onSaveEdit?.();
                }
                if (event.key === "Escape") {
                  onCancelEdit?.();
                }
              }}
            />
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              className="shrink-0"
              aria-label="Save category name"
              disabled={isBusy}
              onClick={() => onSaveEdit?.()}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              className="shrink-0"
              aria-label="Cancel editing category"
              disabled={isBusy}
              onClick={() => onCancelEdit?.()}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <h3 className="line-clamp-2 pr-20 text-base font-semibold leading-snug tracking-tight">
              {category.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Layers className="h-4 w-4 shrink-0 text-primary/70" />
              <span>Skill category</span>
            </div>
          </>
        )}
      </CardHeader>

      <CardContent className="flex-1 pt-0">
        {skillCount === 0 ? (
          <div className="rounded-lg border border-dashed border-border/80 bg-muted/20 px-4 py-6 text-center">
            <Sparkles className="mx-auto mb-2 h-5 w-5 text-muted-foreground/60" />
            <p className="text-sm text-muted-foreground">No skills in this category yet.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill) => (
              <div
                key={skill.id}
                className={cn(
                  "max-w-full rounded-lg",
                  draggedSkillId === skill.id && "opacity-50",
                  dragOverSkillId === skill.id && "ring-2 ring-primary/30"
                )}
                onDragOver={(event) => onSkillDragOver?.(event, skill.id)}
                onDragLeave={() => onSkillDragLeave?.()}
                onDrop={(event) => onSkillDrop?.(event, skill.id)}
              >
                <SkillBadge
                  name={skill.name}
                  onRemove={
                    onRemoveSkill ? () => onRemoveSkill(skill) : undefined
                  }
                  onDragStart={
                    onSkillDragStart
                      ? (event) => onSkillDragStart(event, skill.id)
                      : undefined
                  }
                  onDragEnd={onSkillDragEnd}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="mt-auto border-t bg-muted/20 px-4 py-3">
        <Badge
          variant="outline"
          className="gap-1.5 border-primary/30 bg-primary/5 font-normal text-foreground"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          {skillCount} skill{skillCount === 1 ? "" : "s"}
        </Badge>
      </CardFooter>
    </Card>
  );
}
