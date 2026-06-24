import type { TemplateSlug } from "@/constants/templates";

const shellTransition =
  "transition-all duration-500 ease-out hover:shadow-md motion-reduce:transition-none";

export function getTemplateSectionShell(
  template: TemplateSlug,
  index: number
): string {
  const accent = index % 2 === 1;
  return accent
    ? templateSectionShellAccent[template]
    : templateSectionShellBase[template];
}

export const templateBodyBackdrop: Record<TemplateSlug, string> = {
  modern:
    "relative before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,oklch(0.55_0.22_278/8%),transparent)]",
  minimal:
    "relative before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,oklch(0.5_0.02_276/6%),transparent_70%)]",
  professional:
    "relative before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(180deg,oklch(0.52_0.24_278/4%)_0%,transparent_30%,oklch(0.52_0.24_278/3%)_100%)]",
  creative:
    "relative before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_70%_45%_at_0%_50%,oklch(0.55_0.25_300/6%),transparent),radial-gradient(ellipse_60%_40%_at_100%_80%,oklch(0.6_0.2_250/6%),transparent)]",
  elegant:
    "relative before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_70%_50%_at_80%_20%,oklch(0.75_0.15_75/8%),transparent),radial-gradient(ellipse_50%_40%_at_10%_90%,oklch(0.7_0.12_55/6%),transparent)]",
  developer:
    "relative before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_80%_45%_at_50%_0%,oklch(0.65_0.18_155/12%),transparent_68%)] dark:before:bg-[linear-gradient(180deg,oklch(0.65_0.18_155/6%)_0%,transparent_40%)]",
  bold:
    "relative before:pointer-events-none before:absolute before:inset-0 before:bg-[repeating-linear-gradient(-45deg,transparent,transparent_40px,oklch(0_0_0/2%)_40px,oklch(0_0_0/2%)_41px)] dark:before:bg-[repeating-linear-gradient(-45deg,transparent,transparent_40px,oklch(1_0_0/3%)_40px,oklch(1_0_0/3%)_41px)]",
};

const templateSectionShellBase: Record<TemplateSlug, string> = {
  modern: [
    "group/section rounded-2xl border border-primary/10 p-6 sm:p-8",
    "bg-gradient-to-br from-primary/[0.06] via-background/80 to-violet-500/[0.08]",
    "shadow-[0_1px_0_0_oklch(1_0_0/40%_inset),var(--shadow-card)] backdrop-blur-sm",
    shellTransition,
    "hover:border-primary/25 hover:from-primary/[0.08] hover:to-violet-500/[0.1]",
  ].join(" "),
  minimal: [
    "group/section rounded-xl border border-border/40 p-6 sm:p-8",
    "bg-gradient-to-b from-muted/30 via-background to-background/90",
    shellTransition,
    "hover:border-border/70",
  ].join(" "),
  professional: [
    "group/section rounded-xl border border-border/60 p-6 sm:p-8",
    "bg-gradient-to-br from-muted/40 via-card/50 to-muted/20",
    "shadow-sm backdrop-blur-[1px]",
    shellTransition,
    "hover:border-primary/20 hover:from-muted/50",
  ].join(" "),
  creative: [
    "group/section rounded-2xl border border-primary/15 p-6 sm:p-8",
    "bg-gradient-to-br from-primary/[0.07] via-fuchsia-500/[0.04] to-sky-500/[0.07]",
    "shadow-lg shadow-primary/5 backdrop-blur-sm",
    shellTransition,
    "hover:border-fuchsia-500/25 hover:shadow-xl hover:shadow-fuchsia-500/10",
  ].join(" "),
  elegant: [
    "group/section rounded-none border border-amber-500/15 p-6 sm:p-8",
    "bg-gradient-to-br from-amber-500/[0.05] via-background to-orange-400/[0.04]",
    shellTransition,
    "hover:border-amber-500/30 hover:from-amber-500/[0.07]",
  ].join(" "),
  developer: [
    "group/section rounded-xl border p-6 sm:p-8",
    "border-emerald-600/25 bg-gradient-to-br from-emerald-50/90 via-card to-white",
    "shadow-[var(--shadow-card)]",
    "dark:border-emerald-500/20 dark:from-zinc-900/50 dark:via-zinc-950/30 dark:to-emerald-950/20",
    "dark:shadow-[0_0_0_1px_oklch(0.65_0.18_155/6%),inset_0_1px_0_oklch(0.65_0.18_155/8%)]",
    shellTransition,
    "hover:border-emerald-600/40 hover:shadow-[var(--shadow-card-hover)]",
    "dark:hover:border-emerald-400/35 dark:hover:shadow-[0_0_32px_-12px_oklch(0.65_0.18_155/35%)]",
  ].join(" "),
  bold: [
    "group/section rounded-none border-2 border-foreground p-6 sm:p-8",
    "bg-gradient-to-br from-background via-muted/20 to-background",
    "shadow-[4px_4px_0_0_var(--foreground)]",
    shellTransition,
    "hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--foreground)]",
  ].join(" "),
};

