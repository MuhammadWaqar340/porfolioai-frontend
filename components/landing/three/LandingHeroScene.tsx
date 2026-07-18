"use client";

import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import type { PointLight } from "three";
import { FloatingHolograms } from "@/components/landing/three/FloatingHolograms";
import type { RenderTier, ViewportBand } from "@/hooks/use-webgl-capability";

function ParallaxRig({
  strength = 1,
  scrollProgress,
  band,
}: {
  strength?: number;
  scrollProgress: RefObject<number>;
  band: ViewportBand;
}) {
  useFrame((state, delta) => {
    const { camera, pointer } = state;
    const progress = scrollProgress.current ?? 0;
    // Touch devices: almost no pointer parallax (pointer is sticky / unused).
    const pointerMul = band === "mobile" ? 0.15 : band === "tablet" ? 0.55 : 1;
    const scrollMul = band === "mobile" ? 2.2 : 3.2;
    const baseZ = band === "mobile" ? 9.2 : band === "tablet" ? 8.4 : 8;

    const targetX = pointer.x * 0.55 * strength * pointerMul;
    const targetY = pointer.y * 0.35 * strength * pointerMul;
    const targetZ = baseZ - progress * scrollMul;
    const lerp = 1 - Math.pow(0.05, delta);
    camera.position.x += (targetX - camera.position.x) * lerp;
    camera.position.y += (targetY - camera.position.y) * lerp;
    camera.position.z += (targetZ - camera.position.z) * lerp;
    camera.rotation.z +=
      (-pointer.x * 0.018 * pointerMul - camera.rotation.z) * lerp;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function SoftLights({ enabled }: { enabled: boolean }) {
  const a = useRef<PointLight>(null);
  const b = useRef<PointLight>(null);
  useFrame((state) => {
    if (!enabled) return;
    const t = state.clock.elapsedTime;
    if (a.current) {
      a.current.position.set(Math.sin(t * 0.2) * 5, Math.cos(t * 0.18) * 2.5, -2);
    }
    if (b.current) {
      b.current.position.set(
        Math.cos(t * 0.15) * -5,
        Math.sin(t * 0.22) * 3,
        0.5,
      );
    }
  });
  if (!enabled) {
    return (
      <>
        <pointLight position={[4, 2, -2]} color="#a78bfa" intensity={14} distance={24} />
        <pointLight position={[-4, 1, 0]} color="#818cf8" intensity={10} distance={22} />
      </>
    );
  }
  return (
    <>
      <pointLight ref={a} color="#a78bfa" intensity={22} distance={28} />
      <pointLight ref={b} color="#818cf8" intensity={16} distance={26} />
    </>
  );
}

interface LandingHeroSceneProps {
  tier: RenderTier;
  band: ViewportBand;
  allowPostProcessing: boolean;
  scrollProgress: RefObject<number>;
}

export function LandingHeroScene({
  tier,
  band,
  allowPostProcessing,
  scrollProgress,
}: LandingHeroSceneProps) {
  const parallaxStrength =
    band === "mobile" ? 0.35 : tier === "high" ? 0.85 : 0.5;

  return (
    <>
      <fog
        attach="fog"
        args={
          band === "mobile" ? ["#0f0b1a", 10, 32] : ["#0f0b1a", 14, 40]
        }
      />
      <ambientLight intensity={band === "mobile" ? 0.5 : 0.42} />
      <directionalLight
        position={[4, 5, 4]}
        intensity={band === "mobile" ? 0.4 : 0.55}
        color="#e2e8f0"
      />
      <SoftLights enabled={band !== "mobile"} />

      <FloatingHolograms tier={tier} band={band} />

      <ParallaxRig
        strength={parallaxStrength}
        scrollProgress={scrollProgress}
        band={band}
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
