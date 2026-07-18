"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { useWebGLCapability } from "@/hooks/use-webgl-capability";
import { cn } from "@/lib/utils";

const HeroCanvas = dynamic(
  () => import("@/components/landing/three/HeroCanvas"),
  { ssr: false },
);

/**
 * Page-wide 3D layer. Opacity and density adapt by viewport band so mobile
 * content stays readable while still getting a subtle depth cue.
 */
export function LandingBackdrop() {
  const { canRender3D, tier, band, allowPostProcessing } = useWebGLCapability();
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

  if (!canRender3D) return null;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0",
        band === "mobile" && "opacity-45",
        band === "tablet" && "opacity-70",
        band === "desktop" && "opacity-100",
      )}
      style={{ zIndex: -10, contain: "strict" }}
    >
      <HeroCanvas
        tier={tier}
        band={band}
        allowPostProcessing={allowPostProcessing}
        scrollProgress={scrollProgress}
      />
    </div>
  );
}
