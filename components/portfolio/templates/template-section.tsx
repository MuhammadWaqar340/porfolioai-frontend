"use client";

import type { TemplateSlug } from "@/constants/templates";
import {
  getFreeSectionShell,
  getProSectionInnerStyle,
  getProSectionShell,
  getSectionAnimationClass,
  isFreeTemplate,
  isProTemplate,
  type PortfolioSectionId,
} from "@/components/portfolio/templates/template-section-config";
import { templateSectionClass } from "@/components/portfolio/templates/template-motion";
import { getTemplateSectionShell } from "@/components/portfolio/templates/template-styles";
import { cn } from "@/lib/utils";

interface TemplateSectionProps {
  template: TemplateSlug;
  sectionId: PortfolioSectionId;
  id?: string;
  index: number;
  className?: string;
  children: React.ReactNode;
}

export function TemplateSection({
  template,
  sectionId,
  id,
  index,
  className,
  children,
}: TemplateSectionProps) {
  const freeShell = getFreeSectionShell(template, sectionId);
  const shellClass = isProTemplate(template)
    ? getProSectionShell(template, sectionId)
    : freeShell || cn("group/section", getTemplateSectionShell(template, index));

  const animationClass =
    isProTemplate(template) || isFreeTemplate(template)
      ? getSectionAnimationClass(template, sectionId, index)
      : templateSectionClass(index);

  const innerStyle = getProSectionInnerStyle(template, sectionId);

  return (
    <div
      id={id}
      data-template-section={sectionId}
      className={cn(animationClass, shellClass, innerStyle, className)}
    >
      {children}
    </div>
  );
}

interface TemplateSeparatorProps {
  template: TemplateSlug;
  className?: string;
}

export function TemplateSeparator({ template, className }: TemplateSeparatorProps) {
  return (
    <div className={cn("relative py-2 sm:py-3", className)} aria-hidden>
      <div className={cn("h-px w-full", getTemplateSeparatorLine(template))} />
      <div
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          getTemplateSeparatorDot(template)
        )}
      />
    </div>
  );
}

function getTemplateSeparatorLine(template: TemplateSlug): string {
  const lines: Record<TemplateSlug, string> = {
    modern:
      "bg-gradient-to-r from-transparent via-primary/35 to-transparent",
    minimal: "bg-gradient-to-r from-transparent via-border to-transparent",
    professional:
      "bg-gradient-to-r from-primary/30 via-border/80 to-transparent",
    creative:
      "bg-gradient-to-r from-primary/40 via-fuchsia-500/50 to-sky-500/40",
    elegant:
      "bg-gradient-to-r from-transparent via-amber-500/45 to-transparent",
    developer:
      "bg-gradient-to-r from-transparent via-emerald-500/45 to-transparent",
    bold: "h-0.5 bg-foreground/80",
    aurora:
      "bg-gradient-to-r from-cyan-500/40 via-violet-500/50 to-teal-500/40",
  };
  return lines[template];
}

function getTemplateSeparatorDot(template: TemplateSlug): string {
  const dots: Record<TemplateSlug, string> = {
    modern:
      "h-1.5 w-1.5 rounded-full bg-primary/60 shadow-[0_0_8px_var(--primary)]",
    minimal: "h-1 w-8 bg-foreground/20",
    professional: "h-2 w-2 rotate-45 bg-primary/70",
    creative:
      "h-2 w-2 rounded-full bg-gradient-to-r from-primary via-fuchsia-500 to-sky-500 shadow-[0_0_12px_oklch(0.55_0.25_300/50%)]",
    elegant: "h-px w-12 bg-amber-500/70",
    developer:
      "font-mono text-[9px] text-emerald-500/80 before:content-['{·}']",
    bold: "h-3 w-3 border-2 border-foreground bg-background",
    aurora:
      "h-2 w-2 rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-violet-400 shadow-[0_0_12px_oklch(0.7_0.15_195/60%)]",
  };
  return dots[template];
}

export type { PortfolioSectionId };
