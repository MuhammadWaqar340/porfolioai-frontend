"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, Preload } from "@react-three/drei";
import { Component, useEffect, type ReactNode, type RefObject } from "react";
import { LandingHeroScene } from "@/components/landing/three/LandingHeroScene";
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
      console.warn("[HeroCanvas] falling back to 2D:", error);
    }
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Keeps camera FOV / distance tuned as the canvas resizes. */
function ResponsiveCamera({ band }: { band: ViewportBand }) {
  const { camera, size } = useThree();

  useEffect(() => {
    const cam = camera as import("three").PerspectiveCamera;
    if (!("isPerspectiveCamera" in cam) || !cam.isPerspectiveCamera) return;

    if (band === "mobile") {
      cam.fov = size.height > size.width ? 58 : 50;
      cam.position.z = 9.2;
    } else if (band === "tablet") {
      cam.fov = 48;
      cam.position.z = 8.4;
    } else {
      cam.fov = 45;
      cam.position.z = 8;
    }
    cam.updateProjectionMatrix();
  }, [band, camera, size.width, size.height]);

  return null;
}

interface HeroCanvasProps {
  tier: RenderTier;
  band: ViewportBand;
  allowPostProcessing: boolean;
  scrollProgress: RefObject<number>;
}

export default function HeroCanvas({
  tier,
  band,
  allowPostProcessing,
  scrollProgress,
}: HeroCanvasProps) {
  const maxDpr = tier === "high" ? 2 : tier === "medium" ? 1.5 : 1.15;

  return (
    <CanvasErrorBoundary>
      <Canvas
        dpr={[1, maxDpr]}
        gl={{
          antialias: tier === "high",
          alpha: true,
          powerPreference: tier === "low" ? "low-power" : "high-performance",
          stencil: false,
        }}
        camera={{
          position: [0, 0, band === "mobile" ? 9.2 : 8],
          fov: band === "mobile" ? 56 : 45,
          near: 0.1,
          far: 100,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <ResponsiveCamera band={band} />
        <LandingHeroScene
          tier={tier}
          band={band}
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
