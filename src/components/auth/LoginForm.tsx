"use client";

import { useActionState } from "react";
import { Lock, Mail } from "lucide-react";
import { login } from "@/app/actions/auth";
import { AuthInput } from "./AuthInput";
import { SubmitButton } from "./SubmitButton";
import { AuthSwitchLink } from "./AuthSwitchLink";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
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
          className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-2.5 text-center text-sm text-red-200"
        >
          {state.message}
        </p>
      )}

      <div className="pt-4">
        <SubmitButton pending={pending}>Sign In</SubmitButton>
      </div>

      <p className="mt-3 text-center text-xs text-white/55">
        Don&apos;t have an account?{" "}
        <AuthSwitchLink href="/signup">Create one here</AuthSwitchLink>
      </p>
    </form>
  );
}
