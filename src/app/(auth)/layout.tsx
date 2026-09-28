import { AuthHeader } from "@/components/auth/AuthHeader";
import { ThemeBackground } from "@/components/ThemeBackground";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <ThemeBackground variant="main" dim={0.32} />
      <AuthHeader />
      {children}
    </div>
  );
}
