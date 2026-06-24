"use client";

import { format, parseISO } from "date-fns";
import { Calendar, CheckCircle2, Loader2, Video } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useOptionalDemoPortfolio } from "@/contexts/portfolio-demo-context";
import { PortfolioMeetBookingPreview } from "@/components/portfolio/portfolio-meet-booking-preview";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { notifySuccess } from "@/lib/toast";
import {
  useBookPublicMeetingMutation,
  useGetPublicMeetingAvailabilityQuery,
} from "@/store/api/portfolioApi";

function formatSlotLabel(iso: string, timezone: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
      timeZone: timezone,
    }).format(parseISO(iso));
  } catch {
    return format(parseISO(iso), "h:mm a");
  }
}

export function PortfolioMeetBooking() {
  const portfolio = useOptionalDemoPortfolio();

  if (portfolio?.displayOnly) {
    return <PortfolioMeetBookingPreview />;
  }

  return <PortfolioMeetBookingInteractive />;
}

function PortfolioMeetBookingInteractive() {
  const portfolio = useOptionalDemoPortfolio();
  const username = portfolio?.portfolioUsername;
  const enabled = portfolio?.meetBookingEnabled;

  const { data: availability, isLoading } = useGetPublicMeetingAvailabilityQuery(
    username ?? "",
    { skip: !username || !enabled }
  );
  const [bookMeeting, { isLoading: booking }] = useBookPublicMeetingMutation();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [bookedUrl, setBookedUrl] = useState<string | null>(null);

  const slotsForDate = useMemo(() => {
    if (!availability || !selectedDate) return [];
    return availability.dates.find((d) => d.date === selectedDate)?.slots ?? [];
  }, [availability, selectedDate]);

  if (!enabled || !username) return null;

  async function handleBook(event: React.FormEvent) {
    event.preventDefault();
    if (!username || !selectedSlot) return;
    setError(null);
    try {
      const result = await bookMeeting({
        username,
        visitor_name: name.trim(),
        visitor_email: email.trim(),
        message: message.trim() || undefined,
        starts_at: selectedSlot,
      }).unwrap();
      setBookedUrl(result.meet_url);
      notifySuccess("Meeting booked! Check your email for the calendar invite.");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  if (bookedUrl) {
    return (
      <section id="book-meeting" className="rounded-xl border bg-card/60 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Meeting confirmed</h3>
            <p className="text-sm text-muted-foreground">
              Your Google Meet link is ready. A calendar invite has been sent to your email.
            </p>
            <Button render={<a href={bookedUrl} target="_blank" rel="noreferrer" />} nativeButton={false}>
              <Video className="mr-2 h-4 w-4" />
              Join Google Meet
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="book-meeting" className="rounded-xl border bg-card/60 p-5">
      <div className="mb-4 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Book a Google Meet call</h3>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Pick a time that works for you. A Meet link and calendar invite will be sent automatically.
      </p>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading available times…
        </div>
      ) : !availability?.dates.length ? (
        <p className="text-sm text-muted-foreground">No available times right now.</p>
      ) : (
        <form onSubmit={(e) => void handleBook(e)} className="space-y-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <div className="flex flex-wrap gap-2">
              {availability.dates.map((day) => (
                <Button
                  key={day.date}
                  type="button"
                  size="sm"
                  variant={selectedDate === day.date ? "default" : "outline"}
                  onClick={() => {
                    setSelectedDate(day.date);
                    setSelectedSlot(null);
                  }}
                >
                  {format(parseISO(day.date), "EEE, MMM d")}
                </Button>
              ))}
            </div>
          </div>

          {selectedDate ? (
            <div className="space-y-2">
              <Label>Time ({availability.timezone})</Label>
              <div className="flex flex-wrap gap-2">
                {slotsForDate.map((slot) => (
                  <Button
                    key={slot}
                    type="button"
                    size="sm"
                    variant={selectedSlot === slot ? "default" : "outline"}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {formatSlotLabel(slot, availability.timezone)}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}

          {selectedSlot ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="meet-name">Your name</Label>
                  <Input
                    id="meet-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="meet-email">Email</Label>
                  <Input
                    id="meet-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="meet-message">Message (optional)</Label>
                <Textarea
                  id="meet-message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What would you like to discuss?"
                />
              </div>
            </>
          ) : null}

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button
            type="submit"
            disabled={booking || !selectedSlot || !name.trim() || !email.trim()}
          >
            {booking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Book meeting
          </Button>
        </form>
      )}
    </section>
  );
}
