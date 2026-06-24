"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type FadeInDirection = "up" | "down" | "left" | "right" | "none";

export interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: FadeInDirection;
  once?: boolean;
}

const hiddenOffset: Record<FadeInDirection, string> = {
  up: "translate-y-5",
  down: "-translate-y-5",
  left: "translate-x-5",
  right: "-translate-x-5",
  none: "",
};

export function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
  once = true,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-none motion-reduce:opacity-100 motion-reduce:transition-none",
        visible
          ? "translate-x-0 translate-y-0 opacity-100"
          : cn("opacity-0", hiddenOffset[direction]),
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
