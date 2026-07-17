"use client";

import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import type { PointLight } from "three";
import { NeuralNetwork } from "@/components/landing/three/NeuralNetwork";
import type { RenderTier } from "@/hooks/use-webgl-capability";

/**
 * Eases the camera toward a pointer-driven offset (parallax + tilt) and dollies
 * it deeper on scroll (z 8 → 4) for a cinematic reveal as the hero exits.
 */
function ParallaxRig({
  strength = 1,
  scrollProgress,
}: {
  strength?: number;
  scrollProgress: RefObject<number>;
}) {
  useFrame((state, delta) => {
    const { camera, pointer } = state;
    const progress = scrollProgress.current ?? 0;
    const targetX = pointer.x * 0.8 * strength;
    const targetY = pointer.y * 0.5 * strength;
    const targetZ = 8 - progress * 4;
    // damping ~0.05 feel, frame-rate independent
    const lerp = 1 - Math.pow(0.05, delta);
    camera.position.x += (targetX - camera.position.x) * lerp;
    camera.position.y += (targetY - camera.position.y) * lerp;
    camera.position.z += (targetZ - camera.position.z) * lerp;
    camera.rotation.z += (-pointer.x * 0.03 - camera.rotation.z) * lerp;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/** Two purple point lights slowly orbiting for ambient movement. */
function DriftingLights() {
  const a = useRef<PointLight>(null);
  const b = useRef<PointLight>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (a.current) {
      a.current.position.set(Math.sin(t * 0.3) * 6, Math.cos(t * 0.25) * 3, -2);
    }
    if (b.current) {
      b.current.position.set(Math.cos(t * 0.2) * -6, Math.sin(t * 0.3) * 4, 1);
    }
  });
  return (
    <>
      <pointLight ref={a} color="#8b5cf6" intensity={45} distance={30} />
      <pointLight ref={b} color="#a855f7" intensity={35} distance={30} />
    </>
  );
}

interface LandingHeroSceneProps {
  tier: RenderTier;
  allowPostProcessing: boolean;
  scrollProgress: RefObject<number>;
}

export function LandingHeroScene({
  tier,
  allowPostProcessing,
  scrollProgress,
}: LandingHeroSceneProps) {
  const nodeCount = tier === "high" ? 78 : tier === "medium" ? 48 : 26;
  const signalCount = tier === "high" ? 20 : tier === "medium" ? 12 : 6;

  return (
    <>
      <fog attach="fog" args={["#0f172a", 10, 50]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.1} />
      <DriftingLights />

      {/* Neural-network constellation — the AI-themed centerpiece. */}
      <NeuralNetwork count={nodeCount} signals={signalCount} />

      <ParallaxRig
        strength={tier === "high" ? 1 : 0.6}
        scrollProgress={scrollProgress}
      />

      {allowPostProcessing ? (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom
            intensity={0.9}
            luminanceThreshold={0.25}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      ) : null}
    </>
  );
}
