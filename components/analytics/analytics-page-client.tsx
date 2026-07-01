"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PortfolioAchievements } from "@/components/analytics/portfolio-achievements";
import { PortfolioShareTools } from "@/components/analytics/portfolio-share-tools";
import { ReferrerBreakdown } from "@/components/analytics/referrer-breakdown";
import { ViewsOverTimeChart } from "@/components/analytics/views-over-time-chart";
import { StatCard } from "@/components/cards/stat-card";
import { ProUpgradeCard } from "@/components/subscription/pro-upgrade-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { useSubscription } from "@/hooks/use-subscription";
import {
  useGetPortfolioAnalyticsQuery,
  useGetPortfolioSettingsQuery,
} from "@/store/api/portfolioApi";

function formatLastViewed(value: string | null) {
  if (!value) return "No views yet";
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function AnalyticsPageClient() {
  const { data: analytics, isLoading, isError } = useGetPortfolioAnalyticsQuery();
  const { data: settings } = useGetPortfolioSettingsQuery();
  const { stats } = useDashboardStats();
  const { isPro } = useSubscription();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 animate-pulse rounded bg-muted/50" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-xl border bg-muted/40" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-xl border bg-muted/40" />
      </div>
    );
  }

  if (isError || !analytics) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        Unable to load analytics. Try refreshing the page.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytics & Sharing"
        description="Track portfolio views, see where visitors come from, and share your link."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total views"
          value={analytics.total_views}
          icon="chart"
          change={`${analytics.unique_days_with_views} active days`}
        />
        <StatCard
          label="Last 7 days"
          value={analytics.views_last_7_days}
          icon="briefcase"
          change="Recent traffic"
        />
        <StatCard
          label="Last 30 days"
          value={isPro ? analytics.views_last_30_days : "—"}
          icon="wrench"
          change={isPro ? "Monthly reach" : "Pro feature"}
        />
        <StatCard
          label="Last viewed"
          value={formatLastViewed(analytics.last_viewed_at)}
          icon="building"
          change="Most recent visit"
        />
      </div>

      {!isPro ? (
        <ProUpgradeCard
          title="Unlock full analytics"
          description="See views over time, traffic sources, referrer breakdown, and detailed visitor insights with Pro."
        />
      ) : (
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden border-border/80 lg:col-span-2">
          <CardHeader className="border-b bg-muted/10">
            <CardTitle>Views over time</CardTitle>
            <CardDescription>
              Daily portfolio opens for the last 30 days. Hover a bar for exact counts.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ViewsOverTimeChart data={analytics.views_by_day ?? []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic sources</CardTitle>
            <CardDescription>Where visitors found your portfolio.</CardDescription>
          </CardHeader>
          <CardContent>
            <ReferrerBreakdown items={analytics.referrer_breakdown ?? []} />
          </CardContent>
        </Card>
      </div>
      )}

      {settings?.username ? (
        <PortfolioShareTools username={settings.username} />
      ) : null}

      <PortfolioAchievements
        analytics={analytics}
        stats={stats}
        isPublic={settings?.is_public ?? false}
      />

      {isPro && analytics.top_referrers.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Recent referrer URLs</CardTitle>
            <CardDescription>Raw referrer strings from the latest visits.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {analytics.top_referrers.map((referrer) => (
                <li key={referrer} className="truncate break-all">
                  {referrer || "Direct / unknown"}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <p className="text-sm text-muted-foreground">
        View notifications are controlled in{" "}
        <Link href="/settings" className="text-primary hover:underline">
          Settings
        </Link>
        . When SMTP is configured, you also receive an email for each view (throttled to
        one alert every 2 minutes)        . Enable{" "}
        <strong>Email updates</strong> in Settings for weekly digests and inactivity
        reminders.
      </p>
    </div>
  );
}
