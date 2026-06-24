"use client";

import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  filterMeetingTimezones,
  findMeetingTimezone,
  formatMeetingTimezoneLabel,
  type MeetingTimezone,
} from "@/constants/timezones";
import { cn } from "@/lib/utils";

interface TimezoneComboboxProps {
  id?: string;
  value: string;
  options: MeetingTimezone[];
  onChange: (zone: string) => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
}

export function TimezoneCombobox({
  id,
  value,
  options,
  onChange,
  disabled = false,
  loading = false,
  placeholder = "Select timezone",
}: TimezoneComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  const selected = findMeetingTimezone(options, value);
  const selectedLabel = selected
    ? formatMeetingTimezoneLabel(selected)
    : value || placeholder;

  const filteredOptions = useMemo(
    () => filterMeetingTimezones(options, search),
    [options, search]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        disabled={disabled || loading}
        render={
          <Button
            type="button"
            variant="outline"
            disabled={disabled || loading}
            className="h-8 w-full justify-between px-2.5 font-normal"
          />
        }
      >
        <span className="truncate text-left">
          {loading ? "Loading timezones…" : selectedLabel}
        </span>
        {loading ? (
          <Loader2 className="size-4 shrink-0 animate-spin opacity-60" />
        ) : (
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[var(--anchor-width)] p-0" align="start" sideOffset={4}>
        <div className="border-b border-border/60 p-2">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search UTC offset, city, or zone…"
            autoFocus
            className="h-8"
          />
        </div>
        <ScrollArea className="h-64">
          <div className="p-1">
            {filteredOptions.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                No timezones found.
              </p>
            ) : (
              filteredOptions.map((timezone) => {
                const isSelected = timezone.zone === value;
                return (
                  <button
                    key={timezone.zone}
                    type="button"
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                      isSelected && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => {
                      onChange(timezone.zone);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "size-4 shrink-0",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate">{formatMeetingTimezoneLabel(timezone)}</span>
                  </button>
                );
              })
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
