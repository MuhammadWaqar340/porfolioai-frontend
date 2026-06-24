"use client";

import { format } from "date-fns";
import { ExternalLink, Loader2, Trash2, Video } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { ProUpgradeCard } from "@/components/subscription/pro-upgrade-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscription } from "@/hooks/use-subscription";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { notifySuccess } from "@/lib/toast";
import {
  useCancelMeetingMutation,
  useGetUpcomingMeetingsQuery,
} from "@/store/api/portfolioApi";

export function MeetingsPageClient() {
  const { isPro } = useSubscription();
  const { data: meetings = [], isLoading } = useGetUpcomingMeetingsQuery(undefined, {
    skip: !isPro,
  });
  const [cancelMeeting, { isLoading: cancelling }] = useCancelMeetingMutation();

  async function handleCancel(id: string) {
    try {
      await cancelMeeting(id).unwrap();
      notifySuccess("Meeting cancelled.");
    } catch (err) {
      alert(getApiErrorMessage(err));
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meetings"
        description="Upcoming Google Meet calls booked from your portfolio."
      >
        <Button variant="outline" render={<Link href="/settings#meet-booking" />} nativeButton={false}>
          Meeting settings
        </Button>
      </PageHeader>

      {!isPro ? (
        <ProUpgradeCard
          title="Portfolio meetings are Pro"
          description="Connect Google Calendar and let visitors book calls with automatic Meet links."
        />
      ) : null}

      <div className={!isPro ? "pointer-events-none opacity-60" : undefined}>
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading meetings…
          </div>
        ) : meetings.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No upcoming meetings. Enable booking in Settings and share your portfolio link.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {meetings.map((meeting) => (
              <Card key={meeting.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-2">
                  <CardTitle className="text-base">
                    {meeting.visitor_name}
                    <span className="mt-1 block text-sm font-normal text-muted-foreground">
                      {meeting.visitor_email}
                    </span>
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      render={<a href={meeting.meet_url} target="_blank" rel="noreferrer" />}
                      nativeButton={false}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Join Meet
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => void handleCancel(meeting.id)}
                      disabled={cancelling}
                      aria-label="Cancel meeting"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-primary" />
                    {format(new Date(meeting.starts_at), "EEEE, MMM d, yyyy · h:mm a")}
                  </p>
                  {meeting.message ? (
                    <p className="text-muted-foreground">{meeting.message}</p>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
