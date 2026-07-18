"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  AuroraSectionMotion,
  type AuroraMotionIntensity,
} from "@/components/portfolio/templates/aurora/aurora-motion";
import type { PortfolioSectionId } from "@/components/portfolio/templates/template-section";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { landingEase, landingSpring } from "@/lib/landing-motion";
import { cn } from "@/lib/utils";

export type AuroraSectionVariant =
  | "cinema"
  | "constellation"
  | "showcase"
  | "timeline"
  | "academy"
  | "honors"
  | "voices"
  | "reach";

interface AuroraSectionProps {
  id: PortfolioSectionId;
  variant: AuroraSectionVariant;
  index?: number;
  number: string;
  label: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
}

const frameStyles: Record<AuroraSectionVariant, string> = {
  cinema:
    "rounded-sm border border-violet-500/15 bg-gradient-to-br from-violet-500/[0.04] via-background to-rose-500/[0.03] p-0 overflow-hidden",
  constellation:
    "rounded-none border-y border-violet-500/20 bg-[#faf9f7]/75 py-10 sm:py-12 backdrop-blur-[1px] dark:bg-background/70",
  showcase:
    "rounded-sm border-2 border-violet-900/10 bg-background/85 p-8 sm:p-10 shadow-[0_32px_64px_-48px_oklch(0.35_0.12_320/35%)] backdrop-blur-[2px]",
  timeline:
    "relative rounded-sm border border-violet-500/15 bg-background/85 px-6 py-8 sm:px-8 sm:py-10 backdrop-blur-[2px]",
  academy:
    "rounded-sm border border-violet-500/15 bg-background/85 p-8 sm:p-10 backdrop-blur-[2px]",
  honors:
    "rounded-none bg-violet-950/[0.03] px-6 py-10 sm:px-10 sm:py-12 dark:bg-violet-500/[0.06]",
  voices:
    "rounded-sm border border-violet-500/15 bg-[#faf9f7]/80 p-8 sm:p-12 dark:bg-background/85 backdrop-blur-[2px]",
  reach:
    "rounded-sm border border-violet-500/15 bg-background/85 p-8 pb-10 sm:p-10 sm:pb-12 backdrop-blur-[2px]",
};

const SECTION_EYEBROWS: Record<AuroraSectionVariant, string> = {
  cinema: "On camera",
  constellation: "Craft & capability",
  showcase: "Portfolio highlights",
  timeline: "Professional journey",
  academy: "Academic background",
  honors: "Recognition",
  voices: "Testimonials",
  reach: "Let's connect",
};

const headerStyles: Record<AuroraSectionVariant, string> = {
  cinema:
    "border-b border-violet-500/10 bg-violet-500/[0.04] px-8 py-6 sm:px-10",
  constellation: "mx-auto max-w-5xl px-4 pt-2 sm:px-6",
  showcase: "w-full",
  timeline: "w-full",
  academy: "w-full",
  honors: "mx-auto max-w-5xl px-4 sm:px-6",
  voices: "w-full",
  reach: "w-full",
};

