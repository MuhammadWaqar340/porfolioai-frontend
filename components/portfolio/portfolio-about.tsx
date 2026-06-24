"use client";

import { ExpandableText } from "@/components/ui/expandable-text";
import { cn } from "@/lib/utils";

export const PORTFOLIO_ABOUT_PLACEHOLDER =
  "Add your about section in Profile to introduce yourself to visitors.";

interface PortfolioAboutProps {
  about: string;
  className?: string;
  wrapperClassName?: string;
  lines?: 2 | 3 | 4;
}

export function PortfolioAbout({
  about,
  className,
  wrapperClassName,
  lines = 3,
}: PortfolioAboutProps) {
  const text = about.trim() || PORTFOLIO_ABOUT_PLACEHOLDER;

  return (
    <ExpandableText
      text={text}
      className={cn("whitespace-pre-wrap", className)}
      wrapperClassName={wrapperClassName}
      lines={lines}
    />
  );
}
