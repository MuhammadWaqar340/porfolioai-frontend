"use client";

import Link from "next/link";
import { ArrowRight, Pencil, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { editLinkClassName } from "@/components/ui/edit-icon-button";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { getNextStep } from "@/lib/ai/copilot";
import { cn } from "@/lib/utils";
import { useTargetRole } from "@/store/hooks";

export function AICopilotProgress() {
  const { stats, isLoading } = useDashboardStats();
  const targetRole = useTargetRole();

  if (isLoading && !stats) {
    return (
      <Card>
        <CardContent className="h-28 animate-pulse bg-muted/30 py-6" />
      </Card>
    );
  }

  if (!stats) return null;

  const next = getNextStep(stats);
  const completion = stats.portfolio_completion_percent;

  return (
    <Card className="overflow-hidden border-primary/20">
      <CardContent className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] lg:items-center">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Overall completeness</span>
            <span className="font-semibold tabular-nums">{completion}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full bg-primary transition-all duration-500",
                completion >= 80 && "bg-emerald-500"
              )}
              style={{ width: `${Math.min(100, completion)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.sections_completed} of {stats.sections_total} core sections complete
          </p>
        </div>

        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-sm font-medium">{next.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{next.message}</p>
          <Button
            className="mt-3"
            size="sm"
            render={<Link href={next.href} />}
            nativeButton={false}
          >
            {next.cta}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col gap-2 lg:min-w-[11rem] lg:items-end lg:text-right">
          {targetRole ? (
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs">
              <Target className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="text-muted-foreground">Target:</span>
              <span className="font-medium">{targetRole}</span>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              No target role set yet.
            </p>
          )}
          <Link href="/settings" className={editLinkClassName}>
            <Pencil className="h-3 w-3" />
            {targetRole ? "Edit role" : "Set target role"}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
