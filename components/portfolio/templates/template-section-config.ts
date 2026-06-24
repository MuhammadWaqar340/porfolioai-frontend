import type { TemplateSlug } from "@/constants/templates";
import { FREE_TEMPLATE_SLUGS } from "@/constants/plans";
import { animationDelays } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type PortfolioSectionId =
  | "intro-video"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "certifications"
  | "testimonials"
  | "contact";

const PRO_TEMPLATES: TemplateSlug[] = [
  "modern",
  "professional",
  "creative",
  "elegant",
  "developer",
];

const shellTransition =
  "transition-all duration-500 ease-out hover:shadow-md motion-reduce:transition-none";

export function isProTemplate(template: TemplateSlug): boolean {
  return PRO_TEMPLATES.includes(template);
}

export function isFreeTemplate(template: TemplateSlug): boolean {
  return (FREE_TEMPLATE_SLUGS as readonly string[]).includes(template);
}

const sectionDelayByIndex = [
  animationDelays[100],
  animationDelays[150],
  animationDelays[200],
  animationDelays[250],
  animationDelays[300],
  animationDelays[350],
  animationDelays[400],
  animationDelays[500],
] as const;

/** Unique entrance animation per section for each Pro template */
const proSectionAnimations: Record<
  TemplateSlug,
  Record<PortfolioSectionId, string>
> = {
  modern: {
    "intro-video": "animate-template-zoom-in",
    skills: "animate-template-blur-in",
    projects: "animate-template-flip-in",
    experience: "animate-template-slide-in",
    education: "animate-template-rise",
    certifications: "animate-template-blur-in",
    testimonials: "animate-template-sweep-in",
    contact: "animate-template-rise",
  },
  professional: {
    "intro-video": "animate-template-rise",
    skills: "animate-template-slide-in",
    projects: "animate-template-reveal",
    experience: "animate-template-slide-in",
    education: "animate-template-rise",
    certifications: "animate-template-reveal",
    testimonials: "animate-template-slide-in",
    contact: "animate-template-rise",
  },
  creative: {
    "intro-video": "animate-template-zoom-in",
    skills: "animate-template-flip-in",
    projects: "animate-template-zoom-in",
    experience: "animate-template-sweep-in",
    education: "animate-template-blur-in",
    certifications: "animate-template-flip-in",
    testimonials: "animate-template-zoom-in",
    contact: "animate-template-sweep-in",
  },
  elegant: {
    "intro-video": "animate-template-blur-in",
    skills: "animate-template-rise",
    projects: "animate-template-blur-in",
    experience: "animate-template-rise",
    education: "animate-template-blur-in",
    certifications: "animate-template-rise",
    testimonials: "animate-template-blur-in",
    contact: "animate-template-rise",
  },
  developer: {
    "intro-video": "animate-template-slide-in",
    skills: "animate-template-slide-in",
    projects: "animate-template-zoom-in",
    experience: "animate-template-reveal",
    education: "animate-template-slide-in",
    certifications: "animate-template-flip-in",
    testimonials: "animate-template-slide-in",
    contact: "animate-template-zoom-in",
  },
  minimal: {
    "intro-video": "animate-template-reveal",
    skills: "animate-template-reveal",
    projects: "animate-template-reveal",
    experience: "animate-template-reveal",
    education: "animate-template-reveal",
    certifications: "animate-template-reveal",
    testimonials: "animate-template-reveal",
    contact: "animate-template-reveal",
  },
  bold: {
    "intro-video": "animate-template-rise",
    skills: "animate-template-rise",
    projects: "animate-template-rise",
    experience: "animate-template-rise",
    education: "animate-template-rise",
    certifications: "animate-template-rise",
    testimonials: "animate-template-rise",
    contact: "animate-template-rise",
  },
};

