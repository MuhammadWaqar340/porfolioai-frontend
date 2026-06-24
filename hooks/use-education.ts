"use client";

import { useCallback } from "react";
import { emptyEducation } from "@/lib/empty-defaults";
import { mapEducation, mapEducationToApi } from "@/lib/api/mappers";
import type { Education } from "@/types";
import {
  useCreateEducationMutation,
  useDeleteEducationMutation,
  useGetEducationQuery,
  useReorderEducationMutation,
  useUpdateEducationMutation,
} from "@/store/api/portfolioApi";
import { useIsAuthenticated } from "@/store/hooks";
import { useOptionalDemoPortfolio } from "@/contexts/portfolio-demo-context";

export type NewEducation = Omit<Education, "id">;

export function useEducation() {
  const demo = useOptionalDemoPortfolio();
  const isAuthenticated = useIsAuthenticated();
  const { data, isLoading } = useGetEducationQuery(undefined, {
    skip: !isAuthenticated || !!demo,
  });
  const [createMutation] = useCreateEducationMutation();
  const [updateMutation] = useUpdateEducationMutation();
  const [deleteMutation] = useDeleteEducationMutation();
  const [reorderMutation] = useReorderEducationMutation();

  const education: Education[] = demo
    ? demo.education
    : data
      ? data.map(mapEducation)
      : emptyEducation;
  const isLoaded = demo ? true : !isLoading;

  const addEducation = useCallback(
    async (item: NewEducation) => {
      const result = await createMutation(mapEducationToApi(item)).unwrap();
      return mapEducation(result);
    },
    [createMutation]
  );

  const updateEducation = useCallback(
    async (educationId: string, updates: NewEducation) => {
      const result = await updateMutation({
        id: educationId,
        data: mapEducationToApi(updates),
      }).unwrap();
      return mapEducation(result);
    },
    [updateMutation]
  );

  const removeEducation = useCallback(
    async (educationId: string) => {
      await deleteMutation(educationId).unwrap();
    },
    [deleteMutation]
  );

  const reorderEducation = useCallback(
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
    education,
    isLoaded,
    addEducation,
    updateEducation,
    removeEducation,
    reorderEducation,
  };
}
