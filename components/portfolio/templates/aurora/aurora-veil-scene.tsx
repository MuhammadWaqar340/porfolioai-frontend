"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  AdditiveBlending,
  CanvasTexture,
  DoubleSide,
  Group,
  MathUtils,
  Mesh,
  PlaneGeometry,
  Sprite,
} from "three";
import type { RenderTier } from "@/hooks/use-webgl-capability";

function makeSoftSprite(): CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  g.addColorStop(0, "rgba(255,255,255,0.95)");
  g.addColorStop(0.35, "rgba(196,181,253,0.45)");
  g.addColorStop(1, "rgba(244,63,94,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

interface RibbonProps {
  color: string;
  width: number;
  height: number;
  position: [number, number, number];
  rotation: [number, number, number];
  speed: number;
  phase: number;
  opacity: number;
}

/** Soft translucent ribbon that gently undulates. */
function Ribbon({
  color,
  width,
  height,
  position,
  rotation,
  speed,
  phase,
  opacity,
}: RibbonProps) {
  const mesh = useRef<Mesh>(null);
  const geometry = useMemo(
    () => new PlaneGeometry(width, height, 48, 12),
    [width, height],
  );
  const base = useMemo(() => {
    const pos = geometry.attributes.position;
    const arr = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) {
      arr[i] = pos.getZ(i);
    }
    return arr;
  }, [geometry]);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + phase;
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const wave =
        Math.sin(x * 0.55 + t) * 0.28 +
        Math.cos(y * 0.9 + t * 0.7) * 0.12 +
        Math.sin((x + y) * 0.35 + t * 0.5) * 0.1;
      pos.setZ(i, base[i]! + wave);
    }
    pos.needsUpdate = true;

    if (mesh.current) {
      mesh.current.rotation.z = rotation[2] + Math.sin(t * 0.35) * 0.06;
      mesh.current.position.y = position[1] + Math.sin(t * 0.25) * 0.2;
    }
  });

  return (
    <mesh
      ref={mesh}
      position={position}
      rotation={rotation}
      geometry={geometry}
    >
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={DoubleSide}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}

function BreathOrb({
  position,
  scale,
  color,
  speed,
  phase,
  map,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
  phase: number;
  map: CanvasTexture;
}) {
  const ref = useRef<Sprite>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + phase;
    if (!ref.current) return;
    const s = scale * (0.85 + Math.sin(t) * 0.18);
    ref.current.scale.set(s, s, 1);
    ref.current.position.y = position[1] + Math.sin(t * 0.7) * 0.35;
    ref.current.position.x = position[0] + Math.cos(t * 0.4) * 0.2;
  });

  return (
    <sprite ref={ref} position={position}>
      <spriteMaterial
        map={map}
        color={color}
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </sprite>
  );
}

interface AuroraVeilSceneProps {
  tier: RenderTier;
  fogColor?: string;
}

/**
 * Aurora Veil — flowing violet/rose ribbons, soft orbs, and haze.
 * Distinct from the landing hologram field.
 */
export function AuroraVeilScene({
  tier,
  fogColor = "#faf9f7",
}: AuroraVeilSceneProps) {
  const sprite = useMemo(() => makeSoftSprite(), []);
  const ribbonCount = tier === "low" ? 3 : tier === "medium" ? 4 : 5;
  const orbCount = tier === "low" ? 2 : 3;
  const parallax = tier === "high" ? 1 : tier === "medium" ? 0.65 : 0.35;

  const ribbons = useMemo(
    () =>
      [
        {
          color: "#a78bfa",
          width: 9,
          height: 1.6,
          position: [-1.2, 1.2, -2] as [number, number, number],
          rotation: [-0.35, 0.25, -0.4] as [number, number, number],
          speed: 0.55,
          phase: 0.2,
          opacity: 0.18,
        },
        {
          color: "#fb7185",
          width: 8,
          height: 1.3,
          position: [1.6, -0.4, -2.4] as [number, number, number],
          rotation: [0.25, -0.3, 0.35] as [number, number, number],
          speed: 0.42,
          phase: 1.1,
          opacity: 0.14,
        },
        {
          color: "#c4b5fd",
          width: 10,
          height: 1.1,
          position: [0.2, -1.5, -3] as [number, number, number],
          rotation: [0.4, 0.15, 0.2] as [number, number, number],
          speed: 0.38,
          phase: 2.0,
          opacity: 0.12,
        },
        {
          color: "#818cf8",
          width: 7.5,
          height: 1.4,
          position: [-2.2, -0.8, -1.6] as [number, number, number],
          rotation: [-0.2, 0.45, 0.55] as [number, number, number],
          speed: 0.48,
          phase: 0.7,
          opacity: 0.11,
        },
        {
          color: "#fda4af",
          width: 8.5,
          height: 1.0,
          position: [2.4, 1.5, -3.2] as [number, number, number],
          rotation: [0.15, -0.2, -0.25] as [number, number, number],
          speed: 0.33,
          phase: 1.6,
          opacity: 0.1,
        },
      ].slice(0, ribbonCount),
    [ribbonCount],
  );

  const orbs = useMemo(
    () =>
      [
        {
          position: [-2.8, 1.4, -1.2] as [number, number, number],
          scale: 2.4,
          color: "#c4b5fd",
          speed: 0.55,
          phase: 0.3,
        },
        {
          position: [3.0, -0.6, -1.8] as [number, number, number],
          scale: 2.8,
          color: "#fb7185",
          speed: 0.4,
          phase: 1.4,
        },
        {
          position: [0.4, 2.0, -2.6] as [number, number, number],
          scale: 2.1,
          color: "#a5b4fc",
          speed: 0.48,
          phase: 2.2,
        },
      ].slice(0, orbCount),
    [orbCount],
  );

  const root = useRef<Group>(null);

  useFrame((state) => {
    if (!root.current) return;
    const strength = parallax;
    root.current.position.x = MathUtils.lerp(
      root.current.position.x,
      state.pointer.x * 0.5 * strength,
      0.045,
    );
    root.current.position.y = MathUtils.lerp(
      root.current.position.y,
      state.pointer.y * 0.3 * strength,
      0.045,
    );
    root.current.rotation.y = MathUtils.lerp(
      root.current.rotation.y,
      state.pointer.x * 0.07 * strength,
      0.045,
    );
    root.current.rotation.x = MathUtils.lerp(
      root.current.rotation.x,
      -state.pointer.y * 0.04 * strength,
      0.045,
    );
  });

  return (
    <>
      <fog attach="fog" args={[fogColor, 8, 22]} />
      <ambientLight intensity={0.6} />
      <group ref={root}>
        {ribbons.map((r, i) => (
          <Ribbon key={i} {...r} />
        ))}
        {orbs.map((o, i) => (
          <BreathOrb key={i} {...o} map={sprite} />
        ))}
      </group>
    </>
  );
}
