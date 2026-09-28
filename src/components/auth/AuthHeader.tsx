"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AuthHeader() {
  const pathname = usePathname();
  const onSignup = pathname === "/signup";
  const onLogin = pathname === "/login";

  return (
    <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-7 py-3 sm:px-10 sm:py-5 md:px-6">
      <Link href="/signup" className="flex min-w-0 items-center gap-2 sm:gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand/20 ring-1 ring-brand-glow/40 sm:h-9 sm:w-9 sm:rounded-xl">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-glow shadow-[0_0_16px_rgba(74,222,128,0.9)] sm:h-3 sm:w-3" />
        </span>
        <span className="truncate text-[13px] font-bold tracking-tight text-white sm:text-base md:text-lg">
          Dark Flash <span className="text-brand-glow">USDT</span>
        </span>
      </Link>

      <nav className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <Link
          href="/login"
          className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition sm:px-5 sm:py-2.5 sm:text-sm ${
            onLogin
              ? "bg-brand text-white shadow-[0_10px_30px_-10px_rgba(22,163,74,0.9)]"
              : "border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
          }`}
        >
          Login
        </Link>
        <Link
          href="/signup"
          className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition sm:px-5 sm:py-2.5 sm:text-sm ${
            onSignup
              ? "bg-brand text-white shadow-[0_10px_30px_-10px_rgba(22,163,74,0.9)]"
              : "border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
          }`}
        >
          Sign up
        </Link>
      </nav>
    </header>
  );
}
