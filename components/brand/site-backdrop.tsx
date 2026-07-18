"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useWebGLCapability } from "@/hooks/use-webgl-capability";
import { cn } from "@/lib/utils";

const HeroCanvas = dynamic(
  () => import("@/components/landing/three/HeroCanvas"),
  { ssr: false },
);

/**
 * Shared full-page 3D backdrop used by landing-adjacent pages
 * (Discover, auth). Matches the landing hologram + aurora look.
 */
export function SiteBackdrop() {
  const { canRender3D, tier, band, allowPostProcessing } = useWebGLCapability();
  const reducedMotion = useReducedMotion();
  const scrollProgress = useRef(0);

  useEffect(() => {
    if (!canRender3D) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current =
        max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [canRender3D]);

  const particles = useMemo(
    () =>
      Array.from({ length: band === "mobile" ? 10 : 22 }, (_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        top: `${(i * 53) % 100}%`,
        size: 1.2 + (i % 3) * 0.7,
        duration: 12 + (i % 6) * 1.8,
        delay: (i % 5) * 0.45,
      })),
    [band],
  );

  const sceneTier =
    !canRender3D || tier === "none" ? "low" : tier === "high" ? "medium" : tier;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-15%,var(--hero-glow),transparent_60%)]" />
      <div className="absolute inset-0 app-mesh opacity-45 dark:opacity-55" />

      {!reducedMotion ? (
        <>
          <motion.div
            className="absolute -left-[12%] top-[8%] h-[40vw] w-[40vw] rounded-full bg-primary/14 blur-3xl dark:bg-primary/20"
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-[10%] top-[35%] h-[34vw] w-[34vw] rounded-full bg-violet-500/12 blur-3xl dark:bg-violet-400/16"
            animate={{ x: [0, -25, 0], y: [0, 18, 0] }}
            transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[-8%] left-[30%] h-[30vw] w-[30vw] rounded-full bg-indigo-400/10 blur-3xl"
            animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.08, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      ) : null}

      {!reducedMotion
        ? particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute rounded-full bg-primary/40 dark:bg-primary/50"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.12, 0.45, 0.12],
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

      {canRender3D ? (
        <div
          className={cn(
            "absolute inset-0",
            band === "mobile" && "opacity-40",
            band === "tablet" && "opacity-55",
            band === "desktop" && "opacity-70",
          )}
        >
          <HeroCanvas
            tier={sceneTier}
            band={band}
            allowPostProcessing={allowPostProcessing && band === "desktop"}
            scrollProgress={scrollProgress}
          />
        </div>
      ) : null}

      <div className="landing-noise absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-background via-background/50 to-transparent" />
    </div>
  );
}
