"use client";

import { motion } from "motion/react";
import { useId } from "react";

const SIZE = 112;
const RADIUS = 22;
const SPLIT = 46;
const MERGE_GAP = 3.5;

function roundedPolygonPath(points: [number, number][], radius: number) {
  const n = points.length;
  const parts: string[] = [];

  for (let i = 0; i < n; i++) {
    const prev = points[(i + n - 1) % n];
    const curr = points[i];
    const next = points[(i + 1) % n];
    const v1x = prev[0] - curr[0];
    const v1y = prev[1] - curr[1];
    const v2x = next[0] - curr[0];
    const v2y = next[1] - curr[1];
    const len1 = Math.hypot(v1x, v1y) || 1;
    const len2 = Math.hypot(v2x, v2y) || 1;
    const r = Math.min(radius, len1 / 2.15, len2 / 2.15);
    const startX = curr[0] + (v1x / len1) * r;
    const startY = curr[1] + (v1y / len1) * r;
    const endX = curr[0] + (v2x / len2) * r;
    const endY = curr[1] + (v2y / len2) * r;
    parts.push(i === 0 ? `M ${startX} ${startY}` : `L ${startX} ${startY}`);
    parts.push(`Q ${curr[0]} ${curr[1]} ${endX} ${endY}`);
  }

  parts.push("Z");
  return parts.join(" ");
}

const NW_PATH = roundedPolygonPath(
  [
    [8, 8],
    [88, 8],
    [8, 88],
  ],
  RADIUS,
);

const SE_PATH = roundedPolygonPath(
  [
    [88, 8],
    [88, 88],
    [8, 88],
  ],
  RADIUS,
);

const easeOut = [0.22, 1, 0.36, 1] as const;

export function AuthMorphMark() {
  const rawId = useId().replace(/:/g, "");
  const glowId = `auth-mark-glow-${rawId}`;

  return (
    <div className="relative flex min-h-[280px] w-full flex-1 items-center justify-center" aria-hidden>
      <motion.div
        className="relative"
        initial={{ scale: 0.96 }}
        animate={{
          scale: [0.96, 1, 1.14, 1],
          filter: [
            "drop-shadow(0 0 0 rgba(74,222,128,0))",
            "drop-shadow(0 0 0 rgba(74,222,128,0))",
            "drop-shadow(0 0 32px rgba(74,222,128,0.95))",
            "drop-shadow(0 0 10px rgba(74,222,128,0.25))",
          ],
        }}
        transition={{ duration: 1.15, times: [0, 0.4, 0.58, 1], ease: easeOut }}
      >
        <svg width={SIZE} height={SIZE} viewBox="0 0 96 96" className="overflow-visible">
          <defs>
            <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="1.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <motion.path
            d={NW_PATH}
            fill="rgba(74, 222, 128, 0.38)"
            stroke="rgba(230, 244, 241, 0.45)"
            strokeWidth="1.2"
            filter={`url(#${glowId})`}
            initial={{ x: -SPLIT, y: -SPLIT, opacity: 0 }}
            animate={{
              x: [-SPLIT, -SPLIT, -SPLIT, -MERGE_GAP],
              y: [-SPLIT, -SPLIT, -SPLIT, -MERGE_GAP],
              opacity: [0, 1, 1, 1],
            }}
            transition={{ duration: 1.05, times: [0, 0.14, 0.42, 1], ease: easeOut }}
          />
          <motion.path
            d={SE_PATH}
            fill="rgba(34, 211, 238, 0.28)"
            stroke="rgba(230, 244, 241, 0.4)"
            strokeWidth="1.2"
            filter={`url(#${glowId})`}
            initial={{ x: SPLIT, y: SPLIT, opacity: 0 }}
            animate={{
              x: [SPLIT, SPLIT, SPLIT, MERGE_GAP],
              y: [SPLIT, SPLIT, SPLIT, MERGE_GAP],
              opacity: [0, 1, 1, 1],
            }}
            transition={{ duration: 1.05, times: [0, 0.14, 0.42, 1], ease: easeOut, delay: 0.05 }}
          />
        </svg>

        <LensFlare />
      </motion.div>
    </div>
  );
}

function LensFlare() {
  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-1/2 z-10"
      initial={{ opacity: 0, scale: 0.2 }}
      animate={{
        opacity: [0, 0, 1, 0.7, 0],
        scale: [0.2, 0.2, 1.2, 1.75, 2.2],
      }}
      transition={{ duration: 1.15, times: [0, 0.38, 0.52, 0.74, 1], ease: easeOut }}
      style={{ translateX: "-50%", translateY: "-50%" }}
    >
      <div
        className="h-48 w-48 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(74,222,128,0.9) 16%, rgba(34,211,238,0.45) 38%, rgba(74,222,128,0) 68%)",
        }}
      />
      <span
        className="absolute left-1/2 top-1/2 h-[3px] w-64 -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(74,222,128,0.35), rgba(255,255,255,1), rgba(34,211,238,0.55), transparent)",
        }}
      />
      <span
        className="absolute left-1/2 top-1/2 h-52 w-[3px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(34,211,238,0.35), rgba(255,255,255,0.95), rgba(74,222,128,0.4), transparent)",
        }}
      />
      <span className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-glow/50" />
      <span className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-sm border border-white/40" />
    </motion.div>
  );
}
