"use client";

import { Calendar, Loader2, Unplug, Video } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProUpgradeCard } from "@/components/subscription/pro-upgrade-card";
import { TimezoneCombobox } from "@/components/settings/timezone-combobox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSubscription } from "@/hooks/use-subscription";
import { meetingTimezoneOptions } from "@/constants/timezones";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { notifySuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";
import {
  useDisconnectGoogleCalendarMutation,
  useGetMeetingSettingsQuery,
  useGetMeetingTimezonesQuery,
  useLazyGetGoogleCalendarConnectUrlQuery,
  useUpdateMeetingSettingsMutation,
} from "@/store/api/portfolioApi";

const DAY_OPTIONS = [
  { value: 0, label: "Mon" },
  { value: 1, label: "Tue" },
  { value: 2, label: "Wed" },
  { value: 3, label: "Thu" },
  { value: 4, label: "Fri" },
  { value: 5, label: "Sat" },
  { value: 6, label: "Sun" },
];

export function MeetBookingPanel() {
  const { isPro } = useSubscription();
  const searchParams = useSearchParams();
  const { data: settings, isLoading } = useGetMeetingSettingsQuery(undefined, { skip: !isPro });
  const { data: timezones = [], isLoading: timezonesLoading } = useGetMeetingTimezonesQuery();
  const [updateSettings, { isLoading: saving }] = useUpdateMeetingSettingsMutation();
  const [disconnectCalendar, { isLoading: disconnecting }] = useDisconnectGoogleCalendarMutation();
  const [fetchConnectUrl, { isFetching: connecting }] = useLazyGetGoogleCalendarConnectUrlQuery();

  const [enabled, setEnabled] = useState(false);
  const [timezone, setTimezone] = useState("UTC");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [bufferMinutes, setBufferMinutes] = useState(10);
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(17);
  const [availableDays, setAvailableDays] = useState<number[]>([0, 1, 2, 3, 4]);
  const [bookingWindowDays, setBookingWindowDays] = useState(14);
  const [error, setError] = useState<string | null>(null);
  const timezoneOptions = useMemo(
    () => meetingTimezoneOptions(timezones, timezone),
    [timezones, timezone]
  );

  useEffect(() => {
    if (!settings) return;
    setEnabled(settings.enabled);
    setTimezone(settings.timezone);
    setDurationMinutes(settings.duration_minutes);
    setBufferMinutes(settings.buffer_minutes);
    setStartHour(settings.start_hour);
    setEndHour(settings.end_hour);
    setAvailableDays(settings.available_days);
    setBookingWindowDays(settings.booking_window_days);
  }, [settings]);

  useEffect(() => {
    if (searchParams.get("calendar") === "connected") {
      notifySuccess("Google Calendar connected.");
    }
  }, [searchParams]);

  function toggleDay(day: number) {
    setAvailableDays((current) =>
      current.includes(day) ? current.filter((d) => d !== day) : [...current, day].sort()
    );
  }

  async function handleConnect() {
    setError(null);
    try {
      const result = await fetchConnectUrl().unwrap();
      window.location.href = result.url;
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  async function handleDisconnect() {
    setError(null);
    try {
      await disconnectCalendar().unwrap();
      notifySuccess("Google Calendar disconnected.");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (availableDays.length === 0) {
      setError("Select at least one available day.");
      return;
    }
    try {
      await updateSettings({
        enabled,
        timezone,
        duration_minutes: durationMinutes,
        buffer_minutes: bufferMinutes,
        start_hour: startHour,
        end_hour: endHour,
        available_days: availableDays,
        booking_window_days: bookingWindowDays,
      }).unwrap();
      notifySuccess("Meeting settings saved.");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  return (
    <Card id="meet-booking">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-4 w-4 text-primary" />
          Google Meet booking
        </CardTitle>
        <CardDescription>
          Let visitors book a Google Meet call from your public portfolio. Calendar events and Meet
          links are created automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isPro ? (
          <ProUpgradeCard
            compact
            title="Meet booking is Pro"
            description="Connect Google Calendar, set your availability, and accept booked calls with automatic Meet links."
          />
        ) : null}

        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading meeting settings…
          </div>
        ) : (
          <div className={cn("space-y-6", !isPro && "pointer-events-none opacity-60")}>
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">Google Calendar</p>
                  <p className="text-sm text-muted-foreground">
                    {settings?.calendar_connected
                      ? `Connected as ${settings.calendar_email}`
                      : "Connect to create Meet links and sync busy times."}
                  </p>
                </div>
                {settings?.calendar_connected ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void handleDisconnect()}
                    disabled={disconnecting}
                  >
                    {disconnecting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Unplug className="mr-2 h-4 w-4" />
                    )}
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => void handleConnect()}
                    disabled={connecting}
                  >
                    {connecting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Calendar className="mr-2 h-4 w-4" />
                    )}
                    Connect Google Calendar
                  </Button>
                )}
              </div>
            </div>

            <form onSubmit={(e) => void handleSave(e)} className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="meet-enabled">Show booking on portfolio</Label>
                  <p className="text-sm text-muted-foreground">
                    Visitors can pick a time and receive a Google Meet link.
                  </p>
                </div>
                <Switch
                  id="meet-enabled"
                  checked={enabled}
                  onCheckedChange={setEnabled}
                  disabled={!settings?.calendar_connected}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="meet-timezone">Timezone</Label>
                  <TimezoneCombobox
                    id="meet-timezone"
                    value={timezone}
                    options={timezoneOptions}
                    onChange={setTimezone}
                    loading={timezonesLoading}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="meet-duration">Duration (minutes)</Label>
                  <Input
                    id="meet-duration"
                    type="number"
                    min={15}
                    max={120}
                    step={15}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="meet-start">Start hour</Label>
                  <Input
                    id="meet-start"
                    type="number"
                    min={0}
                    max={23}
                    value={startHour}
                    onChange={(e) => setStartHour(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="meet-end">End hour</Label>
                  <Input
                    id="meet-end"
                    type="number"
                    min={1}
                    max={24}
                    value={endHour}
                    onChange={(e) => setEndHour(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="meet-buffer">Buffer between meetings (min)</Label>
                  <Input
                    id="meet-buffer"
                    type="number"
                    min={0}
                    max={60}
                    value={bufferMinutes}
                    onChange={(e) => setBufferMinutes(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="meet-window">Booking window (days)</Label>
                  <Input
                    id="meet-window"
                    type="number"
                    min={1}
                    max={60}
                    value={bookingWindowDays}
                    onChange={(e) => setBookingWindowDays(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Available days</Label>
                <div className="flex flex-wrap gap-2">
                  {DAY_OPTIONS.map((day) => {
                    const active = availableDays.includes(day.value);
                    return (
                      <Button
                        key={day.value}
                        type="button"
                        size="sm"
                        variant={active ? "default" : "outline"}
                        onClick={() => toggleDay(day.value)}
                      >
                        {day.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save meeting settings
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
