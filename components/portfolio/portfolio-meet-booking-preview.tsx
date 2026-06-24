"use client";

import { format, addDays } from "date-fns";
import { Calendar, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PortfolioPreviewOnlyNote } from "@/components/portfolio/portfolio-preview-only-note";

const PREVIEW_TIME_SLOTS = ["10:00 AM", "2:00 PM", "4:30 PM"];

function PortfolioMeetBookingPreview() {
  const previewDates = [1, 2, 3].map((offset) => addDays(new Date(), offset));

  return (
    <section id="book-meeting" className="rounded-xl border bg-card/60 p-5">
      <div className="mb-4 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Book a Google Meet call</h3>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Pick a time that works for you. A Meet link and calendar invite will be sent
        automatically.
      </p>
      <PortfolioPreviewOnlyNote className="mb-4" />
      <div className="space-y-4 pointer-events-none select-none opacity-90">
        <div className="space-y-2">
          <Label>Date</Label>
          <div className="flex flex-wrap gap-2">
            {previewDates.map((date, index) => (
              <Button
                key={date.toISOString()}
                type="button"
                size="sm"
                variant={index === 0 ? "default" : "outline"}
                tabIndex={-1}
                aria-hidden
              >
                {format(date, "EEE, MMM d")}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Time (America/Los_Angeles)</Label>
          <div className="flex flex-wrap gap-2">
            {PREVIEW_TIME_SLOTS.map((slot, index) => (
              <Button
                key={slot}
                type="button"
                size="sm"
                variant={index === 1 ? "default" : "outline"}
                tabIndex={-1}
                aria-hidden
              >
                {slot}
              </Button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="meet-preview-name">Your name</Label>
            <Input id="meet-preview-name" value="Alex Morgan" readOnly disabled />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="meet-preview-email">Email</Label>
            <Input
              id="meet-preview-email"
              type="email"
              value="alex@example.com"
              readOnly
              disabled
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="meet-preview-message">Message (optional)</Label>
          <Textarea
            id="meet-preview-message"
            rows={3}
            value="I'd love to walk through your portfolio and discuss a frontend role."
            readOnly
            disabled
          />
        </div>
        <Button type="button" disabled tabIndex={-1} aria-hidden>
          <Video className="mr-2 h-4 w-4" />
          Book meeting
        </Button>
      </div>
    </section>
  );
}

export { PortfolioMeetBookingPreview };
