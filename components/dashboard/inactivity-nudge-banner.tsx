"use client";

import { Clock3, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  useDismissInactivityNudgeMutation,
  useGetInactivityNudgeQuery,
} from "@/store/api/portfolioApi";

export function InactivityNudgeBanner() {
  const { data: nudge, isLoading } = useGetInactivityNudgeQuery();
  const [dismissNudge, { isLoading: isDismissing }] =
    useDismissInactivityNudgeMutation();

  if (isLoading || !nudge?.show) {
    return null;
  }

  const primaryHref = nudge.primary_action_path ?? "/dashboard";
  const topSuggestions = nudge.suggestions.slice(0, 2);

  async function handleDismiss() {
    try {
      await dismissNudge().unwrap();
    } catch {
      // Keep banner visible if dismiss fails
    }
  }

  return (
    <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl border border-amber-500/25 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-orange-500/5 p-4 shadow-sm sm:flex-row sm:items-start sm:justify-between sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 ring-1 ring-amber-500/20">
          <Clock3 className="h-5 w-5 text-amber-700 dark:text-amber-400" />
        </div>
        <div className="min-w-0 space-y-2">
          <div>
            <p className="font-medium">{nudge.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{nudge.message}</p>
          </div>
          {topSuggestions.length > 0 ? (
            <ul className="space-y-1 text-sm text-muted-foreground">
              {topSuggestions.map((item) => (
                <li key={item.message}>
                  {item.action_path ? (
                    <Link
                      href={item.action_path}
                      className="text-primary hover:underline"
                    >
                      {item.message}
                    </Link>
                  ) : (
                    item.message
                  )}
                </li>
              ))}
            </ul>
          ) : null}
          {nudge.views_last_30_days > 0 ? (
            <p className="text-xs text-muted-foreground">
              {nudge.views_last_30_days} view
              {nudge.views_last_30_days === 1 ? "" : "s"} in the last 30 days
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 self-end sm:self-start">
        <Button
          render={<Link href={primaryHref} />}
          nativeButton={false}
          className="shrink-0"
        >
          {nudge.primary_action_label}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
          aria-label="Dismiss inactivity reminder"
          disabled={isDismissing}
          onClick={() => void handleDismiss()}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
