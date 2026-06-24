import { AuthLayout } from "@/components/auth/auth-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll help you get back into your account so you can keep building your portfolio."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
