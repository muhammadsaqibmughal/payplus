"use client";

import { ArrowRight, Loader2 } from "lucide-react";

type Props = {
  pending: boolean;
  children: React.ReactNode;
};

export function SubmitButton({ pending, children }: Props) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="group mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand text-sm font-semibold text-white shadow-[0_16px_36px_-14px_rgba(22,163,74,0.9)] transition hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-70 sm:mt-2 sm:h-14 sm:text-[15px]"
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
      {!pending && (
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
      )}
    </button>
  );
}
