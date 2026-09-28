"use client";

import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowRight, Activity, ShieldCheck, Zap } from "lucide-react";
import { Coin } from "./Coin";

const INTRO_DURATION_MS = 2600;

const COIN_ONE = {
  layoutId: "coin-one",
  src: "/assest/icon 1.png",
  fallbackSrc: "/assest/icon-1-fallback.svg",
  alt: "Coin one",
};

const COIN_TWO = {
  layoutId: "coin-two",
  src: "/assest/icon 2.png",
  alt: "Coin two",
};

export function LandingExperience() {
  const [phase, setPhase] = useState<"intro" | "main">("intro");

  useEffect(() => {
    const timer = window.setTimeout(() => setPhase("main"), INTRO_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <LayoutGroup>
      <div className="relative flex min-h-screen flex-col">
        <AnimatePresence>
          {phase === "intro" ? (
            <IntroStage key="intro" onSkip={() => setPhase("main")} />
          ) : (
            <MainStage key="main" />
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}

/* ------------------------------------------------------------------ */
/* Intro: the two icons fly in, hover in the air, then travel to hero  */
/* ------------------------------------------------------------------ */

function IntroStage({ onSkip }: { onSkip: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-[#031420]/55 backdrop-blur-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
      onClick={onSkip}
      role="presentation"
    >
      {/* soft radial spotlight */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(74,222,128,0.28) 0%, rgba(34,211,238,0.12) 40%, rgba(0,0,0,0) 70%)",
        }}
      />

      <div className="relative flex items-center justify-center gap-5 sm:gap-12 md:gap-20">
        <span className="pulse-ring pointer-events-none absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-glow/40 sm:h-52 sm:w-52 md:h-64 md:w-64" />
        <span
          className="pulse-ring pointer-events-none absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-teal/40 sm:h-52 sm:w-52 md:h-64 md:w-64"
          style={{ animationDelay: "1.1s" }}
        />

        <Coin
          {...COIN_ONE}
          className="h-24 w-24 sm:h-36 sm:w-36 md:h-[168px] md:w-[168px]"
          floatY={10}
          floatRotate={8}
          floatDuration={2.4}
          entrance={{
            from: { x: -220, y: 140, scale: 0.2, rotate: -60 },
            duration: 0.9,
            delay: 0.1,
          }}
        />
        <Coin
          {...COIN_TWO}
          className="h-24 w-24 sm:h-36 sm:w-36 md:h-[168px] md:w-[168px]"
          floatY={12}
          floatRotate={-8}
          floatDuration={2.6}
          floatDelay={0.3}
          entrance={{
            from: { x: 220, y: 140, scale: 0.2, rotate: 60 },
            duration: 0.9,
            delay: 0.25,
          }}
        />
      </div>

      <motion.div
        className="mt-8 flex flex-col items-center gap-3 sm:mt-14"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
      >
        <p className="glow-text text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Pay<span className="text-brand-glow">Pulse</span>
        </p>
        <p className="text-sm text-white/70">Syncing your payment universe…</p>
        <div className="mt-2 h-1 w-48 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand to-brand-glow"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: (INTRO_DURATION_MS - 1000) / 1000,
              delay: 1,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>

      <p className="absolute bottom-8 text-xs uppercase tracking-[0.3em] text-white/40">
        click to skip
      </p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Main landing screen                                                 */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.35 + i * 0.12, duration: 0.65, ease: "easeOut" as const },
  }),
};

function MainStage() {
  return (
    <motion.div
      className="relative z-10 flex min-h-screen flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Header />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col-reverse items-center gap-16 px-6 pb-20 pt-10 lg:flex-row lg:items-center lg:gap-10 lg:pt-6">
        {/* Copy */}
        <div className="flex w-full max-w-xl flex-col items-start gap-6 lg:w-1/2">
          <motion.span
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 rounded-full border border-brand-glow/30 bg-brand/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-brand-glow"
          >
            <Activity className="h-3.5 w-3.5" />
            Real-time payment intelligence
          </motion.span>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Every payment,
            <br />
            one live <span className="glow-text text-brand-glow">pulse</span>.
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="max-w-lg text-base leading-relaxed text-white/75 sm:text-lg"
          >
            Monitor transactions, settlements and growth across every channel
            from a single dashboard. Built for teams that move money and need to
            see it move.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_-10px_rgba(22,163,74,0.8)] transition hover:bg-brand-strong"
            >
              Get started free
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              Sign in
            </Link>
          </motion.div>

          <motion.dl
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-4 grid w-full grid-cols-3 gap-6 border-t border-white/10 pt-6"
          >
            {[
              ["99.99%", "Uptime"],
              ["120+", "Currencies"],
              ["<50ms", "Sync latency"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="text-xs uppercase tracking-wider text-white/50">
                  {label}
                </dt>
                <dd className="mt-1 text-2xl font-bold text-white">{value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Visual: coins land here */}
        <div className="relative flex h-[380px] w-full items-center justify-center overflow-visible sm:h-[460px] lg:h-[540px] lg:w-1/2">
          <motion.div
            className="absolute inset-x-6 bottom-8 top-14 rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
          >
            <div className="relative z-10 p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.25em] text-white/50">
                Total volume · 30d
              </p>
              <p className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                $2,481,930
              </p>
              <p className="mt-1 text-sm font-medium text-brand-glow">
                ▲ 18.4% vs last month
              </p>
            </div>
          </motion.div>

          <MiniChart />

          <div className="absolute -top-1 right-1 z-20 sm:-top-2 sm:right-0 lg:-top-3 lg:right-0">
            <Coin
              {...COIN_ONE}
              className="h-[88px] w-[88px] sm:h-[140px] sm:w-[140px] lg:h-[186px] lg:w-[186px]"
              floatY={4}
              floatRotate={2}
              floatDuration={5}
            />
          </div>
          <div className="absolute bottom-0 left-3 z-20 sm:-bottom-2 sm:left-4 lg:-bottom-6 lg:left-0">
            <Coin
              {...COIN_TWO}
              className="h-[72px] w-[72px] sm:h-[120px] sm:w-[120px] lg:h-[160px] lg:w-[160px]"
              floatY={8}
              floatRotate={-4}
              floatDuration={4.6}
              floatDelay={0.4}
            />
          </div>
        </div>
      </main>

      <FeatureStrip />
    </motion.div>
  );
}

function Header() {
  return (
    <motion.header
      className="sticky top-0 z-30 w-full"
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-brand/20 ring-1 ring-brand-glow/40">
            <span className="h-3 w-3 rounded-full bg-brand-glow shadow-[0_0_16px_rgba(74,222,128,0.9)]" />
          </span>
          <span className="text-lg font-bold tracking-tight text-white">
            Pay<span className="text-brand-glow">Pulse</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-white/70 md:flex">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#pricing" className="transition hover:text-white">
            Pricing
          </a>
          <a href="#about" className="transition hover:text-white">
            About
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-white/80 transition hover:text-white sm:inline-flex"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(22,163,74,0.9)] transition hover:bg-brand-strong"
          >
            Sign up
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

function MiniChart() {
  // Percentage viewBox of the whole visual (including the coins).
  // Last point sits in the lower-left of the green coin so the stroke
  // reads as connected after the draw animation.
  const pts: [number, number][] = [
    [10, 82],
    [18, 77],
    [26, 79],
    [34, 70],
    [42, 72],
    [50, 60],
    [58, 54],
    [66, 42],
    [74, 32],
    [81, 22],
    [86, 13],
    [90.5, 6.8],
  ];
  const path = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`)
    .join(" ");
  const [endX, endY] = pts[pts.length - 1];

  return (
    <svg
      viewBox="0 0 100 100"
      className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#4ade80" stopOpacity="0.28" />
          <stop offset="1" stopColor="#4ade80" stopOpacity="0" />
        </linearGradient>
        <filter id="line-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <motion.path
        d={`${path} L${endX},90 L10,90 Z`}
        fill="url(#area)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="#4ade80"
        strokeWidth={1.15}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#line-glow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.85, duration: 1.7, ease: "easeInOut" }}
      />
      <motion.circle
        cx={endX}
        cy={endY}
        r={1.4}
        fill="#4ade80"
        filter="url(#line-glow)"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.45, duration: 0.3, ease: "easeOut" }}
        style={{ transformOrigin: `${endX}px ${endY}px` }}
      />
    </svg>
  );
}

function FeatureStrip() {
  const features = [
    {
      icon: Zap,
      title: "Instant settlement view",
      body: "Watch funds clear across gateways the moment they land.",
    },
    {
      icon: ShieldCheck,
      title: "Bank-grade security",
      body: "Encrypted sessions, hashed credentials and audit trails by default.",
    },
    {
      icon: Activity,
      title: "Live analytics",
      body: "Volume, success rate and churn, refreshed every few seconds.",
    },
  ];

  return (
    <section
      id="features"
      className="mx-auto w-full max-w-7xl px-6 pb-16"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + i * 0.12, duration: 0.6, ease: "easeOut" }}
          >
            <f.icon className="h-6 w-6 text-brand-glow" />
            <h3 className="mt-4 text-base font-semibold text-white">{f.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-white/65">{f.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
