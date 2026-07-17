"use client";

import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface HeroCardTiltProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  max?: number;
}

/**
 * Wraps the hero preview mockup and tilts it in 3D toward the cursor, giving the
 * flat card a floating, spatial feel. Purely presentational; disabled when the
 * user prefers reduced motion. The children (server-rendered card) stay intact.
 */
export function HeroCardTilt({ children, className, max = 10 }: HeroCardTiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(1100px) rotateY(${px * max}deg) rotateX(${-py * max}deg) translateZ(0)`;
  };

  const reset = () => {
    if (ref.current) {
      ref.current.style.transform =
        "perspective(1100px) rotateY(0deg) rotateX(0deg)";
    }
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className={cn("transition-transform duration-200 ease-out will-change-transform", className)}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}
