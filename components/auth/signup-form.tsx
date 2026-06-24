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
import {
  getApiErrorMessage,
  SIGNUP_API_FIELD_MAP,
} from "@/lib/api/form-errors";
import { validateSignup } from "@/lib/form-validation";
import {
  useGoogleLoginMutation,
  useRegisterMutation,
} from "@/store/api/portfolioApi";
import { useAppDispatch } from "@/store/hooks";
import { startUserSession } from "@/store/session";
import { cn } from "@/lib/utils";

type SignupField = "firstName" | "lastName" | "email" | "password" | "terms";

export function SignupForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const {
    formError,
    clearAll,
    clearField,
    setValidationErrors,
    applyApiError,
    applyApiErrorOrFallback,
    getError,
    setFormError,
  } = useFormErrors<SignupField>();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    clearAll();

    const validationErrors = validateSignup({
      firstName,
      lastName,
      email,
      password,
      termsAccepted,
    });

    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors(validationErrors);
      return;
    }

    try {
      const result = await register({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        password,
      }).unwrap();
      startUserSession(dispatch, {
        accessToken: result.tokens.access_token,
        user: result.user,
      });
      router.push("/dashboard");
    } catch (error) {
      applyApiError(error, SIGNUP_API_FIELD_MAP as Record<string, SignupField>);
    }
  }

  async function handleGoogleSuccess(response: CredentialResponse) {
    if (!response.credential) return;

    clearAll();

    try {
      const result = await googleLogin({ id_token: response.credential }).unwrap();
      startUserSession(dispatch, {
        accessToken: result.tokens.access_token,
        user: result.user,
      });
      router.push("/dashboard");
    } catch (error) {
      applyApiErrorOrFallback(
        error,
        getApiErrorMessage(error, "Google sign-up failed. Please try again.")
      );
    }
  }

  function handleGoogleError() {
    setFormError("Google sign-up was cancelled or failed. Please try again.");
  }

  const isBusy = isLoading || isGoogleLoading;

  return (
    <Card className="border-0 shadow-lg ring-1 ring-foreground/10 animate-scale-in opacity-0 animation-delay-100 sm:border">
      <CardHeader className="space-y-1 text-center sm:text-left">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Start building your professional portfolio in minutes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormAlert message={formError} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Alex"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  clearField("firstName");
                }}
                aria-invalid={Boolean(getError("firstName"))}
              />
              <FieldError message={getError("firstName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Morgan"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  clearField("lastName");
                }}
                aria-invalid={Boolean(getError("lastName"))}
              />
              <FieldError message={getError("lastName")} />
            </div>
          </div>

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
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
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
            {!getError("password") && (
              <p className="text-xs text-muted-foreground">
                At least 8 characters with one uppercase letter and one number.
              </p>
            )}
            <FieldError message={getError("password")} />
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked);
                  clearField("terms");
                }}
                aria-invalid={Boolean(getError("terms"))}
                className={cn(
                  "mt-1 h-4 w-4 rounded border-input accent-primary",
                  getError("terms") && "border-destructive ring-2 ring-destructive/20"
                )}
              />
              <Label htmlFor="terms" className="text-sm font-normal leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
            <FieldError message={getError("terms")} />
          </div>

          <Button type="submit" className="w-full" disabled={isBusy}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <div className="relative my-6">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            or continue with
          </span>
        </div>

        <GoogleSignInButton
          mode="signup"
          disabled={isBusy}
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
