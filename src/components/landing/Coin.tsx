"use client";

import { motion, type Transition } from "motion/react";
import { useEffect, useRef, useState } from "react";

type CoinProps = {
  /** Shared layout id so the coin can travel between intro and hero. */
  layoutId: string;
  src: string;
  fallbackSrc?: string;
  alt: string;
  size?: number;
  className?: string;
  /** Float parameters (px / deg / seconds). */
  floatY?: number;
  floatRotate?: number;
  floatDuration?: number;
  /** Delay before the first float cycle starts. */
  floatDelay?: number;
  /** Extra one-off entrance keyframes for the intro stage. */
  entrance?: {
    from: { x?: number; y?: number; scale?: number; rotate?: number };
    duration?: number;
    delay?: number;
  };
  layoutTransition?: Transition;
};

export function Coin({
  layoutId,
  src,
  fallbackSrc,
  alt,
  size,
  className,
  floatY = 18,
  floatRotate = 6,
  floatDuration = 3.2,
  floatDelay = 0,
  entrance,
  layoutTransition,
}: CoinProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // The image may finish loading (or failing) before React hydrates, in which
  // case onLoad/onError never fire. Reconcile with the DOM state on mount.
  useEffect(() => {
    const img = imgRef.current;
    if (!img || !img.complete) return;
    if (img.naturalWidth > 0) {
      setLoaded(true);
    } else if (fallbackSrc && img.src !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
  }, [fallbackSrc, currentSrc]);

  return (
    <motion.div
      layoutId={layoutId}
      layout
      className={className}
      style={size ? { width: size, height: size } : undefined}
      transition={
        layoutTransition ?? {
          layout: { type: "spring", stiffness: 70, damping: 16, mass: 1.1 },
        }
      }
    >
      <motion.div
        className="relative h-full w-full"
        initial={
          entrance
            ? {
                opacity: 0,
                x: entrance.from.x ?? 0,
                y: entrance.from.y ?? 0,
                scale: entrance.from.scale ?? 0.4,
                rotate: entrance.from.rotate ?? 0,
              }
            : false
        }
        animate={{
          opacity: 1,
          x: 0,
          y: [0, -floatY, 0, floatY * 0.5, 0],
          scale: 1,
          rotate: [0, floatRotate, 0, -floatRotate, 0],
        }}
        transition={{
          opacity: { duration: entrance?.duration ?? 0.8, delay: entrance?.delay ?? 0 },
          x: { duration: entrance?.duration ?? 0.8, delay: entrance?.delay ?? 0, ease: "easeOut" },
          scale: {
            type: "spring",
            stiffness: 120,
            damping: 14,
            delay: entrance?.delay ?? 0,
          },
          y: {
            duration: floatDuration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: (entrance?.delay ?? 0) + floatDelay,
          },
          rotate: {
            duration: floatDuration * 1.35,
            repeat: Infinity,
            ease: "easeInOut",
            delay: (entrance?.delay ?? 0) + floatDelay,
          },
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => {
            if (fallbackSrc && currentSrc !== fallbackSrc) {
              setCurrentSrc(fallbackSrc);
            }
          }}
          className={`coin-shadow h-full w-full select-none object-contain transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </motion.div>
    </motion.div>
  );
}
