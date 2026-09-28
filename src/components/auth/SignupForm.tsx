"use client";

import { useActionState } from "react";
import { Lock, Mail, User } from "lucide-react";
import { signup } from "@/app/actions/auth";
import { AuthInput } from "./AuthInput";
import { SubmitButton } from "./SubmitButton";
import Link from "next/link";

export function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <AuthInput
        name="name"
        placeholder="Name"
        icon={User}
        autoComplete="name"
        errors={state?.errors?.name}
        defaultValue={state?.values?.name}
      />
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
        autoComplete="new-password"
        errors={state?.errors?.password}
      />
      <AuthInput
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        icon={Lock}
        autoComplete="new-password"
        errors={state?.errors?.confirmPassword}
      />

      {state?.message && (
        <p
          role="alert"
          className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-2.5 text-center text-sm text-red-200"
        >
          {state.message}
        </p>
      )}

      <div className="pt-4">
        <SubmitButton pending={pending}>Create Account</SubmitButton>
      </div>

      <p className="mt-3 text-center text-xs text-white/55">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand-glow hover:underline">
          Sign in here
        </Link>
      </p>
    </form>
  );
}
