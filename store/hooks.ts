import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "@/store";
import { useGetMeQuery } from "@/store/api/portfolioApi";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export function useIsAuthenticated() {
  return useAppSelector((state) => Boolean(state.auth.accessToken));
}

export function useIsAdmin() {
  const { data } = useGetMeQuery();
  return Boolean(data?.is_admin);
}

export function useTargetRole() {
  return useAppSelector((state) => state.preferences.targetRole);
}
