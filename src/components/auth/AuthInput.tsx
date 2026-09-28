"use client";

import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { useId, useState } from "react";

type Props = {
  name: string;
  placeholder: string;
  icon: LucideIcon;
  type?: "text" | "email" | "password";
  autoComplete?: string;
  errors?: string[];
  defaultValue?: string;
};

export function AuthInput({
  name,
  placeholder,
  icon: Icon,
  type = "text",
  autoComplete,
  errors,
  defaultValue,
}: Props) {
  const id = useId();
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (revealed ? "text" : "password") : type;
  const hasError = Boolean(errors?.length);

  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <div
        className={`flex h-11 items-center gap-2.5 rounded-2xl border bg-white/5 px-3.5 backdrop-blur transition focus-within:border-brand-glow/60 focus-within:bg-white/10 sm:h-14 sm:gap-3 sm:px-5 ${
          hasError ? "border-red-400/70" : "border-white/10"
        }`}
      >
        <Icon className="h-4 w-4 shrink-0 text-white/70 sm:h-5 sm:w-5" aria-hidden />
        <input
          id={id}
          name={name}
          type={inputType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          className="auth-field h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-white/45 sm:text-[15px]"
          aria-invalid={hasError || undefined}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? "Hide password" : "Show password"}
            className="shrink-0 text-white/55 transition hover:text-white"
          >
            {revealed ? (
              <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
        )}
      </div>
      {hasError && (
        <ul className="mt-1.5 space-y-0.5 pl-1 text-xs text-red-300">
          {errors!.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
