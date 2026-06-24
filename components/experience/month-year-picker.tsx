"use client";

import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  EARLIEST_YEAR,
  formatMonthYearLabel,
  monthYearToDate,
} from "@/lib/experience-utils";
import { FieldError } from "@/components/ui/field-error";
import { cn } from "@/lib/utils";

interface MonthYearPickerProps {
  id?: string;
  label: string;
  month: string;
  year: string;
  onChange: (month: string, year: string) => void;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  error?: string | null;
}

export function MonthYearPicker({
  id,
  label,
  month,
  year,
  onChange,
  disabled = false,
  minDate,
  maxDate,
  placeholder = "Pick a date",
  error,
}: MonthYearPickerProps) {
  const [open, setOpen] = useState(false);
  const hasValue = Boolean(month && year);
  const selectedDate = hasValue
    ? monthYearToDate(Number(month), Number(year))
    : undefined;

  const displayValue = hasValue
    ? formatMonthYearLabel(Number(month), Number(year))
    : placeholder;

  function handleSelect(date: Date | undefined) {
    if (!date) return;

    onChange(String(date.getMonth() + 1), String(date.getFullYear()));
    setOpen(false);
  }

  const disabledDates =
    minDate && maxDate
      ? { before: minDate, after: maxDate }
      : minDate
        ? { before: minDate }
        : maxDate
          ? { after: maxDate }
          : undefined;

  return (
    <div className="min-w-0 space-y-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id={id}
          disabled={disabled}
          render={
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              aria-invalid={Boolean(error)}
              className={cn(
                "w-full min-w-0 justify-start text-left font-normal",
                !hasValue && "text-muted-foreground",
                error && "border-destructive"
              )}
            />
          }
        >
          <CalendarIcon className="mr-2 size-4 shrink-0" />
          <span className="truncate">{displayValue}</span>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto max-w-[calc(100vw-2rem)] p-0"
          align="start"
          sideOffset={8}
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            className="w-full max-w-[min(100vw-2rem,20rem)]"
            defaultMonth={selectedDate ?? maxDate ?? new Date()}
            captionLayout="dropdown"
            startMonth={monthYearToDate(1, EARLIEST_YEAR)}
            endMonth={
              maxDate ?? monthYearToDate(12, new Date().getFullYear())
            }
            disabled={disabledDates}
          />
        </PopoverContent>
      </Popover>
      <FieldError message={error} />
    </div>
  );
}
