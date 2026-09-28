"use client";

import { useActionState } from "react";
import { Lock, Mail } from "lucide-react";
import { login } from "@/app/actions/auth";
import { AuthInput } from "./AuthInput";
import { SubmitButton } from "./SubmitButton";
import Link from "next/link";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="flex flex-col gap-3 sm:gap-4" noValidate>
      <AuthInput
        name="email"
        type="email"
        placeholder="Email Address"
        icon={Mail}
        autoComplete="email"
        errors={state?.errors?.email}
        defaultValue={state?.values?.email}
      />
      <AuthInput
        name="password"
        type="password"
        placeholder="Password"
        icon={Lock}
        autoComplete="current-password"
        errors={state?.errors?.password}
      />

      {state?.message && (
        <p
          role="alert"
          className="rounded-xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-center text-xs text-red-200 sm:px-4 sm:py-2.5 sm:text-sm"
        >
          {state.message}
        </p>
      )}

      <div className="pt-4">
        <SubmitButton pending={pending}>Sign In</SubmitButton>
      </div>

      <p className="mt-2 text-center text-[11px] text-white/55 sm:mt-3 sm:text-xs">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-brand-glow hover:underline">
          Create one here
        </Link>
      </p>
    </form>
  );
}
