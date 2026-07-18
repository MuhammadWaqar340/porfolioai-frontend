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

interface HeroCardTiltProps {
  children: ReactNode;
  className?: string;
  max?: number;
}

export function HeroCardTilt({
  children,
  className,
  max = 12,
}: HeroCardTiltProps) {
  const reducedMotion = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, landingSpring);
  const springY = useSpring(rotateY, landingSpring);
  const transform = useMotionTemplate`perspective(1200px) rotateX(${springX}deg) rotateY(${springY}deg) translateZ(20px)`;

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-py * max * 2);
    rotateY.set(px * max * 2);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className={cn("relative will-change-transform", className)}
      style={{
        transformStyle: "preserve-3d",
        transform: reducedMotion ? undefined : transform,
      }}
      animate={reducedMotion ? undefined : { y: [0, -14, 0] }}
      transition={
        reducedMotion
          ? undefined
          : { duration: 6.5, repeat: Infinity, ease: "easeInOut" }
      }
    >
      {children}
    </motion.div>
  );
}
