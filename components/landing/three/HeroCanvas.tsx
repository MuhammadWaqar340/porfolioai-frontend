"use client";

import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, Preload } from "@react-three/drei";
import { Component, type ReactNode, type RefObject } from "react";
import { LandingHeroScene } from "@/components/landing/three/LandingHeroScene";
import type { RenderTier } from "@/hooks/use-webgl-capability";

/** Silently drops the 3D layer on any WebGL/driver error — never a blank hero. */
class CanvasErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[HeroCanvas] falling back to 2D:", error);
    }
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

interface HeroCanvasProps {
  tier: RenderTier;
  allowPostProcessing: boolean;
  scrollProgress: RefObject<number>;
}

export default function HeroCanvas({
  tier,
  allowPostProcessing,
  scrollProgress,
}: HeroCanvasProps) {
  return (
    <CanvasErrorBoundary>
      <Canvas
        dpr={[1, tier === "high" ? 2 : 1.5]}
        gl={{
          antialias: tier === "high",
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 100 }}
      >
        <LandingHeroScene
          tier={tier}
          allowPostProcessing={allowPostProcessing}
          scrollProgress={scrollProgress}
        />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <Preload all />
      </Canvas>
    </CanvasErrorBoundary>
  );
}
