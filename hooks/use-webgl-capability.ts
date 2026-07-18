"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Rendering tiers for immersive 3D.
 * - `none`   : no WebGL / reduced motion / SSR / save-data → CSS fallback
 * - `low`    : phones / weak GPU → minimal scene, no postprocessing
 * - `medium` : tablets / integrated GPUs → lighter scene
 * - `high`   : desktop with a capable GPU → full scene + bloom
 */
export type RenderTier = "none" | "low" | "medium" | "high";

export type ViewportBand = "mobile" | "tablet" | "desktop";

export interface WebGLCapability {
  ready: boolean;
  tier: RenderTier;
  band: ViewportBand;
  canRender3D: boolean;
  allowPostProcessing: boolean;
}

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

function detectBand(): ViewportBand {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function detectTier(band: ViewportBand): RenderTier {
  if (!detectWebGL()) return "none";

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    hardwareConcurrency?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };

  if (nav.connection?.saveData) return "none";
  if (
    nav.connection?.effectiveType === "2g" ||
    nav.connection?.effectiveType === "slow-2g"
  ) {
    return "none";
  }

  const memory = nav.deviceMemory ?? 4;
  const cores = nav.hardwareConcurrency ?? 4;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  if (band === "mobile") {
    if (memory <= 2 || cores <= 2) return "none";
    return "low";
  }

  if (band === "tablet" || (coarsePointer && memory <= 4)) {
    return memory <= 4 || cores <= 4 ? "low" : "medium";
  }

  if (memory <= 4 || cores <= 4) return "medium";
  return "high";
}

/**
 * Progressive-enhancement probe. Re-evaluates on resize / orientation change
 * so the scene stays appropriate for the current device class.
 */
export function useWebGLCapability(): WebGLCapability {
  const reducedMotion = useReducedMotion();
  const [tier, setTier] = useState<RenderTier>("none");
  const [band, setBand] = useState<ViewportBand>("desktop");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const update = () => {
      const nextBand = detectBand();
      setBand(nextBand);
      setTier(detectTier(nextBand));
      setReady(true);
    };

    update();

    let resizeFrame = 0;
    const onResize = () => {
      if (resizeFrame) return;
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        update();
      });
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });

    const mqMobile = window.matchMedia("(max-width: 767px)");
    const mqTablet = window.matchMedia("(max-width: 1023px)");
    mqMobile.addEventListener("change", update);
    mqTablet.addEventListener("change", update);

    return () => {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      mqMobile.removeEventListener("change", update);
      mqTablet.removeEventListener("change", update);
    };
  }, []);

  const effectiveTier: RenderTier = reducedMotion ? "none" : tier;

  return {
    ready,
    tier: effectiveTier,
    band,
    canRender3D: ready && effectiveTier !== "none",
    allowPostProcessing: effectiveTier === "high",
  };
}
