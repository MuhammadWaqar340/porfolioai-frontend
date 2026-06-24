"use client";

import { Children, isValidElement } from "react";
import { FadeIn, type FadeInProps } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";

interface StaggerProps extends Omit<FadeInProps, "children" | "delay"> {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}

export function Stagger({
  children,
  className,
  stagger = 80,
  ...fadeProps
}: StaggerProps) {
  return (
    <div className={cn(className)}>
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;

        return (
          <FadeIn key={child.key ?? index} delay={index * stagger} {...fadeProps}>
            {child}
          </FadeIn>
        );
      })}
    </div>
  );
}
