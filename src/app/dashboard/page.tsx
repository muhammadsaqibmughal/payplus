import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { ThemeBackground } from "@/components/ThemeBackground";
import { UsdtSender } from "@/components/dashboard/UsdtSender";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "USDT Sender — PayPulse",
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <>
      <ThemeBackground variant="main" dim={0.5} />
      <div className="relative flex min-h-screen flex-col">
        <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/20 ring-1 ring-brand-glow/40">
              <span className="h-3 w-3 rounded-full bg-brand-glow shadow-[0_0_16px_rgba(74,222,128,0.9)]" />
            </span>
            <span className="text-lg font-bold tracking-tight text-white">
              Pay<span className="text-brand-glow">Pulse</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-white">{session.name}</p>
              <p className="text-xs text-white/60">{session.email}</p>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </form>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 pt-2">
          <UsdtSender userName={session.name} />
        </main>
      </div>
    </>
  );
}
