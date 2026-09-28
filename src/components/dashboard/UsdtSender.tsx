"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Link2,
  Loader2,
  Send,
  Terminal,
  Wallet,
} from "lucide-react";

type Network = "BEP20" | "BEP2" | "POLYGON" | "ERC20" | "SOLANA" | "TRC20";

const NETWORKS: { id: Network; label: string; explorer: string }[] = [
  { id: "BEP20", label: "BEP20", explorer: "https://bscscan.com/address/" },
  { id: "BEP2", label: "BEP2", explorer: "https://explorer.bnbchain.org/address/" },
  { id: "POLYGON", label: "POLYGON", explorer: "https://polygonscan.com/address/" },
  { id: "ERC20", label: "ERC20", explorer: "https://etherscan.io/address/" },
  { id: "SOLANA", label: "SOLANA", explorer: "https://solscan.io/account/" },
  { id: "TRC20", label: "TRC20", explorer: "https://tronscan.org/#/address/" },
];

type Status = "idle" | "sending" | "completed" | "error";

function randomHex(length: number) {
  const bytes = new Uint8Array(length / 2);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function UsdtSender({ userName }: { userName: string }) {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState<Network>("POLYGON");

  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([
    `Welcome, ${userName}. Connect a wallet to start sending USDT.`,
  ]);
  const [formError, setFormError] = useState<string | null>(null);

  const logRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [logs]);

  useEffect(() => {
    return () => timers.current.forEach((t) => window.clearTimeout(t));
  }, []);

  const log = (line: string) => setLogs((prev) => [...prev, line]);

  const schedule = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  function handleConnect() {
    if (connected) {
      setConnected(false);
      setWalletAddress(null);
      log("Wallet disconnected.");
      return;
    }
    setConnecting(true);
    log("Requesting wallet connection…");
    schedule(() => {
      const addr = `0x${randomHex(40)}`;
      setWalletAddress(addr);
      setConnected(true);
      setConnecting(false);
      log(`Connected to wallet ${addr.slice(0, 6)}…${addr.slice(-4)} (demo mode).`);
    }, 900);
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!connected) {
      setFormError("Connect your wallet before sending.");
      return;
    }
    const trimmed = recipient.trim();
    if (trimmed.length < 20) {
      setFormError("Enter a valid recipient USDT address.");
      return;
    }
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setFormError("Enter an amount greater than 0.");
      return;
    }

    const net = NETWORKS.find((n) => n.id === network)!;
    setStatus("sending");
    setProgress(0);
    log(`Preparing transfer of ${value.toLocaleString()} USDT on ${net.label}…`);

    const steps = [
      { at: 400, pct: 15, msg: "Validating recipient address…" },
      { at: 1100, pct: 40, msg: "Signing transaction with connected wallet…" },
      { at: 1900, pct: 70, msg: `Broadcasting to ${net.label} network…` },
      { at: 2700, pct: 90, msg: "Awaiting confirmation…" },
    ];

    steps.forEach((s) =>
      schedule(() => {
        setProgress(s.pct);
        log(s.msg);
      }, s.at),
    );

    schedule(() => {
      const hash = randomHex(64);
      setProgress(100);
      setStatus("completed");
      log(hash.slice(0, 5));
      log(`Verify Transfer on ${net.label.charAt(0) + net.label.slice(1).toLowerCase()}scan using this link…`);
      log(`${net.explorer}${trimmed}`);
      log("Completed");
    }, 3400);
  }

  const sending = status === "sending";

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md sm:p-8">
      {/* Wallet header */}
      <div className="flex flex-col gap-6 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-5">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#26a17b] shadow-[0_0_30px_rgba(38,161,123,0.55)]">
            <TetherMark className="h-9 w-9 text-white" />
          </span>
          <div>
            <h2 className="text-xl font-bold tracking-wide text-white">
              USDT SENDER
            </h2>
            <p className="mt-1 text-sm text-white/70">Connect to your Wallet</p>
            <p className="text-sm text-white/70">Start Sending USDT (Tether)</p>
            <button
              type="button"
              onClick={handleConnect}
              disabled={connecting}
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15 disabled:opacity-60"
            >
              {connecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wallet className="h-4 w-4" />
              )}
              {connected ? "Disconnect Wallet" : "Connect to Wallet"}
            </button>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${
              connected
                ? "border-brand-glow/40 bg-brand/15 text-brand-glow"
                : "border-white/15 bg-white/5 text-white/60"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                connected
                  ? "bg-brand-glow shadow-[0_0_10px_rgba(74,222,128,0.9)]"
                  : "bg-white/40"
              }`}
            />
            {connected ? "Connected to Wallet" : "Wallet not connected"}
          </span>
          {walletAddress && (
            <span className="font-mono text-xs text-white/50">
              {walletAddress.slice(0, 10)}…{walletAddress.slice(-8)}
            </span>
          )}
        </div>
      </div>

      {/* Transfer form */}
      <form onSubmit={handleSend} className="border-b border-white/10 py-6">
        <div className="grid gap-5">
          <Field label="Recipient USDT Address :">
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Paste recipient wallet address"
              spellCheck={false}
              className="auth-field h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 font-mono text-sm text-white outline-none transition placeholder:text-white/40 focus:border-brand-glow/60 focus:bg-white/10"
            />
          </Field>

          <Field label="Amount :">
            <div className="relative w-full sm:max-w-xs">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                placeholder="0.00"
                className="auth-field h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 pr-16 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-brand-glow/60 focus:bg-white/10"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-white/50">
                USDT
              </span>
            </div>
          </Field>

          <Field label="Network :">
            <div
              role="radiogroup"
              aria-label="Network"
              className="flex flex-wrap gap-x-6 gap-y-3"
            >
              {NETWORKS.map((n) => {
                const active = network === n.id;
                return (
                  <label
                    key={n.id}
                    className="inline-flex cursor-pointer items-center gap-2 text-sm text-white/80"
                  >
                    <input
                      type="radio"
                      name="network"
                      value={n.id}
                      checked={active}
                      onChange={() => setNetwork(n.id)}
                      className="peer sr-only"
                    />
                    <span
                      className={`flex h-4.5 w-4.5 items-center justify-center rounded-full border transition ${
                        active
                          ? "border-brand-glow"
                          : "border-white/35 peer-focus-visible:border-white"
                      }`}
                    >
                      {active && (
                        <span className="h-2.5 w-2.5 rounded-full bg-brand-glow shadow-[0_0_8px_rgba(74,222,128,0.9)]" />
                      )}
                    </span>
                    <span className={active ? "font-semibold text-white" : ""}>
                      {n.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </Field>

          <Field label="">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={sending}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-8 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_rgba(22,163,74,0.9)] transition hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Send
              </button>

              <div className="flex-1">
                <div className="relative h-8 w-full overflow-hidden rounded-lg border border-white/10 bg-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-brand to-brand-glow transition-[width] duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                    {progress}%
                  </span>
                </div>
                <p className="mt-1 text-center text-xs text-white/60">
                  {status === "completed" && (
                    <span className="inline-flex items-center gap-1 text-brand-glow">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                    </span>
                  )}
                  {status === "sending" && "Processing…"}
                  {status === "idle" && "Ready"}
                </p>
              </div>
            </div>
            {formError && (
              <p className="mt-2 text-sm text-red-300" role="alert">
                {formError}
              </p>
            )}
          </Field>
        </div>
      </form>

      {/* Process logs */}
      <div className="grid gap-3 pt-6 sm:grid-cols-[180px_1fr] sm:gap-6">
        <div className="flex items-start gap-2 text-sm font-medium text-white/80">
          <Terminal className="mt-0.5 h-4 w-4 text-brand-glow" />
          Process Logs :
        </div>
        <div
          ref={logRef}
          className="h-44 overflow-y-auto rounded-xl border border-white/10 bg-black/30 p-4 font-mono text-xs leading-relaxed text-white/80"
        >
          {logs.map((line, i) =>
            line.startsWith("http") ? (
              <a
                key={i}
                href={line}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 break-all text-teal underline-offset-2 hover:underline"
              >
                <Link2 className="h-3 w-3 shrink-0" />
                {line}
              </a>
            ) : (
              <div key={i} className="break-all">
                {line}
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid items-center gap-2 sm:grid-cols-[180px_1fr] sm:gap-6">
      <span className="text-sm font-medium text-white/80">{label}</span>
      <div>{children}</div>
    </div>
  );
}

function TetherMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M4 4h16v3.6h-6.1v2.05c3.55.16 6.2.83 6.2 1.63 0 .8-2.65 1.47-6.2 1.63V20H9.9v-7.09c-3.55-.16-6.2-.83-6.2-1.63 0-.8 2.65-1.47 6.2-1.63V7.6H4V4zm5.9 6.02c-3.03.14-5.2.6-5.2 1.13 0 .53 2.17.99 5.2 1.13v1.04c.63.03 1.32.05 2.1.05.78 0 1.47-.02 2.1-.05V12.3c3.03-.14 5.2-.6 5.2-1.13 0-.53-2.17-.99-5.2-1.13v.9c-.63.03-1.32.05-2.1.05-.78 0-1.47-.02-2.1-.05v-.9z" />
    </svg>
  );
}
