import { ArrowRight, Pencil } from "lucide-react";
import Link from "next/link";
import { RecentProjects } from "@/components/projects/recent-projects";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { DashboardStatsGrid } from "@/components/dashboard/dashboard-stats-grid";
import { InactivityNudgeBanner } from "@/components/dashboard/inactivity-nudge-banner";
import { PortfolioAnalyticsCard } from "@/components/dashboard/portfolio-analytics-card";
import { PortfolioReviewCard } from "@/components/dashboard/portfolio-review-card";
import { EmailVerificationBanner } from "@/components/auth/email-verification-banner";
import { OnboardingBanner } from "@/components/onboarding/onboarding-banner";
import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your portfolio."
      >
        <Link href="/projects" className={buttonVariants()}>
          Add Project
        </Link>
      </PageHeader>

      <OnboardingBanner />

      <EmailVerificationBanner />

      <InactivityNudgeBanner />

      <DashboardStatsGrid />

      <PortfolioAnalyticsCard />

      <PortfolioReviewCard />

      <DashboardOverview />

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Recent Projects</CardTitle>
          <Link
            href="/projects"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <RecentProjects limit={3} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/profile"
              className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start")}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
            <Link
              href="/templates"
              className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start")}
            >
              Choose Template
            </Link>
            <Link
              href="/ai"
              className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start")}
            >
              AI Assistant
            </Link>
            <Link
              href="/preview"
              className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start")}
            >
              Preview Portfolio
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• Add at least 3-5 projects to showcase your skills</p>
            <p>• Write a compelling about section — try our AI generator</p>
            <p>• Keep your skills list focused and relevant</p>
            <p>• Preview your portfolio before sharing the link</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
