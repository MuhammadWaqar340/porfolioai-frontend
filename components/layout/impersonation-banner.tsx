"use client";

import { Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ADMIN_APP_URL } from "@/lib/app-urls";
import {
  clearAdminSessionBackup,
  restoreAdminSession,
} from "@/lib/impersonation-storage";
import { useGetMeQuery } from "@/store/api/portfolioApi";

export function ImpersonationBanner() {
  const { data: me } = useGetMeQuery();

  if (!me?.is_impersonating) return null;

  function handleExit() {
    const backup = restoreAdminSession();
    clearAdminSessionBackup();
    if (backup) {
      const restore = new URL("/auth/restore", ADMIN_APP_URL);
      restore.searchParams.set("token", backup.accessToken);
      restore.searchParams.set("user", btoa(JSON.stringify(backup.user)));
      window.location.href = restore.toString();
      return;
    }
    window.location.href = `${ADMIN_APP_URL}/login`;
  }

  return (
    <div className="border-b border-amber-500/30 bg-amber-500/15 px-4 py-2.5">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-amber-950 dark:text-amber-100">
          <Eye className="h-4 w-4 shrink-0" />
          <span>
            Viewing as{" "}
            <strong>
              {me.first_name} {me.last_name}
            </strong>{" "}
            ({me.email})
            {me.impersonator_email ? (
              <span className="text-amber-900/80 dark:text-amber-100/80">
                {" "}
                · read-only · admin: {me.impersonator_email}
              </span>
            ) : (
              <span> · read-only impersonation</span>
            )}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={handleExit}>
          <X className="mr-1.5 h-3.5 w-3.5" />
          Exit impersonation
        </Button>
      </div>
    </div>
  );
}
