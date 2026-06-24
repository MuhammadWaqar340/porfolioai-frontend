"use client";

import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import type { DailyViewCount } from "@/lib/api/types";

interface ViewsOverTimeChartProps {
  data: DailyViewCount[];
  className?: string;
}

export function ViewsOverTimeChart({ data, className }: ViewsOverTimeChartProps) {
  const maxCount = Math.max(...data.map((point) => point.count), 1);
  const total = data.reduce((sum, point) => sum + point.count, 0);

  if (total === 0) {
    return (
      <div
        className={cn(
          "flex h-48 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground",
          className
        )}
      >
        No views in the last 30 days yet. Share your portfolio link to get started.
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div
        className="flex h-48 items-end gap-1 sm:gap-1.5"
        role="img"
        aria-label="Portfolio views over the last 30 days"
      >
        {data.map((point) => {
          const heightPercent = (point.count / maxCount) * 100;
          const label = format(parseISO(point.date), "MMM d");
          return (
            <div
              key={point.date}
              className="group flex min-w-0 flex-1 flex-col items-center justify-end gap-1"
            >
              <div className="relative flex h-40 w-full items-end justify-center">
                <div
                  className="w-full max-w-3 rounded-t bg-primary/80 transition-colors group-hover:bg-primary"
                  style={{ height: `${Math.max(heightPercent, point.count > 0 ? 4 : 0)}%` }}
                  title={`${label}: ${point.count} view${point.count === 1 ? "" : "s"}`}
                />
              </div>
              <span className="hidden truncate text-[10px] text-muted-foreground sm:block">
                {format(parseISO(point.date), "d")}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{format(parseISO(data[0].date), "MMM d")}</span>
        <span>Last 30 days · {total} views</span>
        <span>{format(parseISO(data[data.length - 1].date), "MMM d")}</span>
      </div>
    </div>
  );
}
