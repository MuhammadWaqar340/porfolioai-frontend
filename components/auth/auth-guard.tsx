"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetMeQuery } from "@/store/api/portfolioApi";
import { useAppSelector } from "@/store/hooks";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.accessToken);
  const sessionRestored = useAppSelector((state) => state.auth.sessionRestored);
  const [mounted, setMounted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const { isError, isSuccess, isFetching, isLoading } = useGetMeQuery(undefined, {
    skip: !mounted || !token,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsReady(false);
  }, [token]);

  useEffect(() => {
    if (!mounted || !sessionRestored) return;

    if (!token) {
      router.replace("/login");
      return;
    }

    if (isError) {
      router.replace("/login");
      return;
    }

    if (isSuccess && !isFetching && !isLoading) {
      setIsReady(true);
    }
  }, [
    mounted,
    token,
    sessionRestored,
    isError,
    isSuccess,
    isFetching,
    isLoading,
    router,
  ]);

  if (!mounted || !sessionRestored || !token || !isReady) {
    return (
      <div
        className="flex min-h-[40vh] items-center justify-center"
        suppressHydrationWarning
      >
        <p className="text-sm text-muted-foreground">Loading your workspace…</p>
      </div>
    );
  }

  return <>{children}</>;
}
