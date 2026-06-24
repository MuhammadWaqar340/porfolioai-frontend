"use client";

import { AlertTriangle, Megaphone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetPlatformConfigQuery } from "@/store/api/portfolioApi";
import { cn } from "@/lib/utils";

const ANNOUNCEMENT_DISMISS_KEY = "portfolioai-announcement-dismissed";

export function PlatformStatusBanners() {
  const { data } = useGetPlatformConfigQuery(undefined, {
    pollingInterval: 60_000,
  });
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  useEffect(() => {
    if (!data?.announcement_message) return;
    const dismissed = sessionStorage.getItem(ANNOUNCEMENT_DISMISS_KEY);
    setAnnouncementDismissed(dismissed === data.announcement_message);
  }, [data?.announcement_message]);

  if (!data) return null;

  const showMaintenance = data.maintenance_mode;
  const showAnnouncement =
    data.announcement_enabled &&
    data.announcement_message.trim().length > 0 &&
    !announcementDismissed;

  if (!showMaintenance && !showAnnouncement) return null;

  function dismissAnnouncement() {
    if (!data?.announcement_message) return;
    sessionStorage.setItem(ANNOUNCEMENT_DISMISS_KEY, data.announcement_message);
    setAnnouncementDismissed(true);
  }

  return (
    <div className="sticky top-0 z-[60] w-full">
      {showMaintenance ? (
        <div
          role="status"
          className="border-b border-amber-500/30 bg-amber-500/15 px-4 py-2.5 text-center text-sm text-amber-950 dark:text-amber-100"
        >
          <div className="mx-auto flex max-w-4xl items-center justify-center gap-2 font-medium">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              PortfolioAI is in maintenance mode. Some features may be temporarily
              unavailable.
            </span>
          </div>
        </div>
      ) : null}

      {showAnnouncement ? (
        <div
          role="status"
          className={cn(
            "border-b border-primary/20 bg-primary/10 px-4 py-2.5 text-sm text-foreground",
            showMaintenance && "border-t-0"
          )}
        >
          <div className="mx-auto flex max-w-4xl items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-2">
              <Megaphone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="whitespace-pre-wrap leading-relaxed">
                {data.announcement_message}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0"
              onClick={dismissAnnouncement}
              aria-label="Dismiss announcement"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
