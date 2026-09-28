"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AuthMorphMark } from "./AuthMorphMark";
import { AuthSwitchContext } from "./AuthSwitchLink";

const AUTH_COPY: Record<string, { title: string; subtitle: string }> = {
  "/login": {
    title: "Welcome Back",
    subtitle:
      "Sign in to your account to continue tracking every payment in real time",
  },
  "/signup": {
    title: "Create Account",
    subtitle:
      "Create a new account to get started and enjoy seamless access to our features",
  },
};

const MORPH_TOTAL = 1600;
const EASE = [0.22, 1, 0.36, 1] as const;

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function AuthTitle({ title }: { title: string }) {
  const words = title.split(" ");
  const last = words.pop();
  return (
    <h1 className="text-3xl font-bold tracking-tight text-white sm:text-[2.1rem]">
      {words.join(" ")}{" "}
      <span className="text-brand-glow">{last}</span>
    </h1>
  );
}

export function AuthShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"form" | "morph">("morph");
  const [squareH, setSquareH] = useState<number | null>(448);
  const cardRef = useRef<HTMLDivElement>(null);
  const skipPopMorph = useRef(false);
  const prevPath = useRef(pathname);
  const runId = useRef(0);
  const switching = useRef(false);
  const morphUntil = useRef(0);

  const endMorph = useCallback(() => {
    skipPopMorph.current = false;
    switching.current = false;
    setPhase("form");
    setSquareH(null);
  }, []);

  const playSwitch = useCallback(
    async (nextPath: string) => {
      if (nextPath === pathname || switching.current) return;

      if (reduceMotion) {
        router.push(nextPath);
        return;
      }

      switching.current = true;
      const id = ++runId.current;
      const rect = cardRef.current?.getBoundingClientRect();
      setSquareH(rect ? Math.round(rect.width) : 448);
      setPhase("morph");
      skipPopMorph.current = true;
      morphUntil.current = Date.now() + MORPH_TOTAL;

      await wait(MORPH_TOTAL);
      if (id !== runId.current) {
        switching.current = false;
        return;
      }
      router.push(nextPath);
    },
    [pathname, reduceMotion, router],
  );

  useEffect(() => {
    router.prefetch(pathname === "/signup" ? "/login" : "/signup");
  }, [pathname, router]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("form");
      setSquareH(null);
      return;
    }

    morphUntil.current = Date.now() + MORPH_TOTAL;
    const timer = window.setTimeout(endMorph, MORPH_TOTAL);
    return () => window.clearTimeout(timer);
    // Intro should run once when arriving from the landing buttons.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;

    if (skipPopMorph.current) {
      skipPopMorph.current = false;
      const remaining = morphUntil.current - Date.now();
      if (remaining > 50) {
        const timer = window.setTimeout(endMorph, remaining);
        return () => window.clearTimeout(timer);
      }
      endMorph();
      return;
    }

    if (reduceMotion) return;

    const id = ++runId.current;
    const rect = cardRef.current?.getBoundingClientRect();
    setSquareH(rect ? Math.round(rect.width) : 448);
    setPhase("morph");

    const timer = window.setTimeout(() => {
      if (id !== runId.current) return;
      endMorph();
    }, MORPH_TOTAL);

    return () => window.clearTimeout(timer);
  }, [pathname, reduceMotion, endMorph]);

  const copy = AUTH_COPY[pathname] ?? AUTH_COPY["/login"];
  const morphing = phase === "morph";

  return (
    <AuthSwitchContext.Provider
      value={(href) => {
        void playSwitch(href);
      }}
    >
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
      <motion.div
        className="relative w-full max-w-md"
        initial={false}
        animate={{
          filter: morphing
            ? "drop-shadow(0 24px 48px rgba(0,0,0,0.5)) drop-shadow(0 0 36px rgba(74,222,128,0.28))"
            : "drop-shadow(0 24px 48px rgba(0,0,0,0.45))",
        }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <motion.div
          ref={cardRef}
          className="auth-clip relative overflow-hidden bg-[#041e2f]/75 text-white"
          aria-busy={morphing}
          style={
            {
              "--auth-cut": morphing ? "2.35rem" : "1.75rem",
            } as React.CSSProperties
          }
          initial={false}
          animate={{ height: morphing && squareH ? squareH : "auto" }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 to-white/10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[1px] bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(4,30,47,0.42)_38%,rgba(4,30,47,0.55)_100%)] backdrop-blur-xl"
          />

          <div className="relative z-10 flex min-h-full flex-col px-7 pb-8 pt-7 sm:px-10">
            <AnimatePresence>
              {morphing ? (
                <motion.div
                  key="morph"
                  className="absolute inset-0 z-20 flex flex-col px-7 pb-8 pt-7 sm:px-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="sr-only">Switching forms</span>
                  <AuthMorphMark />
                </motion.div>
              ) : null}
            </AnimatePresence>
            <AnimatePresence mode="popLayout">
              {!morphing && (
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: EASE }}
                >
                  <Link
                    href="/"
                    aria-label="Go back"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 backdrop-blur transition hover:bg-white/10 hover:text-white"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Link>

                  <div className="mt-8 text-center">
                    <AuthTitle title={copy.title} />
                    <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-white/65">
                      {copy.subtitle}
                    </p>
                  </div>

                  <div className="mt-8">{children}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
    </AuthSwitchContext.Provider>
  );
}
