"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Soft CSS atmosphere under the WebGL scene — calm, low-contrast. */
export function AmbientLayers() {
  const reducedMotion = useReducedMotion();
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        top: `${(i * 53) % 100}%`,
        size: 1.2 + (i % 3) * 0.6,
        duration: 14 + (i % 6) * 2,
        delay: (i % 5) * 0.5,
      })),
    [],
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-[9] overflow-hidden"
    >
      <div className="absolute inset-0 app-mesh opacity-30 dark:opacity-40" />

      {!reducedMotion ? (
        <>
          <motion.div
            className="absolute -left-[10%] top-[12%] h-[34vw] w-[34vw] rounded-full bg-primary/10 blur-3xl dark:bg-primary/14"
            animate={{ x: [0, 24, 0], y: [0, -18, 0] }}
            transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-[8%] top-[38%] h-[28vw] w-[28vw] rounded-full bg-violet-500/8 blur-3xl dark:bg-violet-400/12"
            animate={{ x: [0, -20, 0], y: [0, 16, 0] }}
            transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      ) : null}

      {!reducedMotion
        ? particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute rounded-full bg-primary/30 dark:bg-primary/35"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
              }}
              animate={{
                y: [0, -16, 0],
                opacity: [0.1, 0.35, 0.1],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))
        : null}

      <div className="landing-noise absolute inset-0 opacity-[0.025] dark:opacity-[0.04]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/45 to-transparent" />
    </div>
  );
}
