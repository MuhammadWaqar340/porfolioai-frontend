"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  DoubleSide,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  Points,
  Vector3,
} from "three";
import type { RenderTier, ViewportBand } from "@/hooks/use-webgl-capability";

type CardKind = "profile" | "projects" | "skills" | "experience";

interface CardSpec {
  kind: CardKind;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  phase: number;
  speed: number;
  drift: number;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function makeGlowSprite(): CanvasTexture {
  const size = 64;
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
  g.addColorStop(0, "rgba(255,255,255,0.9)");
  g.addColorStop(0.4, "rgba(196,181,253,0.35)");
  g.addColorStop(1, "rgba(139,92,246,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function makeHologramTexture(kind: CardKind): CanvasTexture {
  const w = 512;
  const h = 640;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "rgba(30, 26, 48, 0.88)");
  bg.addColorStop(0.5, "rgba(18, 16, 32, 0.86)");
  bg.addColorStop(1, "rgba(28, 22, 44, 0.88)");
  drawRoundedRect(ctx, 12, 12, w - 24, h - 24, 28);
  ctx.fillStyle = bg;
  ctx.fill();

  ctx.strokeStyle = "rgba(167, 139, 250, 0.28)";
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, 14, 14, w - 28, h - 28, 26);
  ctx.stroke();

  const sheen = ctx.createLinearGradient(0, 0, 0, h * 0.4);
  sheen.addColorStop(0, "rgba(255,255,255,0.1)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  drawRoundedRect(ctx, 24, 24, w - 48, h * 0.35, 20);
  ctx.fillStyle = sheen;
  ctx.fill();

  if (kind === "profile") {
    ctx.beginPath();
    ctx.arc(w / 2, 170, 56, 0, Math.PI * 2);
    const av = ctx.createRadialGradient(w / 2 - 10, 158, 6, w / 2, 170, 56);
    av.addColorStop(0, "#c4b5fd");
    av.addColorStop(1, "#6d28d9");
    ctx.fillStyle = av;
    ctx.fill();

    ctx.fillStyle = "rgba(248,250,252,0.92)";
    ctx.font = "600 32px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Alex Morgan", w / 2, 275);
    ctx.fillStyle = "rgba(167, 139, 250, 0.85)";
    ctx.font = "500 20px system-ui, sans-serif";
    ctx.fillText("Full Stack Developer", w / 2, 308);

    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(148, 163, 184, 0.55)";
    for (let i = 0; i < 3; i++) {
      drawRoundedRect(ctx, 72, 360 + i * 32, 260 - i * 36, 12, 6);
      ctx.fill();
    }

    ["React", "Next.js", "AI"].forEach((label, i) => {
      const px = 72 + i * 112;
      drawRoundedRect(ctx, px, 490, 96, 32, 16);
      ctx.fillStyle = "rgba(124, 58, 237, 0.22)";
      ctx.fill();
      ctx.fillStyle = "rgba(221, 214, 254, 0.9)";
      ctx.font = "500 16px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(label, px + 48, 511);
    });
  }

  if (kind === "projects") {
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(248,250,252,0.9)";
    ctx.font = "600 28px system-ui, sans-serif";
    ctx.fillText("Projects", 56, 72);

    for (let i = 0; i < 3; i++) {
      const y = 110 + i * 155;
      drawRoundedRect(ctx, 48, y, w - 96, 132, 16);
      ctx.fillStyle = "rgba(76, 29, 149, 0.22)";
      ctx.fill();

      drawRoundedRect(ctx, 64, y + 20, 88, 92, 12);
      const thumb = ctx.createLinearGradient(64, y + 20, 152, y + 112);
      thumb.addColorStop(0, "#a78bfa");
      thumb.addColorStop(1, "#4c1d95");
      ctx.fillStyle = thumb;
      ctx.fill();

      ctx.fillStyle = "rgba(241,245,249,0.9)";
      ctx.font = "500 22px system-ui, sans-serif";
      ctx.fillText(
        ["Portfolio AI", "Design System", "Analytics Hub"][i],
        176,
        y + 52,
      );
      ctx.fillStyle = "rgba(148,163,184,0.45)";
      drawRoundedRect(ctx, 176, y + 72, 180, 10, 5);
      ctx.fill();
      drawRoundedRect(ctx, 176, y + 92, 120, 10, 5);
      ctx.fill();
    }
  }

  if (kind === "skills") {
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(248,250,252,0.9)";
    ctx.font = "600 28px system-ui, sans-serif";
    ctx.fillText("Skills", 56, 72);

    (
      [
        ["TypeScript", 0.9],
        ["React", 0.86],
        ["Node.js", 0.78],
        ["UI / UX", 0.74],
      ] as const
    ).forEach(([label, level], i) => {
      const y = 140 + i * 100;
      ctx.fillStyle = "rgba(226,232,240,0.85)";
      ctx.font = "500 20px system-ui, sans-serif";
      ctx.fillText(label, 56, y);
      drawRoundedRect(ctx, 56, y + 16, w - 112, 12, 6);
      ctx.fillStyle = "rgba(51, 65, 85, 0.5)";
      ctx.fill();
      drawRoundedRect(ctx, 56, y + 16, (w - 112) * level, 12, 6);
      const bar = ctx.createLinearGradient(56, 0, w - 56, 0);
      bar.addColorStop(0, "#7c3aed");
      bar.addColorStop(1, "#a78bfa");
      ctx.fillStyle = bar;
      ctx.fill();
    });
  }

