"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormAlert } from "@/components/ui/form-alert";
import { cn } from "@/lib/utils";
import { useVerifyEmailMutation } from "@/store/api/portfolioApi";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [verifyEmail, { isLoading, isSuccess, isError, error }] =
    useVerifyEmailMutation();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!token || started) return;
    setStarted(true);
    verifyEmail({ token });
  }, [token, started, verifyEmail]);

  return (
    <Card className="border-0 shadow-lg ring-1 ring-foreground/10 sm:border">
      <CardHeader className="space-y-1 text-center sm:text-left">
        <CardTitle className="text-2xl font-bold">Email verification</CardTitle>
        <CardDescription>
          {!token
            ? "This verification link is invalid."
            : isLoading
              ? "Confirming your email address…"
              : isSuccess
                ? "Your email is verified."
                : "We could not verify this link."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!token ? (
          <>
            <FormAlert message="Request a new verification email from Settings after signing in." />
            <Link href="/login" className={cn(buttonVariants(), "w-full")}>
              Sign in
            </Link>
          </>
        ) : isLoading ? (
          <p className="text-sm text-muted-foreground">Please wait…</p>
        ) : isSuccess ? (
          <Button className="w-full" onClick={() => router.push("/dashboard")}>
            Go to dashboard
          </Button>
        ) : isError ? (
          <>
            <FormAlert
              message={
                (error as { data?: { message?: string } })?.data?.message ??
                "This verification link is invalid or has expired."
              }
            />
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "outline" }), "w-full")}
            >
              Sign in to resend
            </Link>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function VerifyEmailForm() {
  return (
    <Suspense
      fallback={
        <Card className="border-0 shadow-lg ring-1 ring-foreground/10 sm:border">
          <CardContent className="py-8 text-sm text-muted-foreground">
            Loading…
          </CardContent>
        </Card>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
