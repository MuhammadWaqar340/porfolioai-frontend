"use client";

import { LayoutGrid, Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type TemplateFilter = "all" | "free" | "pro";

interface TemplatesToolbarProps {
  filter: TemplateFilter;
  onFilterChange: (filter: TemplateFilter) => void;
  totalCount: number;
  freeCount: number;
  proCount: number;
  selectedName?: string | null;
  className?: string;
}

const filters: { id: TemplateFilter; label: string; icon: typeof LayoutGrid }[] = [
  { id: "all", label: "All", icon: LayoutGrid },
  { id: "free", label: "Free", icon: Sparkles },
  { id: "pro", label: "Pro", icon: Lock },
];

export function TemplatesToolbar({
  filter,
  onFilterChange,
  totalCount,
  freeCount,
  proCount,
  selectedName,
  className,
}: TemplatesToolbarProps) {
  const counts: Record<TemplateFilter, number> = {
    all: totalCount,
    free: freeCount,
    pro: proCount,
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex flex-wrap gap-2">
        {filters.map(({ id, label, icon: Icon }) => {
          const active = filter === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onFilterChange(id)}
              className={cn(
                "inline-flex min-h-9 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
              aria-pressed={active}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-xs tabular-nums",
                  active ? "bg-primary-foreground/20" : "bg-muted"
                )}
              >
                {counts[id]}
              </span>
            </button>
          );
        })}
      </div>

      {selectedName ? (
        <p className="text-sm text-muted-foreground sm:text-right">
          Active:{" "}
          <span className="font-medium text-foreground">{selectedName}</span>
        </p>
      ) : (
        <p className="text-sm text-muted-foreground sm:text-right">
          {totalCount} templates available
        </p>
      )}
    </div>
  );
}
