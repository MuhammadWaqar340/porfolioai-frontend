"use client";

import { AlertTriangle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useGetMeQuery, useGetPlatformConfigQuery } from "@/store/api/portfolioApi";

const BYPASS_PREFIXES = ["/admin", "/login", "/signup"];

export function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: config } = useGetPlatformConfigQuery();
  const { data: me, isLoading } = useGetMeQuery(undefined, {
    skip: !config?.maintenance_mode,
  });

  const bypassed =
    BYPASS_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    me?.is_admin;

  if (!config?.maintenance_mode || bypassed) {
    return <>{children}</>;
  }

  if (isLoading && !me) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        Checking maintenance status…
      </div>
    );
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="max-w-md space-y-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Under maintenance</h1>
        <p className="text-sm text-muted-foreground">
          PortfolioAI is temporarily unavailable while we perform updates. Please
          check back soon.
        </p>
        {config.announcement_enabled && config.announcement_message ? (
          <p className="rounded-lg border bg-muted/30 px-4 py-3 text-sm">
            {config.announcement_message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
