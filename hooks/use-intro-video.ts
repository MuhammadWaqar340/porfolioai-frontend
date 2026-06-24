"use client";

import { useCallback, useMemo } from "react";
import { emptyIntroVideo } from "@/lib/empty-defaults";
import { mapIntroVideo, mapIntroVideoToApi } from "@/lib/api/mappers";
import type { IntroVideo } from "@/types";
import {
  useDeleteIntroVideoMutation,
  useGetIntroVideoQuery,
  useUpdateIntroVideoMutation,
} from "@/store/api/portfolioApi";
import { useIsAuthenticated } from "@/store/hooks";
import { useOptionalDemoPortfolio } from "@/contexts/portfolio-demo-context";

export function useIntroVideo() {
  const demo = useOptionalDemoPortfolio();
  const isAuthenticated = useIsAuthenticated();
  const { data, isLoading, error } = useGetIntroVideoQuery(undefined, {
    skip: !isAuthenticated || !!demo,
  });
  const [updateIntroVideoMutation] = useUpdateIntroVideoMutation();
  const [deleteIntroVideoMutation] = useDeleteIntroVideoMutation();

  const introVideo = useMemo((): IntroVideo => {
    if (demo) {
      return {
        introVideoUrl: demo.profile.introVideoUrl,
        introVideoEnabled: demo.profile.introVideoEnabled,
        introVideoScript: demo.profile.introVideoScript,
      };
    }
    return data ? mapIntroVideo(data) : emptyIntroVideo;
  }, [demo, data]);

  const isLoaded = demo ? true : !isLoading;

  const updateIntroVideo = useCallback(
    async (updates: Partial<IntroVideo>) => {
      const result = await updateIntroVideoMutation(
        mapIntroVideoToApi(updates)
      ).unwrap();
      return mapIntroVideo(result);
    },
    [updateIntroVideoMutation]
  );

  const deleteIntroVideo = useCallback(async () => {
    const result = await deleteIntroVideoMutation().unwrap();
    return mapIntroVideo(result);
  }, [deleteIntroVideoMutation]);

  return {
    introVideo,
    isLoaded,
    error,
    updateIntroVideo,
    deleteIntroVideo,
  };
}
