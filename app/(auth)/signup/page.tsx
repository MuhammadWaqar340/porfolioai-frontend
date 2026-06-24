import { AuthLayout } from "@/components/auth/auth-layout";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata = {
  title: "Sign Up",
};

export default function SignupPage() {
  return (
    <AuthLayout
      title="Start your portfolio journey"
      subtitle="Join thousands of professionals showcasing their work with beautiful, AI-powered portfolios."
    >
      <SignupForm />
    </AuthLayout>
  );
}
