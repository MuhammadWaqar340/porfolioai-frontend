"use client";

import { useState } from "react";
import { FormAlert } from "@/components/ui/form-alert";
import { Button } from "@/components/ui/button";
import { notifySuccess } from "@/lib/toast";
import {
  useGetMeQuery,
  useResendVerificationEmailMutation,
} from "@/store/api/portfolioApi";

export function EmailVerificationBanner() {
  const { data: user } = useGetMeQuery();
  const [resend, { isLoading }] = useResendVerificationEmailMutation();
  const [error, setError] = useState<string | null>(null);

  if (!user || user.is_verified || user.auth_provider !== "local") {
    return null;
  }

  async function handleResend() {
    setError(null);
    try {
      const result = await resend().unwrap();
      notifySuccess(result.message);
    } catch {
      setError("Could not send verification email. Try again later.");
    }
  }

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            Verify your email address
          </p>
          <p className="text-sm text-muted-foreground">
            We sent a link to <span className="font-medium">{user.email}</span>.
            Verify your email to secure your account.
          </p>
          {error ? <FormAlert message={error} /> : null}
        </div>
        <Button
          type="button"
          variant="outline"
          className="shrink-0"
          disabled={isLoading}
          onClick={handleResend}
        >
          {isLoading ? "Sending…" : "Resend email"}
        </Button>
      </div>
    </div>
  );
}
