"use client";

import { useCallback } from "react";
import { emptySkills } from "@/lib/empty-defaults";
import { mapSkillCategories } from "@/lib/api/mappers";
import type { SkillCategory } from "@/types";
import {
  useAddSkillMutation,
  useBulkAddSkillsMutation,
  useDeleteSkillMutation,
  useDeleteSkillCategoryMutation,
  useGetSkillsQuery,
  useReorderSkillCategoriesMutation,
  useReorderSkillsMutation,
  useUpdateSkillCategoryMutation,
} from "@/store/api/portfolioApi";
import { useIsAuthenticated } from "@/store/hooks";
import { useOptionalDemoPortfolio } from "@/contexts/portfolio-demo-context";

export interface AddSkillsResult {
  added: string[];
  skipped: string[];
}

export function useSkills() {
  const demo = useOptionalDemoPortfolio();
  const isAuthenticated = useIsAuthenticated();
  const { data, isLoading } = useGetSkillsQuery(undefined, {
    skip: !isAuthenticated || !!demo,
  });
  const [addSkillMutation] = useAddSkillMutation();
  const [bulkAddMutation] = useBulkAddSkillsMutation();
  const [deleteSkillMutation] = useDeleteSkillMutation();
  const [reorderCategoriesMutation] = useReorderSkillCategoriesMutation();
  const [reorderSkillsMutation] = useReorderSkillsMutation();
  const [updateCategoryMutation] = useUpdateSkillCategoryMutation();
  const [deleteCategoryMutation] = useDeleteSkillCategoryMutation();

  const skills: SkillCategory[] = demo
    ? demo.skills
    : data
      ? mapSkillCategories(data)
      : emptySkills;
  const isLoaded = demo ? true : !isLoading;

  const addSkill = useCallback(
    async (name: string, category: string) => {
      try {
        await addSkillMutation({ name, category }).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [addSkillMutation]
  );

  const addSkills = useCallback(
    async (names: string[], category: string): Promise<AddSkillsResult> => {
      try {
        return await bulkAddMutation({ category, names }).unwrap();
      } catch {
        return { added: [], skipped: names };
      }
    },
    [bulkAddMutation]
  );

  const removeSkill = useCallback(
    async (skillId: string) => {
      await deleteSkillMutation(skillId).unwrap();
    },
    [deleteSkillMutation]
  );

  const reorderCategories = useCallback(
    async (activeCategoryName: string, overCategoryName: string) => {
      if (!data || activeCategoryName === overCategoryName) return;
      const active = data.find((c) => c.name === activeCategoryName);
      const over = data.find((c) => c.name === overCategoryName);
      if (!active || !over) return;

      const ids = [...data]
        .sort((a, b) => a.display_order - b.display_order)
        .map((c) => c.id);
      const from = ids.indexOf(active.id);
      const to = ids.indexOf(over.id);
      if (from === -1 || to === -1) return;
      const [moved] = ids.splice(from, 1);
      ids.splice(to, 0, moved);
      await reorderCategoriesMutation(ids).unwrap();
    },
    [data, reorderCategoriesMutation]
  );

  const reorderSkills = useCallback(
    async (categoryName: string, activeSkillId: string, overSkillId: string) => {
      if (!data || activeSkillId === overSkillId) return;
      const category = data.find((c) => c.name === categoryName);
      if (!category) return;

      const ids = [...category.skills]
        .sort((a, b) => a.display_order - b.display_order)
        .map((s) => s.id);
      const from = ids.indexOf(activeSkillId);
      const to = ids.indexOf(overSkillId);
      if (from === -1 || to === -1) return;
      const [moved] = ids.splice(from, 1);
      ids.splice(to, 0, moved);
      await reorderSkillsMutation({
        category_id: category.id,
        ordered_skill_ids: ids,
      }).unwrap();
    },
    [data, reorderSkillsMutation]
  );

  const renameCategory = useCallback(
    async (categoryId: string, name: string) => {
      await updateCategoryMutation({ categoryId, name }).unwrap();
    },
    [updateCategoryMutation]
  );

  const deleteCategory = useCallback(
    async (categoryId: string) => {
      await deleteCategoryMutation(categoryId).unwrap();
    },
    [deleteCategoryMutation]
  );

  return {
    skills,
    isLoaded,
    addSkill,
    addSkills,
    removeSkill,
    reorderCategories,
    reorderSkills,
    renameCategory,
    deleteCategory,
  };
}
