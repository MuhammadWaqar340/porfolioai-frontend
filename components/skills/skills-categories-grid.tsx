"use client";

import { useState } from "react";
import { SkillCategoryCard } from "@/components/cards/skill-category-card";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import type { Skill, SkillCategory } from "@/types";
import { cn } from "@/lib/utils";

interface SkillsCategoriesGridProps {
  categories: SkillCategory[];
  className?: string;
  onRemoveSkill?: (skill: Skill) => void;
  onReorderCategory?: (activeName: string, overName: string) => void;
  onReorderSkill?: (
    categoryName: string,
    activeSkillId: string,
    overSkillId: string
  ) => void;
  onRenameCategory?: (categoryId: string, name: string) => Promise<void>;
  onDeleteCategory?: (category: SkillCategory) => Promise<void>;
}

export function SkillsCategoriesGrid({
  categories,
  className,
  onRemoveSkill,
  onReorderCategory,
  onReorderSkill,
  onRenameCategory,
  onDeleteCategory,
}: SkillsCategoriesGridProps) {
  const { confirm, confirmDialog } = useConfirmDialog();
  const [draggedCategory, setDraggedCategory] = useState<string | null>(null);
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null);
  const [draggedSkill, setDraggedSkill] = useState<{
    categoryName: string;
    skillId: string;
  } | null>(null);
  const [dragOverSkillId, setDragOverSkillId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [busyCategoryId, setBusyCategoryId] = useState<string | null>(null);

  function handleCategoryDragStart(
    event: React.DragEvent,
    categoryName: string
  ) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", `category:${categoryName}`);
    setDraggedCategory(categoryName);
    setDraggedSkill(null);
  }

  function handleSkillDragStart(
    event: React.DragEvent,
    categoryName: string,
    skillId: string
  ) {
    event.stopPropagation();
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", `skill:${categoryName}:${skillId}`);
    setDraggedSkill({ categoryName, skillId });
    setDraggedCategory(null);
  }

  function handleDragEnd() {
    setDraggedCategory(null);
    setDragOverCategory(null);
    setDraggedSkill(null);
    setDragOverSkillId(null);
  }

  function startEditing(category: SkillCategory) {
    setEditingCategoryId(category.id);
    setEditingName(category.name);
  }

  function cancelEditing() {
    setEditingCategoryId(null);
    setEditingName("");
  }

  async function saveCategoryName(categoryId: string) {
    const trimmed = editingName.trim();
    if (!trimmed || !onRenameCategory) {
      cancelEditing();
      return;
    }

    setBusyCategoryId(categoryId);
    try {
      await onRenameCategory(categoryId, trimmed);
      cancelEditing();
    } finally {
      setBusyCategoryId(null);
    }
  }

  function requestDeleteCategory(category: SkillCategory) {
    if (!onDeleteCategory) return;

    const skillCount = category.skills.length;

    confirm({
      title:
        skillCount > 0 ? "Delete category and skills?" : "Delete category?",
      description:
        skillCount > 0 ? (
          <>
            Delete{" "}
            <span className="font-medium text-foreground">
              &ldquo;{category.name}&rdquo;
            </span>{" "}
            and all {skillCount} skill{skillCount === 1 ? "" : "s"} in it? This
            cannot be undone.
          </>
        ) : (
          <>
            Delete the{" "}
            <span className="font-medium text-foreground">
              &ldquo;{category.name}&rdquo;
            </span>{" "}
            category? This cannot be undone.
          </>
        ),
      confirmLabel: "Delete",
      variant: "destructive",
      onConfirm: async () => {
        setBusyCategoryId(category.id);
        try {
          await onDeleteCategory(category);
          if (editingCategoryId === category.id) {
            cancelEditing();
          }
        } finally {
          setBusyCategoryId(null);
        }
      },
    });
  }

  return (
    <div className={cn("grid gap-6 sm:grid-cols-2", className)}>
      {categories.map((category) => (
        <SkillCategoryCard
          key={category.id}
          category={category}
          isDragged={draggedCategory === category.name}
          isDragOver={
            dragOverCategory === category.name && !draggedSkill
          }
          isEditing={editingCategoryId === category.id}
          editingName={editingName}
          isBusy={busyCategoryId === category.id}
          draggedSkillId={draggedSkill?.skillId ?? null}
          dragOverSkillId={dragOverSkillId}
          onEditingNameChange={setEditingName}
          onSaveEdit={() => void saveCategoryName(category.id)}
          onCancelEdit={cancelEditing}
          onCategoryDragStart={
            onReorderCategory
              ? (event) => handleCategoryDragStart(event, category.name)
              : undefined
          }
          onCategoryDragEnd={onReorderCategory ? handleDragEnd : undefined}
          onCategoryDragOver={(event) => {
            if (!draggedCategory || draggedCategory === category.name) return;
            event.preventDefault();
            setDragOverCategory(category.name);
          }}
          onCategoryDragLeave={() => setDragOverCategory(null)}
          onCategoryDrop={(event) => {
            event.preventDefault();
            if (draggedCategory && draggedCategory !== category.name) {
              onReorderCategory?.(draggedCategory, category.name);
            }
            handleDragEnd();
          }}
          onRename={
            onRenameCategory ? () => startEditing(category) : undefined
          }
          onDelete={
            onDeleteCategory
              ? () => requestDeleteCategory(category)
              : undefined
          }
          onRemoveSkill={onRemoveSkill}
          onSkillDragStart={
            onReorderSkill
              ? (event, skillId) =>
                  handleSkillDragStart(event, category.name, skillId)
              : undefined
          }
          onSkillDragEnd={onReorderSkill ? handleDragEnd : undefined}
          onSkillDragOver={(event, skillId) => {
            if (
              !draggedSkill ||
              draggedSkill.categoryName !== category.name ||
              draggedSkill.skillId === skillId
            ) {
              return;
            }
            event.preventDefault();
            event.stopPropagation();
            setDragOverSkillId(skillId);
          }}
          onSkillDragLeave={() => setDragOverSkillId(null)}
          onSkillDrop={(event, skillId) => {
            event.preventDefault();
            event.stopPropagation();
            if (
              draggedSkill &&
              draggedSkill.categoryName === category.name &&
              draggedSkill.skillId !== skillId
            ) {
              onReorderSkill?.(
                category.name,
                draggedSkill.skillId,
                skillId
              );
            }
            handleDragEnd();
          }}
        />
      ))}
      {confirmDialog}
    </div>
  );
}
