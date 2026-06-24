import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScrollableCardBodyProps {
  children: ReactNode;
  className?: string;
}

/** Internal scroll area for card content (max ~12rem). */
export function ScrollableCardBody({ children, className }: ScrollableCardBodyProps) {
  return (
    <div
      className={cn(
        "max-h-48 overflow-auto rounded-md border border-border/40 bg-muted/15 px-3 py-2.5",
        className
      )}
    >
      {children}
    </div>
  );
}
