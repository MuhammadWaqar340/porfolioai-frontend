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
    "border-primary/15 bg-background/80 supports-[backdrop-filter]:bg-background/70 [&_a]:transition-all [&_a]:duration-300",
  minimal:
    "border-border/40 bg-background/85 supports-[backdrop-filter]:bg-background/75 [&_a]:rounded-none [&_a]:tracking-[0.15em] [&_a]:uppercase [&_a]:transition-colors [&_a]:duration-300",
  professional:
    "border-border/80 bg-background/85 supports-[backdrop-filter]:bg-background/75 [&_a]:rounded-sm [&_a]:uppercase [&_a]:tracking-wide [&_a]:transition-all [&_a]:duration-300",
  creative:
    "border-primary/10 bg-background/80 supports-[backdrop-filter]:bg-background/65 [&_a]:rounded-full [&_a]:border [&_a]:border-primary/15 [&_a]:transition-all [&_a]:duration-300",
  elegant:
    "border-amber-500/20 bg-background/85 supports-[backdrop-filter]:bg-background/75 [&_a]:rounded-none [&_a]:tracking-[0.12em] [&_a]:uppercase [&_a]:text-xs [&_a]:transition-all [&_a]:duration-500",
  developer:
    "border-emerald-600/20 bg-background/90 text-foreground supports-[backdrop-filter]:bg-background/80 dark:border-emerald-500/25 dark:text-zinc-100 [&_a]:rounded-md [&_a]:border [&_a]:border-emerald-600/25 [&_a]:font-mono [&_a]:text-[11px] [&_a]:uppercase [&_a]:tracking-wider [&_a]:text-emerald-900 [&_a]:transition-all [&_a]:duration-300 dark:[&_a]:border-emerald-500/25 dark:[&_a]:text-zinc-300",
  bold:
    "border-foreground/25 bg-background/90 supports-[backdrop-filter]:bg-background/80 [&_a]:rounded-none [&_a]:border-2 [&_a]:border-foreground [&_a]:font-bold [&_a]:uppercase [&_a]:tracking-tight [&_a]:transition-all [&_a]:duration-300",
  aurora:
    "border-violet-500/15 bg-[#faf9f7]/95 text-foreground supports-[backdrop-filter]:bg-[#faf9f7]/90 dark:bg-background/90 dark:supports-[backdrop-filter]:bg-background/85 [&_a]:rounded-none [&_a]:border [&_a]:border-violet-500/20 [&_a]:text-xs [&_a]:uppercase [&_a]:tracking-[0.12em] [&_a]:transition-all [&_a]:duration-300",
};

export const templateRootStyles: Record<TemplateSlug, string> = {
  modern: "selection:bg-primary/20",
  minimal: "selection:bg-foreground/10",
  professional: "selection:bg-primary/15",
  creative: "selection:bg-violet-500/20",
  elegant: "selection:bg-amber-500/20",
  developer: "selection:bg-emerald-500/25",
  bold: "selection:bg-foreground/20",
  aurora: "selection:bg-violet-500/20",
};
