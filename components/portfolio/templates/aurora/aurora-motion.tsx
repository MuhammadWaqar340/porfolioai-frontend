"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { landingEase, landingSpring } from "@/lib/landing-motion";
import { cn } from "@/lib/utils";

export type AuroraMotionIntensity = "soft" | "medium" | "strong";

const tiltByIntensity: Record<
  AuroraMotionIntensity,
  { max: number; lift: number }
> = {
  soft: { max: 3, lift: 4 },
  medium: { max: 5, lift: 8 },
  strong: { max: 7, lift: 12 },
};

interface AuroraSectionMotionProps {
  children: ReactNode;
  className?: string;
  intensity?: AuroraMotionIntensity;
  /** Disable pointer tilt (still keeps scroll reveal). */
  tilt?: boolean;
  spotlight?: boolean;
}

/**
 * Shared Aurora section shell: scroll reveal with subtle 3D, optional cursor
 * tilt, and a soft violet spotlight. Respects reduced-motion / coarse pointers.
 */
export function AuroraSectionMotion({
  children,
  className,
  intensity = "medium",
  tilt = true,
  spotlight = true,
}: AuroraSectionMotionProps) {
  const reducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const z = useMotionValue(0);

  const springX = useSpring(rotateX, landingSpring);
  const springY = useSpring(rotateY, landingSpring);
  const springZ = useSpring(z, landingSpring);
  const transform = useMotionTemplate`perspective(1200px) rotateX(${springX}deg) rotateY(${springY}deg) translateZ(${springZ}px)`;
  const glow = useMotionTemplate`radial-gradient(520px circle at ${mouseX}px ${mouseY}px, oklch(0.55 0.14 300 / 0.12), transparent 55%)`;

  const { max, lift } = tiltByIntensity[intensity];

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
    if (!tilt) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-py * max * 2);
    rotateY.set(px * max * 2);
    z.set(lift);
  };

  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    z.set(0);
  };

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn("relative will-change-transform", className)}
      style={{
        transformStyle: "preserve-3d",
        transform: tilt ? transform : undefined,
      }}
      initial={{
        opacity: 0,
        y: 28,
        rotateX: 5,
        filter: "blur(8px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        rotateX: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: true, amount: 0.18, margin: "0px 0px -40px 0px" }}
      transition={{
        ...landingSpring,
        opacity: { duration: 0.5, ease: landingEase },
        filter: { duration: 0.55, ease: landingEase },
      }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {spotlight ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 group-hover/aurora:opacity-100"
          style={{ background: glow }}
        />
      ) : null}
      <div className="relative z-[2]">{children}</div>
    </motion.div>
  );
}

interface AuroraAvatarFrameProps {
  children: ReactNode;
  className?: string;
}

/** Floating 3D frame for the Aurora hero avatar. */
export function AuroraAvatarFrame({
  children,
  className,
}: AuroraAvatarFrameProps) {
  const reducedMotion = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, landingSpring);
  const springY = useSpring(rotateY, landingSpring);
  const transform = useMotionTemplate`perspective(900px) rotateX(${springX}deg) rotateY(${springY}deg) translateZ(16px)`;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-py * 14);
    rotateY.set(px * 14);
  };

  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      className={cn("relative will-change-transform", className)}
      style={{
        transformStyle: "preserve-3d",
        transform: reducedMotion ? undefined : transform,
      }}
      animate={reducedMotion ? undefined : { y: [0, -10, 0] }}
      transition={
        reducedMotion
          ? undefined
          : { duration: 6, repeat: Infinity, ease: "easeInOut" }
      }
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      initial={reducedMotion ? false : { opacity: 0, scale: 0.94, y: 16 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div
        className="pointer-events-none absolute -inset-6 bg-[radial-gradient(circle,oklch(0.55_0.14_300/18%),transparent_65%)] blur-2xl"
        aria-hidden
      />
      {children}
    </motion.div>
  );
}

interface AuroraDividerProps {
  className?: string;
}

/** Gradient rule that draws on enter. */
export function AuroraDivider({ className }: AuroraDividerProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(
        "h-px origin-left bg-gradient-to-r from-violet-600/70 to-transparent",
        className,
      )}
      initial={reducedMotion ? false : { scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: landingEase, delay: 0.35 }}
    />
  );
}
