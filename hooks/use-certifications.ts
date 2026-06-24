"use client";

import { useCallback } from "react";
import { emptyCertifications } from "@/lib/empty-defaults";
import { mapCertification, mapCertificationToApi } from "@/lib/api/mappers";
import type { Certification } from "@/types";
import {
  useCreateCertificationMutation,
  useDeleteCertificationMutation,
  useGetCertificationsQuery,
  useReorderCertificationsMutation,
  useUpdateCertificationMutation,
} from "@/store/api/portfolioApi";
import { useIsAuthenticated } from "@/store/hooks";
import { useOptionalDemoPortfolio } from "@/contexts/portfolio-demo-context";

export type NewCertification = Omit<Certification, "id">;

export function useCertifications() {
  const demo = useOptionalDemoPortfolio();
  const isAuthenticated = useIsAuthenticated();
  const { data, isLoading } = useGetCertificationsQuery(undefined, {
    skip: !isAuthenticated || !!demo,
  });
  const [createMutation] = useCreateCertificationMutation();
  const [updateMutation] = useUpdateCertificationMutation();
  const [deleteMutation] = useDeleteCertificationMutation();
  const [reorderMutation] = useReorderCertificationsMutation();

  const certifications: Certification[] = demo
    ? demo.certifications
    : data
      ? data.map(mapCertification)
      : emptyCertifications;
  const isLoaded = demo ? true : !isLoading;

  const addCertification = useCallback(
    async (item: NewCertification) => {
      const result = await createMutation(mapCertificationToApi(item)).unwrap();
      return mapCertification(result);
    },
    [createMutation]
  );

  const updateCertification = useCallback(
    async (certificationId: string, updates: NewCertification) => {
      const result = await updateMutation({
        id: certificationId,
        data: mapCertificationToApi(updates),
      }).unwrap();
      return mapCertification(result);
    },
    [updateMutation]
  );

  const removeCertification = useCallback(
    async (certificationId: string) => {
      await deleteMutation(certificationId).unwrap();
    },
    [deleteMutation]
  );

  const reorderCertification = useCallback(
    async (activeId: string, overId: string) => {
      if (!data || activeId === overId) return;
      const ids = [...data]
        .sort((a, b) => a.display_order - b.display_order)
        .map((c) => c.id);
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
    certifications,
    isLoaded,
    addCertification,
    updateCertification,
    removeCertification,
    reorderCertification,
  };
}
