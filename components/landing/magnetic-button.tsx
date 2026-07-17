"use client";

import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  /** How far the element travels toward the cursor, in px. */
  strength?: number;
}

/**
 * Wraps an interactive element and gently pulls it toward the cursor while
 * hovering — the "magnetic button" effect. Purely a visual transform on a
 * wrapper, so the child (a real <a>/<button>) keeps full focus/click behaviour.
 * Disabled under reduced-motion.
 */
export function MagneticButton({
  children,
  className,
  strength = 14,
}: MagneticButtonProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  const handleMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <span
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className={cn(
        "inline-flex will-change-transform transition-transform duration-200 ease-out",
        className,
      )}
    >
      {children}
    </span>
  );
}
