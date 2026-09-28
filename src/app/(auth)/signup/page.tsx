import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create Account — Dark Flash USDT",
};

export default function SignupPage() {
  return (
    <AuthShell
      title="Create Account"
      subtitle="Create a new account to get started and enjoy seamless access to our features"
    >
      <SignupForm />
    </AuthShell>
  );
}
