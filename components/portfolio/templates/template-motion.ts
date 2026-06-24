import type { TemplateSlug } from "@/constants/templates";
import { animationDelays } from "@/lib/motion";
import { cn } from "@/lib/utils";

export const templateSectionDelays = [
  animationDelays[100],
  animationDelays[150],
  animationDelays[200],
  animationDelays[250],
  animationDelays[300],
  animationDelays[350],
  animationDelays[400],
  animationDelays[500],
] as const;

export function templateSectionClass(delayIndex: number) {
  const delay =
    templateSectionDelays[
      Math.min(delayIndex, templateSectionDelays.length - 1)
    ];
  return cn("animate-template-reveal", delay);
}

export const templateNavStyles: Record<TemplateSlug, string> = {
  modern:
    "border-primary/15 bg-gradient-to-r from-background/90 via-background/85 to-violet-500/[0.04] [&_a]:transition-all [&_a]:duration-300",
  minimal:
    "border-border/40 bg-gradient-to-b from-background/95 to-muted/20 [&_a]:rounded-none [&_a]:tracking-[0.15em] [&_a]:uppercase [&_a]:transition-colors [&_a]:duration-300",
  professional:
    "border-border bg-gradient-to-r from-muted/40 via-background/90 to-primary/[0.03] [&_a]:rounded-sm [&_a]:uppercase [&_a]:tracking-wide [&_a]:transition-all [&_a]:duration-300",
  creative:
    "border-none bg-gradient-to-r from-primary/5 via-fuchsia-500/5 to-sky-500/5 backdrop-blur-lg [&_a]:rounded-full [&_a]:border [&_a]:border-primary/20 [&_a]:transition-all [&_a]:duration-300",
  elegant:
    "border-amber-500/20 bg-gradient-to-r from-background/95 via-amber-500/[0.03] to-orange-400/[0.03] [&_a]:rounded-none [&_a]:tracking-[0.12em] [&_a]:uppercase [&_a]:text-xs [&_a]:transition-all [&_a]:duration-500",
  developer:
    "border-emerald-600/20 bg-gradient-to-r from-white via-emerald-50/80 to-white text-foreground backdrop-blur-md dark:border-emerald-500/25 dark:from-zinc-950/95 dark:via-zinc-900/90 dark:to-emerald-950/30 dark:text-zinc-100 [&_a]:rounded-md [&_a]:border [&_a]:border-emerald-600/25 [&_a]:font-mono [&_a]:text-[11px] [&_a]:uppercase [&_a]:tracking-wider [&_a]:text-emerald-900 [&_a]:transition-all [&_a]:duration-300 dark:[&_a]:border-emerald-500/25 dark:[&_a]:text-zinc-300",
  bold:
    "border-foreground/20 bg-gradient-to-r from-background via-muted/20 to-background [&_a]:rounded-none [&_a]:border-2 [&_a]:border-foreground [&_a]:font-bold [&_a]:uppercase [&_a]:tracking-tight [&_a]:transition-all [&_a]:duration-300",
};

export const templateRootStyles: Record<TemplateSlug, string> = {
  modern: "selection:bg-primary/20",
  minimal: "selection:bg-foreground/10",
  professional: "selection:bg-primary/15",
  creative: "selection:bg-violet-500/20",
  elegant: "selection:bg-amber-500/20",
  developer: "selection:bg-emerald-500/25",
  bold: "selection:bg-foreground/20",
};
