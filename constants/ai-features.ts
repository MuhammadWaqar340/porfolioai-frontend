import type { AIFeature } from "@/types";

export const AI_FEATURES: AIFeature[] = [
  {
    id: "about-generator",
    title: "AI About Generator",
    description:
      "Generate professional summaries tailored to your experience and career goals.",
    icon: "user",
  },
  {
    id: "project-description",
    title: "AI Project Description Generator",
    description:
      "Create compelling project descriptions that highlight your technical skills and impact.",
    icon: "briefcase",
  },
  {
    id: "resume-import",
    title: "Resume to Portfolio",
    description:
      "Upload your resume and automatically fill all portfolio sections with AI extraction.",
    icon: "upload",
  },
  {
    id: "portfolio-review",
    title: "Portfolio Review",
    description:
      "Get AI-powered suggestions to improve your portfolio's impact and completeness.",
    icon: "search",
  },
  {
    id: "cover-letter",
    title: "AI Cover Letter Generator",
    description:
      "Create a tailored cover letter from your portfolio and a job posting in seconds.",
    icon: "file-text",
  },
];
