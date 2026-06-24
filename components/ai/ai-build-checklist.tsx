"use client";

import Link from "next/link";
import { CheckCircle2, Circle, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { BUILD_STEPS } from "@/lib/ai/copilot";
import { cn } from "@/lib/utils";

export function AIBuildChecklist() {
  const { stats, isLoading } = useDashboardStats();

  return (
    <Card>
      <CardContent className="pt-6">
        {isLoading && !stats ? (
          <div className="grid gap-3 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-muted/40" />
            ))}
          </div>
        ) : stats ? (
          <ul className="grid gap-2 md:grid-cols-2">
            {BUILD_STEPS.map((step) => {
              const done = step.isComplete(stats);
              return (
                <li key={step.id}>
                  <Link
                    href={step.href}
                    className={cn(
                      "flex h-full items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50",
                      done && "border-emerald-500/20 bg-emerald-500/5"
                    )}
                  >
                    {done ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    ) : (
                      <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-primary">
                        <Sparkles className="h-3 w-3" />
                        {step.aiHint}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  );
}
