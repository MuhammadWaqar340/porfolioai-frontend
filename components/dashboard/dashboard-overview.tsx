"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { cn } from "@/lib/utils";

const SECTION_LINKS = [
  { key: "profile", label: "Profile", href: "/profile", minPercent: 60 },
  { key: "skills", label: "Skills", href: "/skills", countKey: "skills_count" as const },
  {
    key: "projects",
    label: "Projects",
    href: "/projects",
    countKey: "projects_count" as const,
  },
  {
    key: "experience",
    label: "Experience",
    href: "/experience",
    countKey: "experiences_count" as const,
  },
  {
    key: "education",
    label: "Education",
    href: "/education",
    countKey: "education_count" as const,
  },
  {
    key: "certifications",
    label: "Certifications",
    href: "/certifications",
    countKey: "certifications_count" as const,
  },
] as const;

export function DashboardOverview() {
  const { stats, isLoading } = useDashboardStats();

  if (isLoading || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 animate-pulse rounded-lg bg-muted/40" />
        </CardContent>
      </Card>
    );
  }

  const snapshot = stats;

  function isSectionComplete(section: (typeof SECTION_LINKS)[number]): boolean {
    if ("minPercent" in section) {
      return snapshot.profile_completion_percent >= section.minPercent;
    }
    return snapshot[section.countKey] > 0;
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Portfolio Progress</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Profile {snapshot.profile_completion_percent}% complete
            {snapshot.is_portfolio_public ? " · Portfolio is public" : " · Portfolio is private"}
          </p>
        </div>
        <Link
          href="/preview"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Preview portfolio
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${snapshot.portfolio_completion_percent}%` }}
          />
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {SECTION_LINKS.map((section) => {
            const complete = isSectionComplete(section);
            return (
              <Link
                key={section.key}
                href={section.href}
                className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted/50"
              >
                <span>{section.label}</span>
                <span
                  className={
                    complete
                      ? "font-medium text-primary"
                      : "text-muted-foreground"
                  }
                >
                  {complete ? "Complete" : "Add content"}
                </span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
