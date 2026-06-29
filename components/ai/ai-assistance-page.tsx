"use client";

import Link from "next/link";
import { AIBuildChecklist } from "@/components/ai/ai-build-checklist";
import { AIBuildPathsCard } from "@/components/ai/ai-build-paths-card";
import { AIChatPanel } from "@/components/ai/ai-chat-panel";
import { AICopilotProgress } from "@/components/ai/ai-copilot-progress";
import { AIPageNav } from "@/components/ai/ai-page-nav";
import { AIPageSection } from "@/components/ai/ai-page-section";
import { JobDescriptionTailorPanel } from "@/components/ai/job-description-tailor-panel";
import { CoverLetterGeneratorPanel } from "@/components/ai/cover-letter-generator-panel";
import { PortfolioReviewPanel } from "@/components/ai/portfolio-review-panel";
import { GitHubImportPanel } from "@/components/ai/github-import-panel";
import { ResumeImportPanel } from "@/components/ai/resume-import-panel";
import { PageHeader } from "@/components/layout/page-header";
import { ProUpgradeCard } from "@/components/subscription/pro-upgrade-card";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/use-subscription";
import { cn } from "@/lib/utils";

export function AIAssistancePage() {
  const { canUseAI } = useSubscription();

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Assistance"
        description="Build a strong portfolio with guided AI tools — you stay in control of every save."
      >
        <Button variant="outline" render={<Link href="/onboarding" />} nativeButton={false}>
          Setup wizard
        </Button>
      </PageHeader>

      {!canUseAI ? (
        <ProUpgradeCard
          title="AI is a Pro feature"
          description="Upgrade to unlock resume import, portfolio review, job tailoring, cover letters, copilot chat, and AI writing tools across the app."
        />
      ) : null}

      <div className={cn("space-y-6", !canUseAI && "pointer-events-none opacity-60")}>
        <AIPageNav />

        <AIPageSection
          id="overview"
          title="Portfolio overview"
          description="Track completeness and your next recommended step."
        >
          <AICopilotProgress />
        </AIPageSection>

        <AIPageSection
          id="build"
          title="Get started"
          description="Import a resume or pick a build path, then refine sections with AI as you go."
          contentClassName="space-y-6"
        >
          <AIBuildPathsCard />
          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            <ResumeImportPanel />
            <GitHubImportPanel />
          </div>
        </AIPageSection>

        <AIPageSection
          id="analyze"
          title="Analyze & improve"
          description="Run a portfolio health check or compare your profile against a specific job posting."
          contentClassName="grid gap-6 xl:grid-cols-2 xl:items-start"
        >
          <PortfolioReviewPanel />
          <JobDescriptionTailorPanel />
        </AIPageSection>

        <AIPageSection
          id="apply"
          title="Apply to roles"
          description="Generate application materials tailored to a specific company and job posting."
        >
          <CoverLetterGeneratorPanel />
        </AIPageSection>

        <AIPageSection
          id="chat"
          title="Portfolio copilot"
          description="Ask questions, get copy suggestions, and work through gaps with context from your profile."
        >
          <AIChatPanel />
        </AIPageSection>

        <AIPageSection
          id="checklist"
          title="Build checklist"
          description="Work through each section manually or with AI helpers on individual pages."
        >
          <AIBuildChecklist />
        </AIPageSection>
      </div>
    </div>
  );
}
