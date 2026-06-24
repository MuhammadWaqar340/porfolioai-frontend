"use client";

import { useCallback, useMemo } from "react";
import { resolveAssetUrl } from "@/lib/api/asset-url";
import { emptyProfile } from "@/lib/empty-defaults";
import { mapProfile, mapProfileToApi } from "@/lib/api/mappers";
import type { Profile } from "@/types";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
} from "@/store/api/portfolioApi";
import { useIsAuthenticated } from "@/store/hooks";
import { useOptionalDemoPortfolio } from "@/contexts/portfolio-demo-context";

export function useProfile() {
  const demo = useOptionalDemoPortfolio();
  const isAuthenticated = useIsAuthenticated();
  const { data, isLoading, error } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated || !!demo,
  });
  const [updateProfileMutation] = useUpdateProfileMutation();
  const [uploadAvatarMutation] = useUploadAvatarMutation();

  const profile = useMemo(
    () => (demo ? demo.profile : data ? mapProfile(data) : emptyProfile),
    [demo, data]
  );
  const isLoaded = demo ? true : !isLoading;

  const replaceProfile = useCallback(
    async (next: Profile) => {
      const result = await updateProfileMutation(mapProfileToApi(next)).unwrap();
      return mapProfile(result);
    },
    [updateProfileMutation]
  );

  const updateProfile = useCallback(
    async (updates: Partial<Profile>) => {
      const result = await updateProfileMutation(mapProfileToApi(updates)).unwrap();
      return mapProfile(result);
    },
    [updateProfileMutation]
  );

  const uploadAvatar = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadAvatarMutation(formData).unwrap();
      return resolveAssetUrl(result.avatar_url);
    },
    [uploadAvatarMutation]
  );

  return {
    profile,
    isLoaded,
    error,
    updateProfile,
    replaceProfile,
    uploadAvatar,
  };
}
