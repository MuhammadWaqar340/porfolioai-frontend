"use client";

import { useCallback } from "react";
import { emptyExperiences } from "@/lib/empty-defaults";
import { mapExperience, mapExperienceToApi } from "@/lib/api/mappers";
import type { Experience } from "@/types";
import {
  useCreateExperienceMutation,
  useDeleteExperienceMutation,
  useGetExperiencesQuery,
  useReorderExperiencesMutation,
  useUpdateExperienceMutation,
} from "@/store/api/portfolioApi";
import { useIsAuthenticated } from "@/store/hooks";
import { useOptionalDemoPortfolio } from "@/contexts/portfolio-demo-context";

export type NewExperience = Omit<Experience, "id">;

export function useExperience() {
  const demo = useOptionalDemoPortfolio();
  const isAuthenticated = useIsAuthenticated();
  const { data, isLoading } = useGetExperiencesQuery(undefined, {
    skip: !isAuthenticated || !!demo,
  });
  const [createMutation] = useCreateExperienceMutation();
  const [updateMutation] = useUpdateExperienceMutation();
  const [deleteMutation] = useDeleteExperienceMutation();
  const [reorderMutation] = useReorderExperiencesMutation();

  const experiences: Experience[] = demo
    ? demo.experiences
    : data
      ? data.map(mapExperience)
      : emptyExperiences;
  const isLoaded = demo ? true : !isLoading;

  const addExperience = useCallback(
    async (experience: NewExperience) => {
      const result = await createMutation(
        mapExperienceToApi(experience)
      ).unwrap();
      return mapExperience(result);
    },
    [createMutation]
  );

  const updateExperience = useCallback(
    async (experienceId: string, updates: NewExperience) => {
      const result = await updateMutation({
        id: experienceId,
        data: mapExperienceToApi(updates),
      }).unwrap();
      return mapExperience(result);
    },
    [updateMutation]
  );

  const removeExperience = useCallback(
    async (experienceId: string) => {
      await deleteMutation(experienceId).unwrap();
    },
    [deleteMutation]
  );

  const reorderExperience = useCallback(
    async (activeId: string, overId: string) => {
      if (!data || activeId === overId) return;
      const ids = [...data]
        .sort((a, b) => a.display_order - b.display_order)
        .map((e) => e.id);
      const from = ids.indexOf(activeId);
      const to = ids.indexOf(overId);
      if (from === -1 || to === -1) return;
      const [moved] = ids.splice(from, 1);
      ids.splice(to, 0, moved);
      await reorderMutation(ids).unwrap();
    },
    [data, reorderMutation]
  );

  return {
    experiences,
    isLoaded,
    addExperience,
    updateExperience,
    removeExperience,
    reorderExperience,
  };
}
