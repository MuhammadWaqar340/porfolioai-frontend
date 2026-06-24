"use client";

import type { CredentialResponse } from "@react-oauth/google";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { useFormErrors } from "@/hooks/use-form-errors";
import { getRememberMePreference } from "@/lib/auth-storage";
import { validateLogin } from "@/lib/form-validation";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { useGoogleLoginMutation, useLoginMutation } from "@/store/api/portfolioApi";
import { useAppDispatch } from "@/store/hooks";
import { startUserSession } from "@/store/session";

type LoginField = "email" | "password";

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(() =>
    typeof window === "undefined" ? true : getRememberMePreference()
  );
  const {
    formError,
    clearAll,
    clearField,
    setValidationErrors,
    applyApiError,
    applyApiErrorOrFallback,
    getError,
    setFormError,
  } = useFormErrors<LoginField>();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    clearAll();

    const validationErrors = validateLogin(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors(validationErrors);
      return;
    }

    try {
      const result = await login({
        email: email.trim(),
        password,
        remember_me: rememberMe,
      }).unwrap();
      startUserSession(dispatch, {
        accessToken: result.tokens.access_token,
        user: result.user,
        rememberMe,
      });
      router.push("/dashboard");
    } catch (error) {
      applyApiErrorOrFallback(
        error,
        getApiErrorMessage(error, "Invalid email or password. Please try again.")
      );
    }
  }

  async function handleGoogleSuccess(response: CredentialResponse) {
    if (!response.credential) return;

    clearAll();

    try {
      const result = await googleLogin({
        id_token: response.credential,
        remember_me: rememberMe,
      }).unwrap();
      startUserSession(dispatch, {
        accessToken: result.tokens.access_token,
        user: result.user,
        rememberMe,
      });
      router.push("/dashboard");
    } catch (error) {
      applyApiErrorOrFallback(
        error,
        getApiErrorMessage(error, "Google sign-in failed. Please try again.")
      );
    }
  }

  function handleGoogleError() {
    setFormError("Google sign-in was cancelled or failed. Please try again.");
  }

  const isBusy = isLoading || isGoogleLoading;

  return (
    <Card className="border-0 shadow-lg ring-1 ring-foreground/10 animate-scale-in opacity-0 animation-delay-100 sm:border">
      <CardHeader className="space-y-1 text-center sm:text-left">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your account to continue building your portfolio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormAlert message={formError} />

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearField("email");
              }}
              aria-invalid={Boolean(getError("email"))}
            />
            <FieldError message={getError("email")} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
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

          <div className="flex items-center gap-2">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            <Label htmlFor="remember" className="text-sm font-normal">
              Remember me for 30 days
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={isBusy}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="relative my-6">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            or continue with
          </span>
        </div>

        <GoogleSignInButton
          mode="signin"
          disabled={isBusy}
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
