"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useWebGLCapability } from "@/hooks/use-webgl-capability";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const AuroraVeilCanvas = dynamic(
  () => import("@/components/portfolio/templates/aurora/aurora-veil-canvas"),
  { ssr: false },
);

interface AuroraVeilBackdropProps {
  /** Skip WebGL in dashboard embeds / compact previews. */
  embedded?: boolean;
  className?: string;
}

/**
 * Aurora-only atmospheric backdrop: CSS veil washes + optional WebGL ribbons.
 * Intentionally different from SiteBackdrop holograms.
 */
export function AuroraVeilBackdrop({
  embedded = false,
  className,
}: AuroraVeilBackdropProps) {
  const { canRender3D, tier, band } = useWebGLCapability();
  const reducedMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const fogColor = isDark ? "#0c0a0f" : "#faf9f7";

  // Tablet+ get WebGL ribbons; mobile / embed / reduced-motion stay CSS-only.
  const useCanvas =
    !embedded &&
    !reducedMotion &&
    canRender3D &&
    tier !== "none" &&
    band !== "mobile";

  const canvasTier = tier === "high" ? "medium" : tier === "none" ? "low" : tier;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none z-0 overflow-hidden",
        embedded ? "absolute inset-0" : "fixed inset-0",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[#faf9f7] dark:bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,oklch(0.72_0.12_320/18%),transparent_55%)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,oklch(0.45_0.14_320/22%),transparent_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(145deg,oklch(0.55_0.14_320/6%)_0%,transparent_40%,oklch(0.7_0.12_25/7%)_100%)]" />

      {!reducedMotion ? (
        <>
          <motion.div
            className="absolute -left-[18%] top-[5%] h-[48vw] max-h-[520px] w-[48vw] max-w-[520px] rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-500/18"
            animate={{
              x: [0, 36, 0],
              y: [0, -22, 0],
              opacity: [0.35, 0.55, 0.35],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-[14%] top-[28%] h-[42vw] max-h-[460px] w-[42vw] max-w-[460px] rounded-full bg-rose-300/18 blur-3xl dark:bg-rose-400/14"
            animate={{ x: [0, -28, 0], y: [0, 20, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[-8%] left-[30%] h-[36vw] max-h-[400px] w-[36vw] max-w-[400px] rounded-full bg-indigo-300/12 blur-3xl dark:bg-indigo-400/12"
            animate={{
              x: [0, 18, 0],
              y: [0, -14, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute left-[-10%] top-[35%] h-24 w-[70%] -rotate-12 rounded-full bg-gradient-to-r from-transparent via-violet-400/25 to-transparent blur-2xl dark:via-violet-400/20"
            animate={{
              x: ["-5%", "8%", "-5%"],
              opacity: [0.35, 0.55, 0.35],
            }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[-8%] top-[55%] h-20 w-[55%] rotate-6 rounded-full bg-gradient-to-r from-transparent via-rose-300/22 to-transparent blur-2xl dark:via-rose-400/16"
            animate={{
              x: ["5%", "-6%", "5%"],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      ) : null}

      {useCanvas ? (
        <div className="absolute inset-0 opacity-70 dark:opacity-55">
          <AuroraVeilCanvas
            tier={canvasTier}
            band={band}
            fogColor={fogColor}
          />
        </div>
      ) : null}

      <div className="absolute inset-0 bg-[#faf9f7]/55 dark:bg-background/60" />
    </div>
  );
}