const proSectionShells: Record<TemplateSlug, Record<PortfolioSectionId, string>> = {
  modern: {
    "intro-video":
      "rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-violet-500/5 to-background p-6 sm:p-8 shadow-[0_0_60px_-30px_var(--primary)] backdrop-blur-md hover:border-violet-500/35",
    skills:
      "rounded-2xl border border-violet-500/15 bg-gradient-to-br from-violet-500/[0.08] via-background/95 to-primary/[0.04] p-6 sm:p-8 shadow-inner shadow-violet-500/5 hover:border-primary/30 hover:shadow-[0_0_48px_-20px_violet-500/30%]",
    projects:
      "rounded-3xl border border-primary/15 bg-gradient-to-bl from-background via-primary/[0.03] to-violet-500/[0.08] p-6 sm:p-10 shadow-[0_24px_60px_-32px_rgba(124,58,237,0.25)] hover:-translate-y-0.5 hover:border-violet-500/30",
    experience:
      "rounded-2xl border-l-4 border-l-primary/50 border border-primary/10 bg-gradient-to-r from-primary/[0.06] via-background/90 to-transparent p-6 sm:p-8 pl-7 hover:border-l-violet-500/70",
    education:
      "rounded-2xl border border-violet-500/12 bg-gradient-to-tr from-violet-500/[0.05] to-background p-6 sm:p-8 hover:border-primary/25",
    certifications:
      "rounded-2xl border border-violet-500/12 bg-gradient-to-tr from-violet-500/[0.05] to-background p-6 sm:p-8 hover:border-primary/25",
    testimonials:
      "rounded-3xl border border-violet-500/15 bg-gradient-to-br from-violet-500/[0.06] via-background to-primary/[0.04] p-6 sm:p-8",
    contact:
      "rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.05] via-background to-violet-500/[0.07] p-6 sm:p-8 backdrop-blur-sm",
  },
  professional: {
    "intro-video":
      "rounded-xl border border-border/70 bg-gradient-to-br from-muted/50 via-card to-primary/[0.03] p-6 sm:p-8 shadow-sm hover:border-primary/25",
    skills:
      "rounded-xl border border-border/60 bg-card/80 p-6 sm:p-8 shadow-sm hover:border-primary/30 hover:bg-muted/30",
    projects:
      "rounded-xl border-2 border-border/50 bg-gradient-to-b from-card to-muted/20 p-6 sm:p-8 hover:border-primary/35 hover:shadow-md",
    experience:
      "rounded-xl border-l-[5px] border-l-primary bg-gradient-to-r from-primary/[0.05] via-card/50 to-transparent p-6 sm:p-8 pl-8 shadow-sm",
    education:
      "rounded-lg border border-border/70 bg-muted/25 p-6 sm:p-8 hover:bg-muted/40",
    certifications:
      "rounded-xl border border-primary/15 bg-card p-6 sm:p-8 shadow-[inset_0_1px_0_oklch(1_0_0/40%)] hover:border-primary/30",
    testimonials:
      "rounded-xl border border-border bg-gradient-to-br from-muted/30 to-card p-6 sm:p-8",
    contact:
      "rounded-xl border border-primary/20 bg-muted/20 p-6 sm:p-8 hover:border-primary/30",
  },
  creative: {
    "intro-video":
      "rounded-[2rem] border-2 border-fuchsia-500/25 bg-gradient-to-br from-primary/10 via-fuchsia-500/5 to-sky-500/10 p-6 sm:p-10 shadow-xl shadow-fuchsia-500/10 hover:rotate-[0.25deg]",
    skills:
      "rounded-[1.75rem] border border-sky-500/20 bg-gradient-to-tr from-sky-500/[0.08] via-background to-fuchsia-500/[0.06] p-6 sm:p-8 hover:shadow-2xl hover:shadow-fuchsia-500/15",
    projects:
      "rounded-[2rem] border-2 border-primary/20 bg-gradient-to-bl from-fuchsia-500/[0.07] via-background to-sky-500/[0.08] p-6 sm:p-10 shadow-2xl shadow-primary/10 hover:-translate-y-1",
    experience:
      "rounded-3xl border border-fuchsia-500/20 bg-gradient-to-r from-primary/5 to-sky-500/5 p-6 sm:p-8 skew-y-0 hover:skew-y-0",
    education:
      "rounded-[1.5rem] border border-sky-500/25 bg-gradient-to-tl from-sky-500/10 to-primary/5 p-6 sm:p-8",
    certifications:
      "rounded-[1.5rem] border border-sky-500/25 bg-gradient-to-tl from-sky-500/10 to-primary/5 p-6 sm:p-8",
    testimonials:
      "rounded-[2rem] border border-primary/25 bg-gradient-to-br from-violet-500/10 to-sky-500/10 p-6 sm:p-8",
    contact:
      "rounded-[1.75rem] border border-fuchsia-500/25 bg-gradient-to-r from-primary/8 via-fuchsia-500/5 to-sky-500/8 p-6 sm:p-8",
  },
  elegant: {
    "intro-video":
      "rounded-sm border border-amber-500/25 bg-gradient-to-b from-amber-500/[0.06] to-background p-8 sm:p-10 hover:border-amber-500/40",
    skills:
      "rounded-none border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.04] via-background to-orange-300/[0.03] p-7 sm:p-9",
    projects:
      "rounded-sm border border-amber-600/20 bg-gradient-to-t from-orange-400/[0.04] to-background p-7 sm:p-10 shadow-sm hover:shadow-md hover:shadow-amber-500/10",
    experience:
      "rounded-none border-y border-amber-500/25 bg-amber-500/[0.02] px-6 py-8 sm:px-10 sm:py-10",
    education:
      "rounded-sm border border-amber-500/15 bg-gradient-to-bl from-background to-amber-500/[0.05] p-7 sm:p-9",
    certifications:
      "rounded-none border border-amber-500/20 bg-gradient-to-tr from-amber-500/[0.03] to-background p-7 sm:p-9",
    testimonials:
      "rounded-sm border border-amber-500/20 bg-amber-500/[0.03] p-8 sm:p-10",
    contact:
      "rounded-sm border border-amber-600/25 bg-gradient-to-b from-amber-500/[0.05] to-background p-7 sm:p-9",
  },
  developer: {
    "intro-video":
      "rounded-lg border border-emerald-500/30 bg-zinc-950/90 p-6 sm:p-8 font-mono shadow-[0_0_40px_-12px_oklch(0.65_0.18_155/50%)] dark:bg-zinc-900/80",
    skills:
      "rounded-lg border border-emerald-600/25 bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/50 p-6 sm:p-8 dark:from-zinc-900/60 dark:via-zinc-950/40 dark:to-emerald-950/30",
    projects:
      "rounded-lg border border-emerald-500/30 bg-card p-6 sm:p-8 shadow-[var(--shadow-card)] dark:border-emerald-400/25 dark:bg-zinc-900/70",
    experience:
      "rounded-lg border border-emerald-600/20 bg-gradient-to-r from-emerald-50/80 via-card to-white p-6 sm:p-8 dark:from-emerald-950/20 dark:via-zinc-900/50 dark:to-zinc-950/60",
    education:
      "rounded-lg border border-dashed border-emerald-500/35 bg-emerald-50/40 p-6 sm:p-8 dark:border-emerald-500/30 dark:bg-zinc-900/50",
    certifications:
      "rounded-lg border border-emerald-500/25 bg-gradient-to-b from-white to-emerald-50/60 p-6 sm:p-8 dark:from-zinc-900 dark:to-emerald-950/40",
    testimonials:
      "rounded-lg border border-emerald-500/20 bg-zinc-900/5 p-6 sm:p-8 dark:bg-zinc-900/60",
    contact:
      "rounded-lg border border-emerald-500/30 bg-emerald-50/50 p-6 sm:p-8 font-mono text-sm dark:bg-zinc-900/70",
  },
  minimal: {
    "intro-video": "",
    skills: "",
    projects: "",
    experience: "",
    education: "",
    certifications: "",
    testimonials: "",
    contact: "",
  },
  bold: {
    "intro-video": "",
    skills: "",
    projects: "",
    experience: "",
    education: "",
    certifications: "",
    testimonials: "",
    contact: "",
  },
};

