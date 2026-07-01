"use client";

import { CalendarIcon, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 12 }, (_, index) => index + 1);
const MINUTES = Array.from({ length: 12 }, (_, index) => index * 5);

function snapMinute(minute: number) {
  return Math.min(55, Math.round(minute / 5) * 5);
}

const selectClassName = cn(
  "flex h-9 min-w-0 flex-1 rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
);

interface FollowUpReminderPickerProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function parseDatetimeLocal(value: string) {
  if (!value.trim()) return null;

  const [datePart, timePart] = value.split("T");
  if (!datePart || !timePart) return null;

  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  if (
    [year, month, day, hour, minute].some((part) => Number.isNaN(part))
  ) {
    return null;
  }

  const date = new Date(year, month - 1, day, hour, minute, 0, 0);
  if (Number.isNaN(date.getTime())) return null;

  return { date, hour, minute };
}

function toDatetimeLocalString(date: Date, hour: number, minute: number) {
  const local = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hour,
    minute,
    0,
    0
  );
  const offset = local.getTimezoneOffset();
  const normalized = new Date(local.getTime() - offset * 60_000);
  return normalized.toISOString().slice(0, 16);
}

function formatReminderLabel(value: string) {
  const parsed = parseDatetimeLocal(value);
  if (!parsed) return null;

  return parsed.date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function to12Hour(hour24: number): { hour12: number; period: "AM" | "PM" } {
  const period: "AM" | "PM" = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  return { hour12, period };
}

function to24Hour(hour12: number, period: "AM" | "PM") {
  if (period === "AM") return hour12 === 12 ? 0 : hour12;
  return hour12 === 12 ? 12 : hour12 + 12;
}

export function FollowUpReminderPicker({
  id,
  value,
  onChange,
  disabled = false,
  placeholder = "Pick a date and time",
}: FollowUpReminderPickerProps) {
  const [open, setOpen] = useState(false);
  const parsed = useMemo(() => parseDatetimeLocal(value), [value]);
  const displayValue = formatReminderLabel(value);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    parsed?.date
  );
  const [hour12, setHour12] = useState(parsed ? to12Hour(parsed.hour).hour12 : 9);
  const [minute, setMinute] = useState(parsed?.minute ?? 0);
  const [period, setPeriod] = useState<"AM" | "PM">(
    parsed ? to12Hour(parsed.hour).period : "AM"
  );

  useEffect(() => {
    if (!open) return;

    const next = parseDatetimeLocal(value);
    setSelectedDate(next?.date);
    if (next) {
      const next12 = to12Hour(next.hour);
      setHour12(next12.hour12);
      setMinute(snapMinute(next.minute));
      setPeriod(next12.period);
    } else {
      setSelectedDate(undefined);
      setHour12(9);
      setMinute(0);
      setPeriod("AM");
    }
  }, [open, value]);

  function commitSelection(date: Date, hour: number, minuteValue: number) {
    onChange(toDatetimeLocalString(date, hour, minuteValue));
  }

  function handleDateSelect(date: Date | undefined) {
    if (!date) return;
    setSelectedDate(date);
    commitSelection(date, to24Hour(hour12, period), minute);
  }

  function handleTimeChange(next: {
    hour12?: number;
    minute?: number;
    period?: "AM" | "PM";
  }) {
    const nextHour12 = next.hour12 ?? hour12;
    const nextMinute = next.minute ?? minute;
    const nextPeriod = next.period ?? period;

    setHour12(nextHour12);
    setMinute(nextMinute);
    setPeriod(nextPeriod);

    if (!selectedDate) return;
    commitSelection(
      selectedDate,
      to24Hour(nextHour12, nextPeriod),
      nextMinute
    );
  }

  function handleClear() {
    onChange("");
    setOpen(false);
  }

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id={id}
          disabled={disabled}
          render={
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              className={cn(
                "w-full min-w-0 flex-1 justify-start text-left font-normal",
                !displayValue && "text-muted-foreground"
              )}
            />
          }
        >
          <CalendarIcon className="mr-2 size-4 shrink-0" />
          <span className="truncate">{displayValue ?? placeholder}</span>
        </PopoverTrigger>
      <PopoverContent
        className="w-auto max-w-[calc(100vw-2rem)] p-0"
        align="start"
        sideOffset={8}
      >
        <div className="p-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="w-full max-w-[min(100vw-2rem,20rem)]"
            defaultMonth={selectedDate ?? new Date()}
          />
        </div>

        <div className="space-y-3 border-t border-border/60 px-3 py-3">
          <p className="text-xs font-medium text-muted-foreground">Time</p>
          {!selectedDate ? (
            <p className="text-xs text-muted-foreground">
              Select a date on the calendar first.
            </p>
          ) : null}
          <div className="flex gap-2">
            <select
              aria-label="Hour"
              value={hour12}
              disabled={!selectedDate}
              onChange={(event) =>
                handleTimeChange({ hour12: Number(event.target.value) })
              }
              className={selectClassName}
            >
              {HOURS.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
            <select
              aria-label="Minute"
              value={minute}
              disabled={!selectedDate}
              onChange={(event) =>
                handleTimeChange({ minute: Number(event.target.value) })
              }
              className={selectClassName}
            >
              {MINUTES.map((minuteValue) => (
                <option key={minuteValue} value={minuteValue}>
                  {pad(minuteValue)}
                </option>
              ))}
            </select>
            <select
              aria-label="AM or PM"
              value={period}
              disabled={!selectedDate}
              onChange={(event) =>
                handleTimeChange({ period: event.target.value as "AM" | "PM" })
              }
              className={cn(selectClassName, "max-w-24 flex-none")}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>

          <div className="flex justify-between gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={!value}
            >
              Clear
            </Button>
            <Button type="button" size="sm" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
      </Popover>
      {displayValue ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Clear follow-up reminder"
          onClick={handleClear}
          disabled={disabled}
        >
          <X className="size-4" />
        </Button>
      ) : null}
    </div>
  );
}

export function fromDatetimeLocal(value: string) {
  if (!value.trim()) return null;
  return new Date(value).toISOString();
}

export function toDatetimeLocal(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}
