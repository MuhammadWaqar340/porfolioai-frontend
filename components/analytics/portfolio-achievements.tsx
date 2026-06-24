"use client";

import { Award, Eye, FolderKanban, Rocket, Sparkles, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DashboardStats, PortfolioAnalytics } from "@/lib/api/types";

interface Achievement {
  id: string;
  label: string;
  description: string;
  earned: boolean;
  icon: typeof Eye;
}

interface PortfolioAchievementsProps {
  analytics: PortfolioAnalytics;
  stats: DashboardStats | undefined;
  isPublic: boolean;
  className?: string;
}

function buildAchievements(
  analytics: PortfolioAnalytics,
  stats: DashboardStats | undefined,
  isPublic: boolean
): Achievement[] {
  const projectsCount = stats?.projects_count ?? 0;
  const completion = stats?.portfolio_completion_percent ?? 0;

  return [
    {
      id: "published",
      label: "Live portfolio",
      description: "Make your portfolio public",
      earned: isPublic,
      icon: Rocket,
    },
    {
      id: "first-project",
      label: "First project",
      description: "Add at least one project",
      earned: projectsCount >= 1,
      icon: FolderKanban,
    },
    {
      id: "first-view",
      label: "First view",
      description: "Someone opened your portfolio",
      earned: analytics.total_views >= 1,
      icon: Eye,
    },
    {
      id: "ten-views",
      label: "Getting noticed",
      description: "Reach 10 portfolio views",
      earned: analytics.total_views >= 10,
      icon: Trophy,
    },
    {
      id: "hundred-views",
      label: "100 views",
      description: "Reach 100 portfolio views",
      earned: analytics.total_views >= 100,
      icon: Award,
    },
    {
      id: "complete",
      label: "Portfolio pro",
      description: "Reach 80% portfolio completion",
      earned: completion >= 80,
      icon: Sparkles,
    },
  ];
}

export function PortfolioAchievements({
  analytics,
  stats,
  isPublic,
  className,
}: PortfolioAchievementsProps) {
  const achievements = buildAchievements(analytics, stats, isPublic);
  const earnedCount = achievements.filter((item) => item.earned).length;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
        <CardDescription>
          {earnedCount} of {achievements.length} unlocked — keep improving and sharing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-3 sm:grid-cols-2">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <li
                key={achievement.id}
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-3",
                  achievement.earned
                    ? "border-primary/20 bg-primary/5"
                    : "border-dashed opacity-70"
                )}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    achievement.earned ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{achievement.label}</p>
                    {achievement.earned ? (
                      <Badge variant="secondary" className="text-[10px]">
                        Unlocked
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
