import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { ThemeBackground } from "@/components/ThemeBackground";
import { UsdtSender } from "@/components/dashboard/UsdtSender";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "USDT Sender — Dark Flash USDT",
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <>
      <ThemeBackground dim={0.35} />
      <div className="relative flex min-h-screen flex-col">
        <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:px-6 sm:py-5">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/20 ring-1 ring-brand-glow/40 sm:h-9 sm:w-9 sm:rounded-xl">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-glow shadow-[0_0_16px_rgba(74,222,128,0.9)] sm:h-3 sm:w-3" />
            </span>
            <span className="text-[13px] font-bold tracking-tight text-white sm:text-base md:text-lg">
              Dark Flash <span className="text-brand-glow">USDT</span>
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
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:bg-white/10 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
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
