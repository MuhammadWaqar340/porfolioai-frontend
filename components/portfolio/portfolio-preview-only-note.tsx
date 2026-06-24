"use client";

import { useOptionalDemoPortfolio } from "@/contexts/portfolio-demo-context";
import { cn } from "@/lib/utils";

interface PortfolioPreviewOnlyNoteProps {
  className?: string;
}

export function PortfolioPreviewOnlyNote({
  className,
}: PortfolioPreviewOnlyNoteProps) {
  const portfolio = useOptionalDemoPortfolio();

  if (!portfolio?.displayOnly) {
    return null;
  }

  return (
    <p
      className={cn(
        "rounded-md border border-dashed border-primary/20 bg-primary/[0.04] px-3 py-2 text-xs text-muted-foreground",
        className
      )}
    >
      Template preview — forms are shown for layout only and cannot be submitted.
    </p>
  );
}
