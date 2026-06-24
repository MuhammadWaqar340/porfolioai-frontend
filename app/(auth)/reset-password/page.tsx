import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata = {
  title: "Reset Password",
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Choose a new password"
      subtitle="Create a strong password to secure your PortfolioAI account."
    >
      <Suspense
        fallback={
          <div className="flex min-h-[280px] items-center justify-center text-sm text-muted-foreground">
            Loading…
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