const templateSectionShellAccent: Record<TemplateSlug, string> = {
  modern: [
    "group/section rounded-2xl border border-violet-500/12 p-6 sm:p-8",
    "bg-gradient-to-bl from-violet-500/[0.07] via-background/80 to-primary/[0.05]",
    "shadow-[var(--shadow-card)] backdrop-blur-sm",
    shellTransition,
    "hover:border-violet-500/25",
  ].join(" "),
  minimal: [
    "group/section rounded-xl border border-transparent p-6 sm:p-8",
    "bg-gradient-to-b from-background via-muted/15 to-muted/25",
    "ring-1 ring-border/30",
    shellTransition,
    "hover:ring-border/50",
  ].join(" "),
  professional: [
    "group/section rounded-xl border-l-4 border-l-primary/40 border border-border/50 p-6 sm:p-8 pl-7",
    "bg-gradient-to-r from-primary/[0.04] via-card/40 to-transparent",
    shellTransition,
    "hover:border-l-primary/60",
  ].join(" "),
  creative: [
    "group/section rounded-2xl border border-sky-500/15 p-6 sm:p-8",
    "bg-gradient-to-tr from-sky-500/[0.06] via-background to-primary/[0.05]",
    "shadow-md shadow-sky-500/5",
    shellTransition,
    "hover:border-sky-500/30",
  ].join(" "),
  elegant: [
    "group/section rounded-none border border-amber-500/10 p-6 sm:p-8",
    "bg-gradient-to-tl from-orange-400/[0.04] via-background to-amber-500/[0.06]",
    shellTransition,
    "hover:border-amber-500/25",
  ].join(" "),
  developer: [
    "group/section rounded-xl border p-6 sm:p-8",
    "border-emerald-500/20 bg-gradient-to-tr from-slate-50 via-emerald-50/60 to-white",
    "dark:border-emerald-500/15 dark:from-emerald-950/30 dark:via-zinc-900/40 dark:to-zinc-950/50",
    shellTransition,
    "hover:border-emerald-600/35 dark:hover:border-emerald-400/30",
  ].join(" "),
  bold: [
    "group/section rounded-none border-2 border-foreground bg-foreground/[0.03] p-6 sm:p-8",
    "shadow-[6px_6px_0_0_var(--foreground)]",
    shellTransition,
    "hover:bg-foreground/[0.05]",
  ].join(" "),
};

