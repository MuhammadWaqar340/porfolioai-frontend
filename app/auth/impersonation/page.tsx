"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { saveAccessToken } from "@/lib/auth-storage";
import { backupAdminSession } from "@/lib/impersonation-storage";
import type { AuthUser, MeData } from "@/lib/api/types";
import { baseApi } from "@/store/api/baseApi";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";

export default function ImpersonationHandoffPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const adminToken = params.get("admin_token");
    const adminUserRaw = params.get("admin_user");
    const userRaw = params.get("user");

    if (!token || !adminToken || !adminUserRaw || !userRaw) {
      setError("Invalid impersonation handoff.");
      return;
    }

    let adminUser: MeData;
    let user: AuthUser;
    try {
      adminUser = JSON.parse(atob(adminUserRaw)) as MeData;
      user = JSON.parse(atob(userRaw)) as AuthUser;
    } catch {
      setError("Could not read impersonation session.");
      return;
    }

    backupAdminSession(adminToken, adminUser);
    saveAccessToken(token, true);
    dispatch(
      setCredentials({
        accessToken: token,
        user: {
          ...user,
          is_impersonating: true,
          impersonator_id: adminUser.id,
          impersonator_email: adminUser.email,
        },
        rememberMe: true,
      })
    );
    dispatch(baseApi.util.resetApiState());
    router.replace("/dashboard");
  }, [dispatch, router]);

  if (error) {
    return (
      <div className="flex min-h-svh items-center justify-center px-4 text-center text-sm text-muted-foreground">
        {error}
      </div>
    );
  }

  return (
    <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Starting impersonation session…
    </div>
  );
}
