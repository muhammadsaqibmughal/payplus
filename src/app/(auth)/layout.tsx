import { AuthShell } from "@/components/auth/AuthShell";
import { ThemeBackground } from "@/components/ThemeBackground";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeBackground variant="main" dim={0.32} />
      <AuthShell>{children}</AuthShell>
    </>
  );
}
