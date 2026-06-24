"use client";

import { ArrowLeft, MailCheck } from "lucide-react";
import Link from "next/link";
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
import { validateForgotPassword } from "@/lib/form-validation";
import { cn } from "@/lib/utils";
import { useForgotPasswordMutation } from "@/store/api/portfolioApi";

export function ForgotPasswordForm() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const {
    formError,
    clearAll,
    clearField,
    setValidationErrors,
    applyApiError,
    getError,
  } = useFormErrors<"email">();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    clearAll();

    const validationErrors = validateForgotPassword(email);
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors(validationErrors);
      return;
    }

    try {
      await forgotPassword({ email: email.trim() }).unwrap();
      setSubmitted(true);
    } catch (error) {
      applyApiError(error);
    }
  }

  if (submitted) {
    return (
      <Card className="border-0 shadow-lg ring-1 ring-foreground/10 animate-scale-in opacity-0 animation-delay-100 sm:border">
        <CardHeader className="space-y-1 text-center sm:text-left">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary sm:mx-0">
            <MailCheck className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
          <CardDescription>
            If an account exists for <span className="font-medium text-foreground">{email.trim()}</span>, we sent password reset instructions. The link expires in 60 minutes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive it? Check your spam folder or try again with the correct email address.
          </p>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg ring-1 ring-foreground/10 animate-scale-in opacity-0 animation-delay-100 sm:border">
      <CardHeader className="space-y-1 text-center sm:text-left">
        <CardTitle className="text-2xl font-bold">Forgot password?</CardTitle>
        <CardDescription>
          Enter the email linked to your account and we&apos;ll send you a reset link.
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending link..." : "Send reset link"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
