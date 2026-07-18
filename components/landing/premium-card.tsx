"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  /** Show diagonal shine sweep on hover. */
  shine?: boolean;
}

/**
 * Glass + spotlight card shell. Tracks pointer for a soft radial highlight.
 */
export function PremiumCard({
  children,
  className,
  shine = true,
}: PremiumCardProps) {
  const reducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mouseX}px ${mouseY}px, oklch(0.62 0.2 280 / 0.14), transparent 55%)`;

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div
      onPointerMove={handleMove}
      className={cn(
        "group/premium relative h-full overflow-hidden rounded-xl",
        className,
      )}
    >
      {!reducedMotion ? (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover/premium:opacity-100"
          style={{ background: spotlight }}
          aria-hidden
        />
      ) : null}
      {shine && !reducedMotion ? (
        <div
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
          aria-hidden
        >
          <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-700 group-hover/premium:translate-x-[220%] group-hover/premium:opacity-100" />
        </div>
      ) : null}
      <div className="relative z-0 h-full">{children}</div>
    </div>
  );
}
