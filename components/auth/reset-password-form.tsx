"use client";

import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldError } from "@/components/ui/field-error";
import { FormAlert } from "@/components/ui/form-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormErrors } from "@/hooks/use-form-errors";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { validateResetPassword } from "@/lib/form-validation";
import { cn } from "@/lib/utils";
import { useResetPasswordMutation } from "@/store/api/portfolioApi";

type ResetField = "password" | "confirmPassword";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [completed, setCompleted] = useState(false);
  const {
    formError,
    clearAll,
    clearField,
    setValidationErrors,
    applyApiErrorOrFallback,
    getError,
  } = useFormErrors<ResetField>();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    clearAll();

    if (!token) {
      applyApiErrorOrFallback(
        null,
        "This reset link is invalid. Please request a new one."
      );
      return;
    }

    const validationErrors = validateResetPassword(password, confirmPassword);
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors(validationErrors);
      return;
    }

    try {
      await resetPassword({ token, new_password: password }).unwrap();
      setCompleted(true);
    } catch (error) {
      applyApiErrorOrFallback(
        error,
        getApiErrorMessage(error, "Unable to reset password. Please try again.")
      );
    }
  }

  if (!token) {
    return (
      <Card className="border-0 shadow-lg ring-1 ring-foreground/10 animate-scale-in opacity-0 animation-delay-100 sm:border">
        <CardHeader className="space-y-1 text-center sm:text-left">
          <CardTitle className="text-2xl font-bold">Invalid reset link</CardTitle>
          <CardDescription>
            This password reset link is missing or invalid. Request a new one to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/forgot-password" className={cn(buttonVariants(), "w-full")}>
            Request new link
          </Link>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          >
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (completed) {
    return (
      <Card className="border-0 shadow-lg ring-1 ring-foreground/10 animate-scale-in opacity-0 animation-delay-100 sm:border">
        <CardHeader className="space-y-1 text-center sm:text-left">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary sm:mx-0">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Password updated</CardTitle>
          <CardDescription>
            Your password has been reset. You can now sign in with your new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={() => router.push("/login")}>
            Continue to sign in
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg ring-1 ring-foreground/10 animate-scale-in opacity-0 animation-delay-100 sm:border">
      <CardHeader className="space-y-1 text-center sm:text-left">
        <CardTitle className="text-2xl font-bold">Set a new password</CardTitle>
        <CardDescription>
          Choose a strong password with at least 8 characters, one uppercase letter, and one number.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormAlert message={formError} />

          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter a new password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearField("password");
                }}
                aria-invalid={Boolean(getError("password"))}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <FieldError message={getError("password")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearField("confirmPassword");
                }}
                aria-invalid={Boolean(getError("confirmPassword"))}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <FieldError message={getError("confirmPassword")} />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Updating password..." : "Reset password"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
