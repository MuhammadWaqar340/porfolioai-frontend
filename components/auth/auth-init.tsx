"use client";

import { useEffect } from "react";
import { useGetMeQuery } from "@/store/api/portfolioApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signOut } from "@/store/session";
import { setUser } from "@/store/slices/authSlice";

export function AuthInit() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.accessToken);
  const sessionRestored = useAppSelector((state) => state.auth.sessionRestored);
  const { data, isSuccess, isError } = useGetMeQuery(undefined, {
    skip: !token || !sessionRestored,
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data));
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    if (!sessionRestored || !token) return;
    if (isError) {
      signOut(dispatch);
    }
  }, [isError, sessionRestored, token, dispatch]);

  return null;
}
