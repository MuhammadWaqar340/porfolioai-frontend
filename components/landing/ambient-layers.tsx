"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Band = "mobile" | "tablet" | "desktop";

function useViewportBand(): Band {
  const [band, setBand] = useState<Band>("desktop");

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 768) setBand("mobile");
      else if (w < 1024) setBand("tablet");
      else setBand("desktop");
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("orientationchange", update, { passive: true });
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return band;
}

/** Soft CSS atmosphere — particle/blob count scales down on smaller screens. */
export function AmbientLayers() {
  const reducedMotion = useReducedMotion();
  const band = useViewportBand();

  const particles = useMemo(() => {
    const count = band === "mobile" ? 8 : band === "tablet" ? 14 : 18;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${(i * 37) % 100}%`,
      top: `${(i * 53) % 100}%`,
      size: 1.2 + (i % 3) * 0.6,
      duration: 14 + (i % 6) * 2,
      delay: (i % 5) * 0.5,
    }));
  }, [band]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-[9] overflow-hidden"
    >
      <div
        className={
          band === "mobile"
            ? "absolute inset-0 app-mesh opacity-20 dark:opacity-30"
            : "absolute inset-0 app-mesh opacity-30 dark:opacity-40"
        }
      />

      {!reducedMotion ? (
        <>
          <motion.div
            className={
              band === "mobile"
                ? "absolute -left-[18%] top-[10%] h-[55vw] w-[55vw] rounded-full bg-primary/8 blur-3xl dark:bg-primary/12"
                : "absolute -left-[10%] top-[12%] h-[34vw] w-[34vw] rounded-full bg-primary/10 blur-3xl dark:bg-primary/14"
            }
            animate={{ x: [0, 24, 0], y: [0, -18, 0] }}
            transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          />
          {band !== "mobile" ? (
            <motion.div
              className="absolute -right-[8%] top-[38%] h-[28vw] w-[28vw] rounded-full bg-violet-500/8 blur-3xl dark:bg-violet-400/12"
              animate={{ x: [0, -20, 0], y: [0, 16, 0] }}
              transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : null}
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
