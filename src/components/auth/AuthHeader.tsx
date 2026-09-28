"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AuthHeader() {
  const pathname = usePathname();
  const onSignup = pathname === "/signup";
  const onLogin = pathname === "/login";

  return (
    <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
      <Link href="/signup" className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/20 ring-1 ring-brand-glow/40">
          <span className="h-3 w-3 rounded-full bg-brand-glow shadow-[0_0_16px_rgba(74,222,128,0.9)]" />
        </span>
        <span className="text-base font-bold tracking-tight text-white sm:text-lg">
          Dark Flash <span className="text-brand-glow">USDT</span>
        </span>
      </Link>

      <nav className="flex items-center gap-2">
        <Link
          href="/login"
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
            onLogin
              ? "bg-brand text-white shadow-[0_10px_30px_-10px_rgba(22,163,74,0.9)]"
              : "border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
          }`}
        >
          Login
        </Link>
        <Link
          href="/signup"
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
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
