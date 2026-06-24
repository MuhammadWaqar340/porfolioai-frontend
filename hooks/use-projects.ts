"use client";

import { useCallback } from "react";
import { emptyProjects } from "@/lib/empty-defaults";
import { mapProject, mapProjectToApi } from "@/lib/api/mappers";
import type { Project } from "@/types";
import {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectsQuery,
  useReorderProjectsMutation,
  useUpdateProjectMutation,
} from "@/store/api/portfolioApi";
import { useIsAuthenticated } from "@/store/hooks";
import { useOptionalDemoPortfolio } from "@/contexts/portfolio-demo-context";

export type NewProject = Omit<Project, "id">;

export function useProjects() {
  const demo = useOptionalDemoPortfolio();
  const isAuthenticated = useIsAuthenticated();
  const { data, isLoading } = useGetProjectsQuery(undefined, {
    skip: !isAuthenticated || !!demo,
  });
  const [createMutation] = useCreateProjectMutation();
  const [updateMutation] = useUpdateProjectMutation();
  const [deleteMutation] = useDeleteProjectMutation();
  const [reorderMutation] = useReorderProjectsMutation();

  const projects: Project[] = demo
    ? demo.projects
    : data
      ? data.map(mapProject)
      : emptyProjects;
  const isLoaded = demo ? true : !isLoading;

  const addProject = useCallback(
    async (project: NewProject) => {
      const result = await createMutation(mapProjectToApi(project)).unwrap();
      return mapProject(result);
    },
    [createMutation]
  );

  const updateProject = useCallback(
    async (projectId: string, updates: NewProject) => {
      const result = await updateMutation({
        id: projectId,
        data: mapProjectToApi(updates),
      }).unwrap();
      return mapProject(result);
    },
    [updateMutation]
  );

  const removeProject = useCallback(
    async (projectId: string) => {
      await deleteMutation(projectId).unwrap();
    },
    [deleteMutation]
  );

  const reorderProject = useCallback(
    async (activeId: string, overId: string) => {
      if (!data || activeId === overId) return;
      const ids = [...data]
        .sort((a, b) => a.display_order - b.display_order)
        .map((p) => p.id);
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
    projects,
    isLoaded,
    addProject,
    updateProject,
    removeProject,
    reorderProject,
  };
}
