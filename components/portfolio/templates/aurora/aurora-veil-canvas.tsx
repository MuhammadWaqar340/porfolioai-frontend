"use client";

import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, Preload } from "@react-three/drei";
import { Component, type ReactNode } from "react";
import { AuroraVeilScene } from "@/components/portfolio/templates/aurora/aurora-veil-scene";
import type { RenderTier, ViewportBand } from "@/hooks/use-webgl-capability";

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
      console.warn("[AuroraVeilCanvas] falling back to 2D:", error);
    }
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

interface AuroraVeilCanvasProps {
  tier: RenderTier;
  band: ViewportBand;
  fogColor: string;
}

export default function AuroraVeilCanvas({
  tier,
  band,
  fogColor,
}: AuroraVeilCanvasProps) {
  const maxDpr = tier === "high" ? 1.75 : tier === "medium" ? 1.35 : 1.1;
  const z = band === "mobile" ? 9.5 : band === "tablet" ? 8.6 : 8;

  return (
    <CanvasErrorBoundary>
      <Canvas
        dpr={[1, maxDpr]}
        gl={{
          antialias: tier !== "low",
          alpha: true,
          powerPreference: tier === "low" ? "low-power" : "high-performance",
          stencil: false,
        }}
        camera={{
          position: [0, 0, z],
          fov: band === "mobile" ? 52 : 44,
          near: 0.1,
          far: 40,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <AuroraVeilScene tier={tier} fogColor={fogColor} />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <Preload all />
      </Canvas>
    </CanvasErrorBoundary>
  );
}
