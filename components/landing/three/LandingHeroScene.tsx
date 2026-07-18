"use client";

import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import type { PointLight } from "three";
import { FloatingHolograms } from "@/components/landing/three/FloatingHolograms";
import type { RenderTier } from "@/hooks/use-webgl-capability";

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
    const targetX = pointer.x * 0.55 * strength;
    const targetY = pointer.y * 0.35 * strength;
    const targetZ = 8 - progress * 3.2;
    const lerp = 1 - Math.pow(0.05, delta);
    camera.position.x += (targetX - camera.position.x) * lerp;
    camera.position.y += (targetY - camera.position.y) * lerp;
    camera.position.z += (targetZ - camera.position.z) * lerp;
    camera.rotation.z += (-pointer.x * 0.018 - camera.rotation.z) * lerp;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function SoftLights() {
  const a = useRef<PointLight>(null);
  const b = useRef<PointLight>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (a.current) {
      a.current.position.set(Math.sin(t * 0.2) * 5, Math.cos(t * 0.18) * 2.5, -2);
    }
    if (b.current) {
      b.current.position.set(Math.cos(t * 0.15) * -5, Math.sin(t * 0.22) * 3, 0.5);
    }
  });
  return (
    <>
      <pointLight ref={a} color="#a78bfa" intensity={22} distance={28} />
      <pointLight ref={b} color="#818cf8" intensity={16} distance={26} />
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
  return (
    <>
      <fog attach="fog" args={["#0f0b1a", 14, 40]} />
      <ambientLight intensity={0.42} />
      <directionalLight position={[4, 5, 4]} intensity={0.55} color="#e2e8f0" />
      <SoftLights />

      <FloatingHolograms tier={tier} />

      <ParallaxRig
        strength={tier === "high" ? 0.85 : 0.5}
        scrollProgress={scrollProgress}
      />

      {allowPostProcessing ? (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom
            intensity={0.45}
            luminanceThreshold={0.35}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      ) : null}
    </>
  );
}
