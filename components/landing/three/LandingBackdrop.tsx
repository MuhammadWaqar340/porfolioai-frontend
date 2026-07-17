"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { useWebGLCapability } from "@/hooks/use-webgl-capability";

// The Three.js canvas is code-split and never server-rendered, so the 3D
// bundle only downloads on capable clients that actually mount it.
const HeroCanvas = dynamic(
  () => import("@/components/landing/three/HeroCanvas"),
  { ssr: false },
);

/**
 * Single page-wide 3D layer for the whole landing page. It's `fixed` and sits
 * behind every section (which are translucent), so one WebGL context provides
 * the shared 3D background for Hero, Features, Templates, Pricing, CTA and the
 * Contact footer. Renders `null` (CSS fallback) on incapable / reduced-motion
 * devices, and passes pointer events through.
 */
export function LandingBackdrop() {
  const { canRender3D, tier, allowPostProcessing } = useWebGLCapability();
  // Progress (0→1) across the full page, driving the camera dolly as the user
  // travels down through the sections.
  const scrollProgress = useRef(0);

  useEffect(() => {
    if (!canRender3D) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
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

  if (!canRender3D) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: -10, contain: "strict" }}
    >
      <HeroCanvas
        tier={tier}
        allowPostProcessing={allowPostProcessing}
        scrollProgress={scrollProgress}
      />
    </div>
  );
}
