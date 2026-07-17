"use client";

import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface TiltProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  max?: number;
  /** Lift toward the viewer on hover, in px. */
  lift?: number;
}

/**
 * Generic 3D cursor tilt for cards. Applies a perspective rotation toward the
 * pointer plus a subtle lift, giving flat cards spatial depth to match the 3D
 * hero. Purely presentational and disabled under reduced motion; children keep
 * all their normal interactivity.
 */
export function Tilt({ children, className, max = 7, lift = 6 }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg) translateZ(${lift}px)`;
  };

  const reset = () => {
    if (ref.current) {
      ref.current.style.transform =
        "perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
    }
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className={cn(
        "h-full transition-transform duration-200 ease-out will-change-transform",
        className,
      )}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}
