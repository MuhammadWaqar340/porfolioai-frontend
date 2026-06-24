import type { DashboardStats } from "@/lib/api/types";

export type BuildStepId =
  | "profile"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "certifications"
  | "template"
  | "preview";

export interface BuildStep {
  id: BuildStepId;
  title: string;
  description: string;
  href: string;
  aiHint: string;
  isComplete: (stats: DashboardStats) => boolean;
}

export const BUILD_STEPS: BuildStep[] = [
  {
    id: "profile",
    title: "Profile & About",
    description: "Name, title, and a compelling about section",
    href: "/profile",
    aiHint: "Generate or improve your About with AI",
    isComplete: (s) => s.profile_completion_percent >= 60,
  },
  {
    id: "skills",
    title: "Skills",
    description: "Show your tech stack and strengths",
    href: "/skills",
    aiHint: "Use AI skill suggestions",
    isComplete: (s) => s.skills_count > 0,
  },
  {
    id: "projects",
    title: "Projects",
    description: "Showcase work that proves your skills",
    href: "/projects",
    aiHint: "Generate project descriptions & tech stack",
    isComplete: (s) => s.projects_count > 0,
  },
  {
    id: "experience",
    title: "Experience",
    description: "Tell your professional story",
    href: "/experience",
    aiHint: "Generate role bullet points with AI",
    isComplete: (s) => s.experiences_count > 0,
  },
  {
    id: "education",
    title: "Education",
    description: "Degrees and training",
    href: "/education",
    aiHint: "Use AI suggestions on the form",
    isComplete: (s) => s.education_count > 0,
  },
  {
    id: "certifications",
    title: "Certifications",
    description: "Credentials that build trust",
    href: "/certifications",
    aiHint: "Use AI suggestions on the form",
    isComplete: (s) => s.certifications_count > 0,
  },
  {
    id: "template",
    title: "Template",
    description: "Pick how your portfolio looks",
    href: "/templates",
    aiHint: "Choose a layout that fits your role",
    isComplete: (s) => s.has_template_selected,
  },
  {
    id: "preview",
    title: "Preview & publish",
    description: "Review and share your portfolio",
    href: "/preview",
    aiHint: "Run portfolio review before going live",
    isComplete: (s) => s.is_portfolio_public,
  },
];

export interface NextStep {
  title: string;
  message: string;
  href: string;
  cta: string;
}

export function getNextStep(stats: DashboardStats): NextStep {
  const incomplete = BUILD_STEPS.filter((step) => !step.isComplete(stats));

  if (incomplete.length === 0) {
    return {
      title: "Portfolio looks strong",
      message:
        "Keep content fresh and run a review before sharing with recruiters.",
      href: "/preview",
      cta: "Preview portfolio",
    };
  }

  const next = incomplete[0];
  return {
    title: `Next: ${next.title}`,
    message: next.description,
    href: next.href,
    cta: `Go to ${next.title}`,
  };
}

export const AI_QUICK_PROMPTS = [
  "What should I improve first in my portfolio?",
  "Write a strong about section for a developer portfolio",
  "How do I describe a side project impactfully?",
  "Review my portfolio completeness and gaps",
  "Suggest skills I should highlight for my target role",
  "Help me make my experience bullets more impactful",
] as const;

export const BUILD_PATHS = [
  {
    id: "ai",
    title: "AI-assisted",
    description: "Upload a resume, import GitHub repos, generate drafts, refine with AI — you approve every save.",
    href: "#resume",
  },
  {
    id: "manual",
    title: "Manual",
    description: "Use the build checklist and fill each section yourself at your own pace.",
    href: "#checklist",
  },
  {
    id: "hybrid",
    title: "Hybrid (recommended)",
    description: "Import or generate drafts with AI, then edit and complete sections manually.",
    href: "#chat",
  },
] as const;
