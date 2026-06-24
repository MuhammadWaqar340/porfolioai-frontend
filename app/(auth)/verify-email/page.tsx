import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import { AuthLayout } from "@/components/auth/auth-layout";

export const metadata = {
  title: "Verify Email",
};

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      title="Build Your Portfolio with AI"
      subtitle="Verify your email to secure your PortfolioAI account."
    >
      <VerifyEmailForm />
    </AuthLayout>
  );
}
