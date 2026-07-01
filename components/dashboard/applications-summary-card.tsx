"use client";

import { ArrowRight, KanbanSquare } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FREE_ACTIVE_APPLICATION_LIMIT } from "@/constants/applications";
import { useSubscription } from "@/hooks/use-subscription";
import { cn } from "@/lib/utils";
import { useGetJobApplicationStatsQuery } from "@/store/api/portfolioApi";

export function ApplicationsSummaryCard() {
  const { isPro } = useSubscription();
  const { data: stats, isLoading, isError } = useGetJobApplicationStatsQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-16 animate-pulse rounded-lg bg-muted/50" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !stats) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <KanbanSquare className="h-4 w-4 text-primary" />
            Applications
          </CardTitle>
          <CardDescription>
            Track saved roles, applications, and interview stages in one pipeline.
          </CardDescription>
        </div>
        <Link
          href="/applications"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1 shrink-0")}
        >
          Open tracker
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-4">
        <div>
          <p className="text-2xl font-semibold tabular-nums">{stats.active}</p>
          <p className="text-sm text-muted-foreground">Active pipeline</p>
        </div>
        <div>
          <p className="text-2xl font-semibold tabular-nums">{stats.applied_this_week}</p>
          <p className="text-sm text-muted-foreground">Applied this week</p>
        </div>
        <div>
          <p className="text-2xl font-semibold tabular-nums">{stats.follow_ups_due}</p>
          <p className="text-sm text-muted-foreground">Follow-ups due</p>
        </div>
        <div className="space-y-2">
          {!isPro ? (
            <Badge variant="outline" className="tabular-nums">
              {stats.active}/{FREE_ACTIVE_APPLICATION_LIMIT} active
            </Badge>
          ) : (
            <Badge variant="secondary">Unlimited tracking</Badge>
          )}
          <p className="text-sm text-muted-foreground">{stats.total} total tracked</p>
        </div>
      </CardContent>
    </Card>
  );
}
