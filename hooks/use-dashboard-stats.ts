"use client";

import { useGetDashboardStatsQuery } from "@/store/api/portfolioApi";
import { useIsAuthenticated } from "@/store/hooks";

const POLLING_INTERVAL_MS = 30_000;

export function useDashboardStats() {
  const isAuthenticated = useIsAuthenticated();
  const query = useGetDashboardStatsQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: POLLING_INTERVAL_MS,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  return {
    stats: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
    lastUpdated: query.data?.updated_at ?? null,
  };
}
