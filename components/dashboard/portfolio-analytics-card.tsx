"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetPortfolioAnalyticsQuery } from "@/store/api/portfolioApi";

function formatDate(value: string | null) {
  if (!value) return "No views yet";
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function PortfolioAnalyticsCard() {
  const { data, isLoading, isError } = useGetPortfolioAnalyticsQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio views</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-20 animate-pulse rounded-lg bg-muted/50" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>Portfolio views</CardTitle>
          <CardDescription>
            See how often your public portfolio is being opened.
          </CardDescription>
        </div>
        <Link
          href="/analytics"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1 shrink-0")}
        >
          Full analytics
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-4">
        <div>
          <p className="text-2xl font-semibold tabular-nums">{data.total_views}</p>
          <p className="text-sm text-muted-foreground">Total views</p>
        </div>
        <div>
          <p className="text-2xl font-semibold tabular-nums">
            {data.views_last_7_days}
          </p>
          <p className="text-sm text-muted-foreground">Last 7 days</p>
        </div>
        <div>
          <p className="text-2xl font-semibold tabular-nums">
            {data.views_last_30_days}
          </p>
          <p className="text-sm text-muted-foreground">Last 30 days</p>
        </div>
        <div>
          <p className="text-sm font-medium">{formatDate(data.last_viewed_at)}</p>
          <p className="text-sm text-muted-foreground">Last viewed</p>
        </div>
        {data.referrer_breakdown?.length ? (
          <div className="sm:col-span-4">
            <p className="mb-2 text-sm font-medium">Top sources (30 days)</p>
            <ul className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              {data.referrer_breakdown.slice(0, 4).map((item) => (
                <li
                  key={item.source}
                  className="rounded-full border px-2.5 py-0.5 tabular-nums"
                >
                  {item.label}: {item.count}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
