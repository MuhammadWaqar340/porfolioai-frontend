"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Rendering tiers for immersive 3D.
 * - `none`   : no WebGL / reduced motion / SSR → 2D fallback only
 * - `low`    : mobile or weak GPU → minimal scene, no postprocessing
 * - `medium` : capable tablets / integrated GPUs → scene + light effects
 * - `high`   : desktop with a real GPU → full scene, bloom
 */
export type RenderTier = "none" | "low" | "medium" | "high";

export interface WebGLCapability {
  /** Becomes true only after the client-side probe has run. */
  ready: boolean;
  tier: RenderTier;
  /** Convenience flag: should we mount the R3F canvas at all? */
  canRender3D: boolean;
  /** Whether expensive postprocessing (bloom) is affordable. */
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

function detectTier(): RenderTier {
  if (!detectWebGL()) return "none";

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    hardwareConcurrency?: number;
  };
  const memory = nav.deviceMemory ?? 4;
  const cores = nav.hardwareConcurrency ?? 4;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.matchMedia("(max-width: 767px)").matches;

  if (narrow || (coarsePointer && memory <= 4)) return "low";
  if (memory <= 4 || cores <= 4) return "medium";
  return "high";
}

/**
 * Progressive-enhancement probe. Starts as `none` (safe for SSR / hydration)
 * and upgrades on the client once we can measure the device.
 */
export function useWebGLCapability(): WebGLCapability {
  const reducedMotion = useReducedMotion();
  const [tier, setTier] = useState<RenderTier>("none");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTier(detectTier());
    setReady(true);
  }, []);

  const effectiveTier: RenderTier = reducedMotion ? "none" : tier;

  return {
    ready,
    tier: effectiveTier,
    canRender3D: ready && effectiveTier !== "none",
    allowPostProcessing: effectiveTier === "high",
  };
}