/** Section-specific inner content styling (grids, cards, badges) */
const proSectionInnerStyles: Partial<
  Record<TemplateSlug, Partial<Record<PortfolioSectionId, string>>>
> = {
  modern: {
    skills:
      "[&_[data-portfolio-section=skills]_h2]:after:w-16 [&_[data-portfolio-section=skills]_.flex-wrap]:gap-3 [&_[data-portfolio-section=skills]_[data-slot=badge]]:rounded-full [&_[data-portfolio-section=skills]_[data-slot=badge]]:px-4 [&_[data-portfolio-section=skills]_[data-slot=badge]]:py-2",
    projects:
      "[&_[data-portfolio-section=projects]_.grid]:gap-8 [&_[data-portfolio-section=projects]_.group]:rounded-2xl [&_[data-portfolio-section=projects]_.group]:shadow-lg [&_[data-portfolio-section=projects]_.group]:transition-transform [&_[data-portfolio-section=projects]_.group]:duration-500 [&_[data-portfolio-section=projects]_.group]:hover:-translate-y-1",
    experience:
      "[&_[data-portfolio-section=experience]_.space-y-6>div]:border-l-2 [&_[data-portfolio-section=experience]_.space-y-6>div]:border-violet-500/30 [&_[data-portfolio-section=experience]_.space-y-6>div]:pl-6",
    education: "[&_[data-portfolio-section=education]_.grid]:gap-5",
    certifications:
      "[&_[data-portfolio-section=certifications]_.grid>div]:overflow-hidden [&_[data-portfolio-section=certifications]_.grid>div]:rounded-2xl [&_[data-portfolio-section=certifications]_.grid>div]:border [&_[data-portfolio-section=certifications]_.grid>div]:border-primary/10",
    testimonials:
      "[&_[data-portfolio-section=testimonials]_blockquote]:text-base [&_[data-portfolio-section=testimonials]_.grid]:gap-6",
    contact:
      "[&_[data-portfolio-section=contact]_form]:rounded-xl [&_[data-portfolio-section=contact]_form]:border-primary/20 [&_[data-portfolio-section=contact]_form]:shadow-sm",
  },
  professional: {
    skills:
      "[&_[data-portfolio-section=skills]_.flex-wrap]:gap-2.5 [&_[data-portfolio-section=skills]_[data-slot=badge]]:rounded-sm",
    projects:
      "[&_[data-portfolio-section=projects]_.grid]:gap-6 [&_[data-portfolio-section=projects]_.group]:rounded-lg",
    experience:
      "[&_[data-portfolio-section=experience]_.space-y-6>div]:rounded-lg [&_[data-portfolio-section=experience]_.space-y-6>div]:border [&_[data-portfolio-section=experience]_.space-y-6>div]:bg-card/60",
    education: "[&_[data-portfolio-section=education]_.grid>div]:bg-card/80",
    certifications:
      "[&_[data-portfolio-section=certifications]_.grid>div]:border-2 [&_[data-portfolio-section=certifications]_.grid>div]:border-border/60",
    testimonials:
      "[&_[data-portfolio-section=testimonials]_figure]:rounded-lg [&_[data-portfolio-section=testimonials]_figure]:border-2",
    contact:
      "[&_[data-portfolio-section=contact]_form]:rounded-lg [&_[data-portfolio-section=contact]_form]:border-2 [&_[data-portfolio-section=contact]_form]:border-border/60",
  },
  creative: {
    skills:
      "[&_[data-portfolio-section=skills]_[data-slot=badge]]:rounded-full [&_[data-portfolio-section=skills]_[data-slot=badge]]:rotate-0 [&_[data-portfolio-section=skills]_[data-slot=badge]]:hover:-rotate-2 [&_[data-portfolio-section=skills]_[data-slot=badge]]:transition-transform",
    projects:
      "[&_[data-portfolio-section=projects]_.grid]:gap-8 [&_[data-portfolio-section=projects]_.group]:rounded-[1.25rem] [&_[data-portfolio-section=projects]_.group]:shadow-xl [&_[data-portfolio-section=projects]_.group]:hover:rotate-[0.35deg]",
    experience:
      "[&_[data-portfolio-section=experience]_.space-y-6>div]:rounded-2xl [&_[data-portfolio-section=experience]_.space-y-6>div]:border-primary/15 [&_[data-portfolio-section=experience]_.space-y-6>div]:shadow-md",
    education:
      "[&_[data-portfolio-section=education]_.grid>div]:rounded-2xl [&_[data-portfolio-section=education]_.grid>div]:border-fuchsia-500/15",
    certifications:
      "[&_[data-portfolio-section=certifications]_.grid>div]:rounded-2xl [&_[data-portfolio-section=certifications]_.grid>div]:transition-transform [&_[data-portfolio-section=certifications]_.grid>div]:hover:-rotate-0",
    testimonials:
      "[&_[data-portfolio-section=testimonials]_figure]:rounded-2xl [&_[data-portfolio-section=testimonials]_figure]:bg-gradient-to-br [&_[data-portfolio-section=testimonials]_figure]:from-primary/5 [&_[data-portfolio-section=testimonials]_figure]:to-fuchsia-500/5",
    contact:
      "[&_[data-portfolio-section=contact]_form]:rounded-2xl [&_[data-portfolio-section=contact]_form]:border-fuchsia-500/25",
  },
  elegant: {
    skills:
      "[&_[data-portfolio-section=skills]_[data-slot=badge]]:rounded-sm [&_[data-portfolio-section=skills]_[data-slot=badge]]:border-amber-500/20",
    projects:
      "[&_[data-portfolio-section=projects]_.grid]:gap-7 [&_[data-portfolio-section=projects]_.group]:rounded-sm [&_[data-portfolio-section=projects]_.group]:shadow-sm",
    experience:
      "[&_[data-portfolio-section=experience]_.space-y-6>div]:border-b [&_[data-portfolio-section=experience]_.space-y-6>div]:border-amber-500/15 [&_[data-portfolio-section=experience]_.space-y-6>div]:pb-6 [&_[data-portfolio-section=experience]_.space-y-6>div]:rounded-none",
    education:
      "[&_[data-portfolio-section=education]_.grid>div]:rounded-sm [&_[data-portfolio-section=education]_.grid>div]:border-amber-500/15",
    certifications:
      "[&_[data-portfolio-section=certifications]_.grid>div]:rounded-sm [&_[data-portfolio-section=certifications]_.grid>div]:shadow-sm",
    testimonials:
      "[&_[data-portfolio-section=testimonials]_figure]:rounded-sm [&_[data-portfolio-section=testimonials]_figure]:border-amber-500/20",
    contact:
      "[&_[data-portfolio-section=contact]_form]:rounded-sm [&_[data-portfolio-section=contact]_form]:border-amber-500/25",
  },
  developer: {
    skills:
      "[&_[data-portfolio-section=skills]_h2]:before:content-['const_skills_='] [&_[data-portfolio-section=skills]_h2]:after:content-[';'] [&_[data-portfolio-section=skills]_[data-slot=badge]]:font-mono [&_[data-portfolio-section=skills]_[data-slot=badge]]:text-[11px]",
    projects:
      "[&_[data-portfolio-section=projects]_.group]:rounded-lg [&_[data-portfolio-section=projects]_.group]:border-emerald-500/25 [&_[data-portfolio-section=projects]_.group]:before:block [&_[data-portfolio-section=projects]_.group]:before:h-6 [&_[data-portfolio-section=projects]_.group]:before:border-b [&_[data-portfolio-section=projects]_.group]:before:border-emerald-500/20 [&_[data-portfolio-section=projects]_.group]:before:bg-emerald-500/5",
    experience:
      "[&_[data-portfolio-section=experience]_.space-y-6>div]:font-mono [&_[data-portfolio-section=experience]_.space-y-6>div]:text-sm [&_[data-portfolio-section=experience]_.space-y-6>div]:border-l-2 [&_[data-portfolio-section=experience]_.space-y-6>div]:border-emerald-500/40 [&_[data-portfolio-section=experience]_.space-y-6>div]:pl-5",
    education:
      "[&_[data-portfolio-section=education]_.grid>div]:font-mono [&_[data-portfolio-section=education]_.grid>div]:text-sm [&_[data-portfolio-section=education]_.grid>div]:border-emerald-500/20",
    certifications:
      "[&_[data-portfolio-section=certifications]_.grid>div]:font-mono [&_[data-portfolio-section=certifications]_.grid>div]:text-xs",
    testimonials:
      "[&_[data-portfolio-section=testimonials]_figure]:font-mono [&_[data-portfolio-section=testimonials]_figure]:text-sm [&_[data-portfolio-section=testimonials]_figure]:border-emerald-500/20",
    contact:
      "[&_[data-portfolio-section=contact]_form]:font-mono [&_[data-portfolio-section=contact]_form]:text-sm [&_[data-portfolio-section=contact]_form]:border-emerald-500/30",
  },
};

