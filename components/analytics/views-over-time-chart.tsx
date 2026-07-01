"use client";

import { format, parseISO } from "date-fns";
import { Share2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import type { DailyViewCount } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface ViewsOverTimeChartProps {
  data: DailyViewCount[];
  className?: string;
}

function formatAxisValue(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

function buildYAxisTicks(maxCount: number) {
  if (maxCount <= 0) return [0];
  if (maxCount <= 4) {
    return Array.from({ length: maxCount + 1 }, (_, index) => index);
  }
  const step = Math.ceil(maxCount / 4);
  const ticks = [0];
  for (let value = step; value < maxCount; value += step) {
    ticks.push(value);
  }
  ticks.push(maxCount);
  return [...new Set(ticks)];
}

function shouldShowDayLabel(index: number, total: number) {
  if (total <= 10) return true;
  if (index === 0 || index === total - 1) return true;
  return (index + 1) % 5 === 0;
}

export function ViewsOverTimeChart({ data, className }: ViewsOverTimeChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const stats = useMemo(() => {
    const total = data.reduce((sum, point) => sum + point.count, 0);
    const maxCount = Math.max(...data.map((point) => point.count), 0);
    const activeDays = data.filter((point) => point.count > 0).length;
    const peakIndex = data.reduce(
      (best, point, index) => (point.count > data[best].count ? index : best),
      0
    );
    const peak = data[peakIndex];
    const dailyAverage = data.length > 0 ? total / data.length : 0;

    return { total, maxCount, activeDays, peakIndex, peak, dailyAverage };
  }, [data]);

  const yTicks = useMemo(
    () => buildYAxisTicks(stats.maxCount),
    [stats.maxCount]
  );

  const focusedIndex = activeIndex ?? stats.peakIndex;
  const focusedPoint = data[focusedIndex];

  if (stats.total === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/10 px-6 py-12 text-center",
          className
        )}
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <TrendingUp className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium">No views in the last 30 days</p>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Share your portfolio link on LinkedIn, your resume, or job applications to
          start tracking daily opens here.
        </p>
        <Link
          href="/preview"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-5 gap-2")}
        >
          <Share2 className="h-4 w-4" />
          Preview & share portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className={cn("space-y-5", className)}>
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-lg border bg-muted/15 px-3 py-2.5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Total views
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{stats.total}</p>
        </div>
        <div className="rounded-lg border bg-muted/15 px-3 py-2.5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Peak day
          </p>
          <p className="mt-1 text-sm font-semibold tabular-nums">
            {stats.peak.count} views
          </p>
          <p className="text-xs text-muted-foreground">
            {format(parseISO(stats.peak.date), "EEE, MMM d")}
          </p>
        </div>
        <div className="rounded-lg border bg-muted/15 px-3 py-2.5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Daily average
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {stats.dailyAverage.toFixed(1)}
          </p>
        </div>
        <div className="rounded-lg border bg-muted/15 px-3 py-2.5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Active days
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {stats.activeDays}
            <span className="text-sm font-normal text-muted-foreground">
              /{data.length}
            </span>
          </p>
        </div>
      </div>

      {focusedPoint ? (
        <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm">
          <span className="font-medium">
            {format(parseISO(focusedPoint.date), "EEEE, MMMM d")}
          </span>
          <span className="tabular-nums text-primary">
            {focusedPoint.count} view{focusedPoint.count === 1 ? "" : "s"}
            {focusedIndex === stats.peakIndex ? (
              <span className="ml-2 text-xs text-muted-foreground">· Peak</span>
            ) : null}
          </span>
        </div>
      ) : null}

      <div className="relative">
        <div className="flex gap-3">
          <div className="flex w-8 shrink-0 flex-col justify-between pb-6 pt-1 text-[10px] tabular-nums text-muted-foreground">
            {[...yTicks].reverse().map((tick) => (
              <span key={tick}>{formatAxisValue(tick)}</span>
            ))}
          </div>

          <div className="min-w-0 flex-1">
            <div
              className="relative h-52"
              role="img"
              aria-label="Portfolio views over the last 30 days"
            >
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-6">
                {yTicks.map((tick) => (
                  <div
                    key={tick}
                    className="border-t border-dashed border-border/60"
                    aria-hidden
                  />
                ))}
              </div>

              <div className="absolute inset-0 flex items-end gap-0.5 pb-6 sm:gap-1">
                {data.map((point, index) => {
                  const heightPercent =
                    stats.maxCount > 0 ? (point.count / stats.maxCount) * 100 : 0;
                  const isActive = focusedIndex === index;
                  const isPeak = stats.peakIndex === index;

                  return (
                    <button
                      key={point.date}
                      type="button"
                      className="group relative flex min-w-0 flex-1 flex-col items-center justify-end focus:outline-none"
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                      onFocus={() => setActiveIndex(index)}
                      onBlur={() => setActiveIndex(null)}
                      aria-label={`${format(parseISO(point.date), "MMMM d")}: ${point.count} views`}
                    >
                      {isActive ? (
                        <div className="pointer-events-none absolute -top-9 z-20 whitespace-nowrap rounded-md border bg-popover px-2 py-1 text-[11px] font-medium text-popover-foreground shadow-md">
                          {format(parseISO(point.date), "MMM d")} · {point.count}
                        </div>
                      ) : null}

                      <div className="relative flex h-44 w-full items-end justify-center">
                        <div
                          className={cn(
                            "w-full max-w-[14px] rounded-t-md bg-gradient-to-t from-primary via-primary/85 to-primary/55 transition-all duration-300 motion-reduce:transition-none",
                            point.count > 0 ? "min-h-[3px]" : "min-h-0",
                            isActive && "from-primary to-violet-400 shadow-[0_0_12px_rgba(124,58,237,0.35)]",
                            isPeak && !isActive && "ring-1 ring-primary/40",
                            "group-focus-visible:ring-2 group-focus-visible:ring-primary/50"
                          )}
                          style={{
                            height:
                              point.count > 0
                                ? `${Math.max(heightPercent, 6)}%`
                                : "2px",
                            opacity: point.count > 0 ? 1 : 0.15,
                          }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-0.5 sm:gap-1">
              {data.map((point, index) => (
                <div
                  key={`${point.date}-label`}
                  className="flex min-w-0 flex-1 justify-center"
                >
                  {shouldShowDayLabel(index, data.length) ? (
                    <span className="text-[10px] tabular-nums text-muted-foreground">
                      {format(parseISO(point.date), "d")}
                    </span>
                  ) : (
                    <span className="text-[10px] text-transparent" aria-hidden>
                      ·
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>{format(parseISO(data[0].date), "MMM d")}</span>
        <span className="font-medium text-foreground">
          Last 30 days · {stats.total} views
        </span>
        <span>{format(parseISO(data[data.length - 1].date), "MMM d")}</span>
      </div>
    </div>
  );
}
