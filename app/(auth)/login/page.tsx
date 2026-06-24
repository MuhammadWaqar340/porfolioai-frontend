import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Sign In",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Build Your Portfolio with AI"
      subtitle="Sign in to manage your portfolio, update your profile, and publish your work to the world."
    >
      <LoginForm />
    </AuthLayout>
  );
}
