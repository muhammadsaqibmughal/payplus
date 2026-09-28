"use client";

import { createContext, useContext } from "react";

export const AuthSwitchContext = createContext<(href: string) => void>(() => {});

export function AuthSwitchLink({
  href,
  children,
}: {
  href: "/login" | "/signup";
  children: React.ReactNode;
}) {
  const playSwitch = useContext(AuthSwitchContext);

  return (
    <button
      type="button"
      className="font-medium text-brand-glow hover:underline"
      data-auth-switch={href}
      onClick={() => playSwitch(href)}
    >
      {children}
    </button>
  );
}