const contentStyles: Record<AuroraSectionVariant, string> = {
  cinema: "px-6 py-8 sm:px-10 sm:py-10 [&_[data-portfolio-section]_h2]:sr-only",
  constellation:
    "aurora-constellation-content mx-auto max-w-5xl px-4 pb-2 pt-4 sm:px-6",
  showcase: "aurora-showcase-content",
  timeline: "aurora-timeline-content",
  academy:
    "[&_[data-portfolio-section]_h2]:sr-only [&_[data-portfolio-section]_.grid]:grid-cols-1 [&_[data-portfolio-section]_.grid]:gap-0 [&_[data-portfolio-section]_.grid>div]:flex [&_[data-portfolio-section]_.grid>div]:flex-col [&_[data-portfolio-section]_.grid>div]:gap-4 [&_[data-portfolio-section]_.grid>div]:rounded-none [&_[data-portfolio-section]_.grid>div]:border-0 [&_[data-portfolio-section]_.grid>div]:border-b [&_[data-portfolio-section]_.grid>div]:border-violet-500/15 [&_[data-portfolio-section]_.grid>div]:bg-transparent [&_[data-portfolio-section]_.grid>div]:p-0 [&_[data-portfolio-section]_.grid>div]:py-6 [&_[data-portfolio-section]_.grid>div]:shadow-none sm:[&_[data-portfolio-section]_.grid>div]:flex-row sm:[&_[data-portfolio-section]_.grid>div]:items-start sm:[&_[data-portfolio-section]_.grid>div]:gap-8 [&_[data-portfolio-section]_.grid>div]:last:border-b-0 [&_[data-portfolio-section]_.grid>div_svg]:hidden [&_[data-portfolio-section]_.grid>div_h3]:font-heading [&_[data-portfolio-section]_.grid>div_h3]:text-lg [&_[data-portfolio-section]_.grid>div_.text-primary]:text-sm [&_[data-portfolio-section]_.grid>div_.text-primary]:font-medium [&_[data-portfolio-section]_.grid>div_.text-primary]:uppercase [&_[data-portfolio-section]_.grid>div_.text-primary]:tracking-widest [&_[data-portfolio-section]_.grid>div_.text-primary]:text-rose-600 dark:[&_[data-portfolio-section]_.grid>div_.text-primary]:text-rose-400",
  honors: "mx-auto max-w-5xl px-4 sm:px-6 aurora-honors-content",
  voices:
    "[&_[data-portfolio-section]_h2]:sr-only [&_[data-portfolio-section]>div:first-child]:hidden [&_[data-portfolio-section]_.grid]:grid-cols-1 [&_[data-portfolio-section]_.grid]:gap-8 lg:[&_[data-portfolio-section]_.grid]:grid-cols-2 [&_[data-portfolio-section]_.grid>figure:first-child]:lg:col-span-2 [&_[data-portfolio-section]_.grid>figure:first-child]:border-2 [&_[data-portfolio-section]_.grid>figure:first-child]:border-violet-500/20 [&_[data-portfolio-section]_.grid>figure:first-child]:bg-background [&_[data-portfolio-section]_.grid>figure:first-child]:p-8 sm:[&_[data-portfolio-section]_.grid>figure:first-child]:p-10 [&_[data-portfolio-section]_.grid>figure:first-child_blockquote]:text-lg [&_[data-portfolio-section]_.grid>figure:first-child_blockquote]:font-light [&_[data-portfolio-section]_.grid>figure:first-child_blockquote]:leading-relaxed sm:[&_[data-portfolio-section]_.grid>figure:first-child_blockquote]:text-xl [&_[data-portfolio-section]_figure]:rounded-none [&_[data-portfolio-section]_figure]:border [&_[data-portfolio-section]_figure]:border-violet-500/15 [&_[data-portfolio-section]_figure]:bg-background [&_[data-portfolio-section]_figure]:shadow-none [&_[data-portfolio-section]_figure]:transition-transform [&_[data-portfolio-section]_figure]:duration-300 [&_[data-portfolio-section]_figure]:hover:-translate-y-1 [&_[data-portfolio-section]_blockquote]:font-heading [&_[data-portfolio-section]_figcaption]:border-violet-500/15",
  reach: "aurora-reach-content mx-auto max-w-3xl w-full",
};

const intensityByVariant: Record<AuroraSectionVariant, AuroraMotionIntensity> =
  {
    cinema: "soft",
    constellation: "medium",
    showcase: "strong",
    timeline: "strong",
    academy: "soft",
    honors: "medium",
    voices: "medium",
    reach: "soft",
  };

function AuroraStandardHeader({
  number,
  eyebrow,
  label,
  subtitle,
  className,
}: {
  number: string;
  eyebrow: string;
  label: string;
  subtitle?: string;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "mb-8 flex items-start gap-5 border-b border-violet-500/15 pb-6 sm:gap-6",
        className,
      )}
    >
      <motion.span
        className="font-heading text-5xl font-light leading-none text-violet-500/25 sm:text-6xl"
        aria-hidden
        initial={reducedMotion ? false : { opacity: 0, y: 12, rotateX: 12 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true }}
        transition={{ ...landingSpring, delay: 0.05 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {number}
      </motion.span>
      <div className="min-w-0 flex-1 border-l border-violet-500/20 pl-5 sm:pl-6">
        <motion.p
          className="text-[11px] font-semibold uppercase tracking-[0.28em] text-rose-600/90 dark:text-rose-400"
          initial={reducedMotion ? false : { opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: landingEase, delay: 0.1 }}
        >
          {eyebrow}
        </motion.p>
        <motion.h2
          className="font-heading mt-2 text-2xl font-light tracking-tight text-foreground sm:text-3xl"
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: landingEase, delay: 0.16 }}
        >
          {label}
        </motion.h2>
        {subtitle ? (
          <motion.p
            className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground"
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: landingEase, delay: 0.22 }}
          >
            {subtitle}
          </motion.p>
        ) : null}
      </div>
    </div>
  );
}

export function AuroraSection({
  id,
  variant,
  number,
  label,
  subtitle,
  className,
  children,
}: AuroraSectionProps) {
  return (
    <section
      id={id}
      data-aurora-section={variant}
      className={cn("group/aurora scroll-mt-24", className)}
    >
      <AuroraSectionMotion
        intensity={intensityByVariant[variant]}
        tilt={variant !== "constellation"}
        className={frameStyles[variant]}
      >
        <header className={headerStyles[variant]}>
          <AuroraStandardHeader
            number={number}
            eyebrow={SECTION_EYEBROWS[variant]}
            label={label}
            subtitle={subtitle}
          />
        </header>
        <div className={contentStyles[variant]}>{children}</div>
      </AuroraSectionMotion>
    </section>
  );
}