  if (kind === "experience") {
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(248,250,252,0.9)";
    ctx.font = "600 28px system-ui, sans-serif";
    ctx.fillText("Experience", 56, 72);

    ctx.strokeStyle = "rgba(139, 92, 246, 0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(78, 120);
    ctx.lineTo(78, 540);
    ctx.stroke();

    (
      [
        ["Senior Engineer", "2023 — Present"],
        ["Frontend Lead", "2021 — 2023"],
        ["Product Designer", "2019 — 2021"],
      ] as const
    ).forEach(([title, dates], i) => {
      const y = 160 + i * 130;
      ctx.beginPath();
      ctx.arc(78, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#a78bfa";
      ctx.fill();

      ctx.fillStyle = "rgba(248,250,252,0.9)";
      ctx.font = "500 22px system-ui, sans-serif";
      ctx.fillText(title, 108, y + 4);
      ctx.fillStyle = "rgba(167, 139, 250, 0.75)";
      ctx.font = "400 16px system-ui, sans-serif";
      ctx.fillText(dates, 108, y + 30);
      ctx.fillStyle = "rgba(148,163,184,0.4)";
      drawRoundedRect(ctx, 108, y + 48, 220, 10, 5);
      ctx.fill();
    });
  }

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.anisotropy = 4;
  return texture;
}

function HologramCard({
  spec,
  pointer,
}: {
  spec: CardSpec;
  pointer: MutableRefObject<Vector3>;
}) {
  const group = useRef<Group>(null);
  const mesh = useRef<Mesh>(null);
  const glowMat = useRef<MeshBasicMaterial>(null);
  const texture = useMemo(() => makeHologramTexture(spec.kind), [spec.kind]);
  const target = useMemo(() => new Vector3(), []);
  const emissive = useMemo(() => new Color("#7c3aed"), []);

  const aspect = 512 / 640;
  const height = 2.15 * spec.scale;
  const width = height * aspect;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;

    const floatY = Math.sin(t * spec.speed + spec.phase) * 0.22;
    const floatX =
      Math.cos(t * spec.speed * 0.65 + spec.phase) * 0.08 * spec.drift;
    target.set(
      spec.position[0] + floatX - pointer.current.x * 0.28,
      spec.position[1] + floatY - pointer.current.y * 0.18,
      spec.position[2],
    );
    g.position.lerp(target, 0.05);

    g.rotation.x = spec.rotation[0] + Math.sin(t * 0.3 + spec.phase) * 0.035;
    g.rotation.y = spec.rotation[1] + Math.cos(t * 0.28 + spec.phase) * 0.045;
    g.rotation.z = spec.rotation[2];

    if (mesh.current) {
      const mat = mesh.current.material as MeshPhysicalMaterial;
      mat.emissiveIntensity = 0.12 + Math.sin(t * 0.8 + spec.phase) * 0.03;
    }
    if (glowMat.current) {
      glowMat.current.opacity = 0.06 + Math.sin(t * 0.7 + spec.phase) * 0.015;
    }
  });

  return (
    <group ref={group} position={spec.position} rotation={spec.rotation}>
      <mesh position={[0, 0, -0.05]} scale={[1.12, 1.1, 1]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          ref={glowMat}
          color="#8b5cf6"
          transparent
          opacity={0.07}
          blending={AdditiveBlending}
          depthWrite={false}
          side={DoubleSide}
        />
      </mesh>
      <mesh ref={mesh}>
        <planeGeometry args={[width, height]} />
        <meshPhysicalMaterial
          map={texture}
          transparent
          opacity={0.62}
          roughness={0.4}
          metalness={0.12}
          emissive={emissive}
          emissiveIntensity={0.12}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function DustField({ count, sprite }: { count: number; sprite: CanvasTexture }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = MathUtils.randFloatSpread(14);
      arr[i * 3 + 1] = MathUtils.randFloatSpread(10);
      arr[i * 3 + 2] = MathUtils.randFloatSpread(6) - 2;
    }
    return arr;
  }, [count]);

  const ref = useRef<Points>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={sprite}
        size={0.045}
        color="#c4b5fd"
        transparent
        opacity={0.28}
        depthWrite={false}
        blending={AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

const CARD_LAYOUTS: CardSpec[] = [
  {
    kind: "profile",
    position: [-3.5, 0.9, -1.4],
    rotation: [0.06, 0.32, -0.04],
    scale: 1,
    phase: 0.2,
    speed: 0.4,
    drift: 0.9,
  },
  {
    kind: "projects",
    position: [3.5, 0.45, -1.8],
    rotation: [-0.04, -0.36, 0.04],
    scale: 0.95,
    phase: 1.1,
    speed: 0.35,
    drift: 1,
  },
  {
    kind: "skills",
    position: [-2.6, -1.4, -0.9],
    rotation: [0.08, 0.24, 0.03],
    scale: 0.82,
    phase: 2.0,
    speed: 0.42,
    drift: 0.85,
  },
  {
    kind: "experience",
    position: [2.4, -1.2, -2.3],
    rotation: [-0.06, -0.2, -0.03],
    scale: 0.85,
    phase: 0.8,
    speed: 0.38,
    drift: 0.95,
  },
];

/** Compact layouts for narrow viewports so cards stay in frame behind content. */
const MOBILE_LAYOUTS: CardSpec[] = [
  {
    kind: "profile",
    position: [-1.15, 1.35, -2.2],
    rotation: [0.1, 0.22, -0.03],
    scale: 0.62,
    phase: 0.2,
    speed: 0.32,
    drift: 0.55,
  },
  {
    kind: "projects",
    position: [1.2, 0.85, -2.6],
    rotation: [-0.06, -0.24, 0.03],
    scale: 0.58,
    phase: 1.1,
    speed: 0.28,
    drift: 0.6,
  },
  {
    kind: "skills",
    position: [-0.95, -1.15, -2.0],
    rotation: [0.08, 0.18, 0.02],
    scale: 0.52,
    phase: 2.0,
    speed: 0.34,
    drift: 0.5,
  },
];

const TABLET_LAYOUTS: CardSpec[] = [
  {
    kind: "profile",
    position: [-2.4, 1.0, -1.6],
    rotation: [0.06, 0.28, -0.04],
    scale: 0.82,
    phase: 0.2,
    speed: 0.36,
    drift: 0.75,
  },
  {
    kind: "projects",
    position: [2.45, 0.5, -2.0],
    rotation: [-0.04, -0.3, 0.04],
    scale: 0.78,
    phase: 1.1,
    speed: 0.32,
    drift: 0.85,
  },
  {
    kind: "skills",
    position: [-1.9, -1.35, -1.2],
    rotation: [0.08, 0.22, 0.03],
    scale: 0.68,
    phase: 2.0,
    speed: 0.38,
    drift: 0.7,
  },
  {
    kind: "experience",
    position: [1.85, -1.15, -2.4],
    rotation: [-0.06, -0.18, -0.03],
    scale: 0.7,
    phase: 0.8,
    speed: 0.34,
    drift: 0.8,
  },
];

function layoutsForBand(band: ViewportBand): CardSpec[] {
  if (band === "mobile") return MOBILE_LAYOUTS;
  if (band === "tablet") return TABLET_LAYOUTS;
  return CARD_LAYOUTS;
}

interface FloatingHologramsProps {
  tier: RenderTier;
  band: ViewportBand;
}

/** Quiet floating portfolio cards — layout adapts to mobile / tablet / desktop. */
export function FloatingHolograms({ tier, band }: FloatingHologramsProps) {
  const { viewport, size } = useThree();
  const root = useRef<Group>(null);
  const pointer = useRef(new Vector3());
  const sprite = useMemo(() => makeGlowSprite(), []);

  const cards = useMemo(() => {
    const base = layoutsForBand(band);
    if (tier === "low") return base.slice(0, band === "mobile" ? 2 : 2);
    if (tier === "medium") return base.slice(0, Math.min(3, base.length));
    return base;
  }, [tier, band]);

  const dustCount =
    band === "mobile"
      ? 14
      : band === "tablet"
        ? tier === "high"
          ? 36
          : 24
        : tier === "high"
          ? 70
          : tier === "medium"
            ? 40
            : 20;

  // Extra squeeze if the canvas is very narrow (foldables / portrait tablets).
  const widthScale = MathUtils.clamp(size.width / 960, 0.72, 1);

  useFrame((state) => {
    const pointerScale = band === "mobile" ? 0.04 : band === "tablet" ? 0.08 : 0.12;
    pointer.current.set(
      state.pointer.x * viewport.width * pointerScale,
      state.pointer.y * viewport.height * pointerScale * 0.75,
      0,
    );
    if (root.current) {
      const rotScale = band === "mobile" ? 0.02 : 0.05;
      root.current.rotation.y = MathUtils.lerp(
        root.current.rotation.y,
        state.pointer.x * rotScale,
        0.035,
      );
      root.current.rotation.x = MathUtils.lerp(
        root.current.rotation.x,
        -state.pointer.y * rotScale * 0.6,
        0.035,
      );
    }
  });

  return (
    <group ref={root} scale={[widthScale, widthScale, 1]}>
      {cards.map((spec) => (
        <HologramCard key={spec.kind} spec={spec} pointer={pointer} />
      ))}
      <DustField count={dustCount} sprite={sprite} />
    </group>
  );
}