export const templateBodyStyles: Record<TemplateSlug, string> = {
  modern: [
    "[&_section]:scroll-mt-24 [&_section]:relative",
    "[&_section_h2]:relative [&_section_h2]:z-[1] [&_section_h2]:mb-8 [&_section_h2]:text-2xl [&_section_h2]:font-bold",
    "[&_section_h2]:bg-gradient-to-r [&_section_h2]:from-foreground [&_section_h2]:to-foreground/70 [&_section_h2]:bg-clip-text [&_section_h2]:text-transparent",
    "[&_section_h2]:after:absolute [&_section_h2]:after:-bottom-2 [&_section_h2]:after:left-0 [&_section_h2]:after:z-0 [&_section_h2]:after:h-1 [&_section_h2]:after:w-12 [&_section_h2]:after:rounded-full [&_section_h2]:after:bg-gradient-to-r [&_section_h2]:after:from-primary [&_section_h2]:after:to-violet-500 [&_section_h2]:after:transition-all [&_section_h2]:after:duration-500 [&_section_h2]:after:content-['']",
    "group-hover/section:[&_section_h2]:after:w-20",
    "[&_.portfolio-item-card]:shadow-[var(--shadow-card)] [&_.portfolio-item-card]:bg-card/60 [&_.portfolio-item-card]:backdrop-blur-sm",
    "[&_.portfolio-item-card]:transition-all [&_.portfolio-item-card]:duration-500 [&_.portfolio-item-card]:ease-out",
    "[&_.portfolio-item-card]:hover:-translate-y-1 [&_.portfolio-item-card]:hover:shadow-[var(--shadow-card-hover)] [&_.portfolio-item-card]:hover:border-primary/30",
    "[&_.rounded-xl.border]:shadow-[var(--shadow-card)] [&_.rounded-xl.border]:bg-card/60 [&_.rounded-xl.border]:backdrop-blur-sm",
    "[&_.rounded-xl.border]:transition-all [&_.rounded-xl.border]:duration-500 [&_.rounded-xl.border]:ease-out",
    "[&_.rounded-xl.border]:hover:-translate-y-1 [&_.rounded-xl.border]:hover:shadow-[var(--shadow-card-hover)] [&_.rounded-xl.border]:hover:border-primary/30",
    "[&_[data-slot=badge]]:border-primary/20 [&_[data-slot=badge]]:bg-gradient-to-r [&_[data-slot=badge]]:from-primary/10 [&_[data-slot=badge]]:to-violet-500/10 [&_[data-slot=badge]]:text-primary",
    "[&_[data-slot=badge]]:transition-all [&_[data-slot=badge]]:duration-300 [&_[data-slot=badge]]:hover:from-primary/20 [&_[data-slot=badge]]:hover:to-violet-500/20 [&_[data-slot=badge]]:hover:scale-105",
    "[&_form]:rounded-xl [&_form]:border [&_form]:border-primary/15 [&_form]:bg-gradient-to-br [&_form]:from-primary/[0.04] [&_form]:to-violet-500/[0.04] [&_form]:p-6",
  ].join(" "),
  minimal: [
    "[&_section]:scroll-mt-24 [&_section]:relative",
    "[&_section_h2]:mb-8 [&_section_h2]:text-xs [&_section_h2]:font-medium [&_section_h2]:uppercase [&_section_h2]:tracking-[0.28em] [&_section_h2]:text-muted-foreground",
    "[&_section_h2]:after:mt-3 [&_section_h2]:after:block [&_section_h2]:after:h-px [&_section_h2]:after:w-10 [&_section_h2]:after:bg-gradient-to-r [&_section_h2]:after:from-foreground/40 [&_section_h2]:after:to-transparent",
    "[&_.rounded-xl.border]:rounded-lg [&_.rounded-xl.border]:border [&_.rounded-xl.border]:border-border/50 [&_.rounded-xl.border]:bg-muted/20 [&_.rounded-xl.border]:px-4 [&_.rounded-xl.border]:py-5 [&_.rounded-xl.border]:shadow-none",
    "[&_.rounded-xl.border]:transition-all [&_.rounded-xl.border]:duration-500 [&_.rounded-xl.border]:hover:border-foreground/25 [&_.rounded-xl.border]:hover:bg-muted/35 [&_.rounded-xl.border]:hover:-translate-y-0.5",
    "[&_[data-slot=badge]]:rounded-md [&_[data-slot=badge]]:border [&_[data-slot=badge]]:border-border/50 [&_[data-slot=badge]]:bg-background/80 [&_[data-slot=badge]]:text-foreground/80",
    "[&_[data-slot=badge]]:transition-all [&_[data-slot=badge]]:duration-300 [&_[data-slot=badge]]:hover:border-foreground/30 [&_[data-slot=badge]]:hover:bg-muted/50",
    "[&_form]:border [&_form]:border-border/50 [&_form]:bg-muted/20 [&_form]:p-6",
  ].join(" "),
  professional: [
    "[&_section]:scroll-mt-24 [&_section]:relative",
    "[&_section_h2]:mb-6 [&_section_h2]:text-lg [&_section_h2]:font-bold [&_section_h2]:uppercase [&_section_h2]:tracking-wide [&_section_h2]:text-foreground",
    "[&_section_h2]:border-b [&_section_h2]:border-border [&_section_h2]:pb-3",
    "[&_section_h2]:after:mt-2 [&_section_h2]:after:block [&_section_h2]:after:h-0.5 [&_section_h2]:after:w-16 [&_section_h2]:after:bg-gradient-to-r [&_section_h2]:after:from-primary [&_section_h2]:after:to-transparent",
    "[&_.rounded-xl.border]:rounded-lg [&_.rounded-xl.border]:border-border/70 [&_.rounded-xl.border]:bg-gradient-to-br [&_.rounded-xl.border]:from-card/80 [&_.rounded-xl.border]:to-muted/30",
    "[&_.rounded-xl.border]:transition-all [&_.rounded-xl.border]:duration-500 [&_.rounded-xl.border]:hover:bg-muted/40 [&_.rounded-xl.border]:hover:shadow-md [&_.rounded-xl.border]:hover:border-primary/25",
    "[&_#experience_.space-y-6>div]:relative [&_#experience_.space-y-6>div]:border-l-2 [&_#experience_.space-y-6>div]:border-primary/30 [&_#experience_.space-y-6>div]:pl-6",
    "[&_#experience_.space-y-6>div]:transition-all [&_#experience_.space-y-6>div]:duration-300 [&_#experience_.space-y-6>div]:hover:border-primary/60",
    "[&_#experience_.space-y-6>div]:before:absolute [&_#experience_.space-y-6>div]:before:-left-[5px] [&_#experience_.space-y-6>div]:before:top-6 [&_#experience_.space-y-6>div]:before:h-2.5 [&_#experience_.space-y-6>div]:before:w-2.5 [&_#experience_.space-y-6>div]:before:rounded-full [&_#experience_.space-y-6>div]:before:bg-gradient-to-br [&_#experience_.space-y-6>div]:before:from-primary [&_#experience_.space-y-6>div]:before:to-primary/60",
    "[&_[data-slot=badge]]:rounded-sm [&_[data-slot=badge]]:bg-secondary/80 [&_[data-slot=badge]]:text-secondary-foreground",
    "[&_form]:rounded-lg [&_form]:border [&_form]:border-border/70 [&_form]:bg-muted/25 [&_form]:p-6",
  ].join(" "),
  creative: [
    "[&_section]:scroll-mt-24 [&_section]:relative",
    "[&_section_h2]:mb-8 [&_section_h2]:text-3xl [&_section_h2]:font-extrabold [&_section_h2]:tracking-tight",
    "[&_section_h2]:bg-gradient-to-r [&_section_h2]:from-primary [&_section_h2]:via-fuchsia-500 [&_section_h2]:to-sky-500 [&_section_h2]:bg-clip-text [&_section_h2]:text-transparent [&_section_h2]:template-shimmer-text",
    "[&_.portfolio-item-card]:rounded-2xl [&_.portfolio-item-card]:border-primary/20 [&_.portfolio-item-card]:bg-gradient-to-br [&_.portfolio-item-card]:from-card/90 [&_.portfolio-item-card]:to-primary/5 [&_.portfolio-item-card]:shadow-lg",
    "[&_.portfolio-item-card]:transition-all [&_.portfolio-item-card]:duration-500 [&_.portfolio-item-card]:hover:-translate-y-1.5 [&_.portfolio-item-card]:hover:border-fuchsia-500/40 [&_.portfolio-item-card]:hover:shadow-2xl [&_.portfolio-item-card]:hover:shadow-fuchsia-500/15",
    "[&_.rounded-xl.border]:rounded-2xl [&_.rounded-xl.border]:border-primary/20 [&_.rounded-xl.border]:bg-gradient-to-br [&_.rounded-xl.border]:from-card/90 [&_.rounded-xl.border]:to-primary/5 [&_.rounded-xl.border]:shadow-lg",
    "[&_.rounded-xl.border]:transition-all [&_.rounded-xl.border]:duration-500 [&_.rounded-xl.border]:hover:-translate-y-1.5 [&_.rounded-xl.border]:hover:border-fuchsia-500/40 [&_.rounded-xl.border]:hover:shadow-2xl [&_.rounded-xl.border]:hover:shadow-fuchsia-500/15",
    "[&_[data-slot=badge]]:rounded-full [&_[data-slot=badge]]:border-0 [&_[data-slot=badge]]:bg-gradient-to-r [&_[data-slot=badge]]:from-primary/25 [&_[data-slot=badge]]:to-violet-500/25 [&_[data-slot=badge]]:text-primary",
    "[&_[data-slot=badge]]:transition-all [&_[data-slot=badge]]:duration-300 [&_[data-slot=badge]]:hover:scale-105 [&_[data-slot=badge]]:hover:from-primary/35 [&_[data-slot=badge]]:hover:to-violet-500/35",
    "[&_form]:rounded-2xl [&_form]:border [&_form]:border-fuchsia-500/20 [&_form]:bg-gradient-to-br [&_form]:from-primary/5 [&_form]:via-fuchsia-500/5 [&_form]:to-sky-500/5 [&_form]:p-6",
  ].join(" "),
  elegant: [
    "[&_section]:scroll-mt-24 [&_section]:relative",
    "[&_section_h2]:mb-8 [&_section_h2]:font-heading [&_section_h2]:text-3xl [&_section_h2]:font-light [&_section_h2]:tracking-tight [&_section_h2]:text-foreground",
    "[&_section_h2]:after:mt-3 [&_section_h2]:after:block [&_section_h2]:after:h-px [&_section_h2]:after:w-16 [&_section_h2]:after:bg-gradient-to-r [&_section_h2]:after:from-amber-500/70 [&_section_h2]:after:to-transparent",
    "group-hover/section:[&_section_h2]:after:w-24",
    "[&_.rounded-xl.border]:rounded-sm [&_.rounded-xl.border]:border-amber-500/20 [&_.rounded-xl.border]:bg-gradient-to-br [&_.rounded-xl.border]:from-card/60 [&_.rounded-xl.border]:to-amber-500/[0.04] [&_.rounded-xl.border]:shadow-sm",
    "[&_.rounded-xl.border]:transition-all [&_.rounded-xl.border]:duration-500 [&_.rounded-xl.border]:hover:-translate-y-0.5 [&_.rounded-xl.border]:hover:border-amber-500/35 [&_.rounded-xl.border]:hover:shadow-md",
    "[&_[data-slot=badge]]:rounded-sm [&_[data-slot=badge]]:border [&_[data-slot=badge]]:border-amber-500/25 [&_[data-slot=badge]]:bg-amber-500/10 [&_[data-slot=badge]]:text-amber-800 dark:[&_[data-slot=badge]]:text-amber-200",
    "[&_form]:border [&_form]:border-amber-500/20 [&_form]:bg-gradient-to-br [&_form]:from-amber-500/[0.04] [&_form]:to-orange-400/[0.03] [&_form]:p-6",
  ].join(" "),
  developer: [
    "[&_section]:scroll-mt-24 [&_section]:relative",
    "[&_section_h2]:mb-6 [&_section_h2]:font-mono [&_section_h2]:text-sm [&_section_h2]:font-semibold [&_section_h2]:uppercase [&_section_h2]:tracking-[0.2em]",
    "[&_section_h2]:text-emerald-800 dark:[&_section_h2]:text-emerald-400",
    "[&_section_h2]:before:mr-2 [&_section_h2]:before:text-emerald-700/80 [&_section_h2]:before:content-['//'] dark:[&_section_h2]:before:text-emerald-500/70",
    "[&_section_h2]:after:mt-2 [&_section_h2]:after:block [&_section_h2]:after:h-px [&_section_h2]:after:w-full [&_section_h2]:after:max-w-xs [&_section_h2]:after:bg-gradient-to-r [&_section_h2]:after:from-emerald-600/45 [&_section_h2]:after:to-transparent dark:[&_section_h2]:after:from-emerald-500/50",
    "[&_section_p]:text-muted-foreground",
    "[&_.rounded-xl.border]:rounded-lg [&_.rounded-xl.border]:border-emerald-600/20 [&_.rounded-xl.border]:bg-card",
    "[&_.rounded-xl.border]:shadow-[var(--shadow-card)] [&_.rounded-xl.border]:transition-all [&_.rounded-xl.border]:duration-500",
    "[&_.rounded-xl.border]:hover:border-emerald-600/35 [&_.rounded-xl.border]:hover:shadow-[var(--shadow-card-hover)]",
    "dark:[&_.rounded-xl.border]:border-emerald-500/25 dark:[&_.rounded-xl.border]:bg-gradient-to-br dark:[&_.rounded-xl.border]:from-zinc-900/70 dark:[&_.rounded-xl.border]:to-zinc-950/50",
    "dark:[&_.rounded-xl.border]:shadow-[0_0_0_1px_oklch(0.65_0.18_155/10%)] dark:[&_.rounded-xl.border]:hover:border-emerald-400/45 dark:[&_.rounded-xl.border]:hover:shadow-[0_0_28px_-8px_oklch(0.65_0.18_155/40%)]",
    "[&_[data-slot=badge]]:rounded-md [&_[data-slot=badge]]:border [&_[data-slot=badge]]:border-emerald-600/30 [&_[data-slot=badge]]:bg-emerald-100 [&_[data-slot=badge]]:font-mono [&_[data-slot=badge]]:text-xs [&_[data-slot=badge]]:text-emerald-900",
    "dark:[&_[data-slot=badge]]:border-emerald-500/30 dark:[&_[data-slot=badge]]:bg-emerald-500/10 dark:[&_[data-slot=badge]]:text-emerald-400",
    "[&_form]:rounded-lg [&_form]:border [&_form]:border-emerald-600/20 [&_form]:bg-emerald-50/60 [&_form]:p-6 [&_form]:font-mono [&_form]:text-sm",
    "dark:[&_form]:border-emerald-500/25 dark:[&_form]:bg-zinc-900/60",
  ].join(" "),
  bold: [
    "[&_section]:scroll-mt-24 [&_section]:relative",
    "[&_section_h2]:mb-8 [&_section_h2]:text-3xl [&_section_h2]:font-black [&_section_h2]:uppercase [&_section_h2]:tracking-tighter [&_section_h2]:text-foreground sm:[&_section_h2]:text-4xl",
    "[&_section_h2]:after:mt-3 [&_section_h2]:after:block [&_section_h2]:after:h-1 [&_section_h2]:after:w-12 [&_section_h2]:after:bg-foreground",
    "group-hover/section:[&_section_h2]:after:w-20",
    "[&_.rounded-xl.border]:rounded-none [&_.rounded-xl.border]:border-2 [&_.rounded-xl.border]:border-foreground [&_.rounded-xl.border]:bg-background [&_.rounded-xl.border]:shadow-[4px_4px_0_0_var(--foreground)]",
    "[&_.rounded-xl.border]:transition-all [&_.rounded-xl.border]:duration-300 [&_.rounded-xl.border]:hover:translate-x-0.5 [&_.rounded-xl.border]:hover:translate-y-0.5 [&_.rounded-xl.border]:hover:shadow-[6px_6px_0_0_var(--foreground)]",
    "[&_[data-slot=badge]]:rounded-none [&_[data-slot=badge]]:border-2 [&_[data-slot=badge]]:border-foreground [&_[data-slot=badge]]:bg-foreground [&_[data-slot=badge]]:font-bold [&_[data-slot=badge]]:uppercase [&_[data-slot=badge]]:text-background",
    "[&_form]:border-2 [&_form]:border-foreground [&_form]:bg-background [&_form]:p-6 [&_form]:shadow-[4px_4px_0_0_var(--foreground)]",
  ].join(" "),
};

/** @deprecated Use TemplateSeparator component instead */
export const templateSeparatorStyles: Record<TemplateSlug, string> = {
  modern:
    "bg-gradient-to-r from-transparent via-primary/30 to-transparent",
  minimal: "bg-border/50",
  professional: "bg-gradient-to-r from-primary/40 via-border to-transparent",
  creative:
    "h-px bg-gradient-to-r from-primary/50 via-fuchsia-500/50 to-sky-500/50",
  elegant:
    "h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent",
  developer:
    "h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent",
  bold: "h-1 bg-foreground",
};
