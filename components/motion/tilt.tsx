"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { landingSpring } from "@/lib/landing-motion";
import { cn } from "@/lib/utils";

interface TiltProps {
  children: ReactNode;
  className?: string;
  max?: number;
  lift?: number;
  float?: boolean;
}

export function Tilt({
  children,
  className,
  max = 8,
  lift = 10,
  float = false,
}: TiltProps) {
  const reducedMotion = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const z = useMotionValue(0);

  const springX = useSpring(rotateX, landingSpring);
  const springY = useSpring(rotateY, landingSpring);
  const springZ = useSpring(z, landingSpring);
  const transform = useMotionTemplate`perspective(1000px) rotateX(${springX}deg) rotateY(${springY}deg) translateZ(${springZ}px)`;

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-py * max * 2);
    rotateY.set(px * max * 2);
    z.set(lift);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
    z.set(0);
  };

  return (
    <motion.div
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className={cn("h-full will-change-transform", className)}
      style={{
        transformStyle: "preserve-3d",
        transform: reducedMotion ? undefined : transform,
      }}
      animate={float && !reducedMotion ? { y: [0, -8, 0] } : undefined}
      transition={
        float && !reducedMotion
          ? { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
