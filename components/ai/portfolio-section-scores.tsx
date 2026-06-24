"use client";

import { cn } from "@/lib/utils";
import type { PortfolioSectionScore } from "@/lib/api/types";

function statusColor(status: string) {
  switch (status) {
    case "complete":
      return "bg-emerald-500";
    case "needs_work":
      return "bg-amber-500";
    default:
      return "bg-muted-foreground/35";
  }
}

function statusLabel(status: string) {
  switch (status) {
    case "complete":
      return "Complete";
    case "needs_work":
      return "Needs work";
    default:
      return "Missing";
  }
}

function ScoreBar({ score, status }: { score: number; status: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={cn("h-full rounded-full transition-all", statusColor(status))}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

interface PortfolioSectionScoresProps {
  scores: PortfolioSectionScore[];
  /** @deprecated Use layout instead */
  compact?: boolean;
  layout?: "horizontal" | "vertical" | "grid";
}

export function PortfolioSectionScores({
  scores,
  compact = false,
  layout,
}: PortfolioSectionScoresProps) {
  if (scores.length === 0) return null;

  const resolvedLayout = layout ?? (compact ? "vertical" : "grid");

  if (resolvedLayout === "vertical") {
    return (
      <ul className="space-y-2">
        {scores.map((section) => (
          <li
            key={section.section}
            className="rounded-lg border bg-muted/15 px-3 py-2.5"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="min-w-0 truncate text-xs font-medium text-foreground">
                {section.label}
              </span>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-[10px] text-muted-foreground">
                  {statusLabel(section.status)}
                </span>
                <span className="text-xs font-semibold tabular-nums text-foreground">
                  {section.score}
                </span>
              </div>
            </div>
            <ScoreBar score={section.score} status={section.status} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-2",
        resolvedLayout === "horizontal"
          ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
      )}
    >
      {scores.map((section) => (
        <div
          key={section.section}
          className="min-w-0 rounded-lg border bg-muted/15 p-2.5 sm:p-3"
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-foreground sm:text-sm">
                {section.label}
              </p>
              <p className="text-[10px] text-muted-foreground sm:text-[11px]">
                {statusLabel(section.status)}
              </p>
            </div>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground sm:text-base">
              {section.score}
            </span>
          </div>
          <ScoreBar score={section.score} status={section.status} />
        </div>
      ))}
    </div>
  );
}