export function getSectionAnimationClass(
  template: TemplateSlug,
  sectionId: PortfolioSectionId,
  index: number
): string {
  const delay =
    sectionDelayByIndex[Math.min(index, sectionDelayByIndex.length - 1)];
  const animation =
    proSectionAnimations[template]?.[sectionId] ?? "animate-template-reveal";
  return cn(animation, delay, "opacity-0");
}

export function getProSectionShell(
  template: TemplateSlug,
  sectionId: PortfolioSectionId
): string {
  const shell = proSectionShells[template]?.[sectionId];
  if (!shell) return "";
  return cn("group/section", shell, shellTransition);
}

/** Section-specific heading accents (applied on TemplateSection wrapper) */
const proSectionHeadingAccents: Partial<
  Record<TemplateSlug, Partial<Record<PortfolioSectionId, string>>>
> = {
  modern: {
    skills: "[&_section_h2]:after:from-violet-500 [&_section_h2]:after:to-primary",
    projects: "[&_section_h2]:text-3xl [&_section_h2]:after:w-20 [&_section_h2]:after:from-primary [&_section_h2]:after:to-sky-500",
    experience: "[&_section_h2]:after:from-primary [&_section_h2]:after:to-violet-500/60",
    education: "[&_section_h2]:after:from-violet-500/80 [&_section_h2]:after:to-transparent",
    certifications: "[&_section_h2]:after:from-violet-500/80 [&_section_h2]:after:to-transparent",
    testimonials: "[&_section_h2]:italic [&_section_h2]:font-semibold",
    contact: "[&_section_h2]:after:w-24",
    "intro-video": "[&_section_h2]:text-transparent [&_section_h2]:bg-clip-text [&_section_h2]:bg-gradient-to-r [&_section_h2]:from-primary [&_section_h2]:to-violet-500",
  },
  professional: {
    skills: "[&_section_h2]:text-primary",
    projects: "[&_section_h2]:border-primary/30 [&_section_h2]:after:w-24",
    experience: "[&_section_h2]:border-l-4 [&_section_h2]:border-l-primary [&_section_h2]:pl-4",
    education: "[&_section_h2]:text-muted-foreground",
    certifications: "[&_section_h2]:after:from-primary [&_section_h2]:after:w-20",
    testimonials: "[&_section_h2]:normal-case [&_section_h2]:tracking-normal",
    contact: "[&_section_h2]:border-b-2 [&_section_h2]:border-primary/40",
    "intro-video": "[&_section_h2]:text-primary",
  },
  creative: {
    skills: "[&_section_h2]:from-sky-500 [&_section_h2]:via-fuchsia-500 [&_section_h2]:to-primary",
    projects: "[&_section_h2]:text-4xl [&_section_h2]:rotate-0 hover:[&_section_h2]:rotate-[-0.5deg] [&_section_h2]:transition-transform",
    experience: "[&_section_h2]:from-fuchsia-500 [&_section_h2]:to-sky-500",
    education: "[&_section_h2]:from-primary [&_section_h2]:to-violet-500",
    certifications: "[&_section_h2]:after:from-primary [&_section_h2]:after:to-violet-500",
    testimonials: "[&_section_h2]:text-2xl",
    contact: "[&_section_h2]:from-fuchsia-500 [&_section_h2]:via-primary [&_section_h2]:to-sky-500",
    "intro-video": "[&_section_h2]:text-4xl",
  },
  elegant: {
    skills: "[&_section_h2]:text-amber-800 dark:[&_section_h2]:text-amber-200",
    projects: "[&_section_h2]:text-4xl [&_section_h2]:font-normal",
    experience: "[&_section_h2]:after:from-amber-600/80",
    education: "[&_section_h2]:font-light [&_section_h2]:italic",
    certifications:
      "[&_section_h2]:text-base [&_section_h2]:font-semibold [&_section_h2]:uppercase [&_section_h2]:tracking-wide",
    testimonials: "[&_section_h2]:font-heading [&_section_h2]:text-2xl",
    contact: "[&_section_h2]:after:w-20",
    "intro-video": "[&_section_h2]:text-4xl [&_section_h2]:font-extralight",
  },
  developer: {
    skills: "[&_section_h2]:text-emerald-600 dark:[&_section_h2]:text-emerald-400",
    projects: "[&_section_h2]:before:content-['export_'] [&_section_h2]:after:content-['_projects']",
    experience: "[&_section_h2]:before:content-['//_'] [&_section_h2]:after:content-['.map()']",
    education: "[&_section_h2]:before:content-['class_']",
    certifications: "[&_section_h2]:text-emerald-700/90 dark:[&_section_h2]:text-emerald-300",
    testimonials: "[&_section_h2]:before:content-['/*_'] [&_section_h2]:after:content-['_*/']",
    contact: "[&_section_h2]:before:content-['async_'] [&_section_h2]:after:content-['()']",
    "intro-video": "[&_section_h2]:text-emerald-500",
  },
};

export function getProSectionInnerStyle(
  template: TemplateSlug,
  sectionId: PortfolioSectionId
): string {
  if (!isProTemplate(template)) return "";
  const inner = proSectionInnerStyles[template]?.[sectionId] ?? "";
  const heading = proSectionHeadingAccents[template]?.[sectionId] ?? "";
  return cn(inner, heading);
}
