"use client";

import { StatCard } from "@/components/cards/stat-card";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

function formatSubtitle(
  count: number,
  singular: string,
  plural: string
): string {
  return count === 1 ? `1 ${singular}` : `${count} ${plural}`;
}

export function DashboardStatsGrid() {
  const { stats, isLoading, isFetching } = useDashboardStats();

  if (isLoading && !stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-xl border bg-muted/40"
          />
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        Unable to load dashboard stats. Try refreshing the page.
      </div>
    );
  }

  const cards = [
    {
      label: "Total Projects",
      value: stats.projects_count,
      icon: "briefcase",
      change: formatSubtitle(stats.projects_count, "project", "projects"),
    },
    {
      label: "Skills",
      value: stats.skills_count,
      icon: "wrench",
      change: formatSubtitle(
        stats.skill_categories_count,
        "category",
        "categories"
      ),
    },
    {
      label: "Experience",
      value: stats.experiences_count,
      icon: "building",
      change: `${stats.education_count} education · ${stats.certifications_count} certifications`,
    },
    {
      label: "Portfolio Completion",
      value: `${stats.portfolio_completion_percent}%`,
      icon: "chart",
      change: `${stats.sections_completed}/${stats.sections_total} sections · ${stats.portfolio_views_last_7_days} views this week`,
    },
  ];

  return (
    <div className="space-y-3">
      <div
        className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${
          isFetching ? "opacity-80" : ""
        }`}
      >
        {cards.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
          />
        ))}
      </div>
      {isFetching && stats ? (
        <p className="text-xs text-muted-foreground">Updating stats…</p>
      ) : null}
    </div>
  );
}
