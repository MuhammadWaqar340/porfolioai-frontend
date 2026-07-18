"use client";

import { motion, useReducedMotion as useFmReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  fadeUpVariants,
  landingEase,
  landingSpring,
} from "@/lib/landing-motion";
import { cn } from "@/lib/utils";

type FadeInDirection = "up" | "down" | "left" | "right" | "none";

export interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: FadeInDirection;
  once?: boolean;
}

const offset: Record<FadeInDirection, { x?: number; y?: number }> = {
  up: { y: 24 },
  down: { y: -24 },
  left: { x: 24 },
  right: { x: -24 },
  none: {},
};

export function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
  once = true,
}: FadeInProps) {
  const reducedMotion = useReducedMotion();
  const fmReduced = useFmReducedMotion();
  const skip = reducedMotion || fmReduced;

  if (skip) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.15, margin: "0px 0px -32px 0px" }}
      variants={{
        hidden: {
          opacity: 0,
          ...offset[direction],
          filter: "blur(6px)",
        },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          filter: "blur(0px)",
        },
      }}
      transition={{
        ...landingSpring,
        delay: delay / 1000,
        opacity: { duration: 0.45, ease: landingEase, delay: delay / 1000 },
        filter: { duration: 0.5, ease: landingEase, delay: delay / 1000 },
      }}
    >
      {children}
    </motion.div>
  );
}

export { fadeUpVariants };
