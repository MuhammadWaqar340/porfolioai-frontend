"use client";

import { cn } from "@/lib/utils";
import type { ReferrerBreakdownItem } from "@/lib/api/types";

interface ReferrerBreakdownProps {
  items: ReferrerBreakdownItem[];
  className?: string;
}

export function ReferrerBreakdown({ items, className }: ReferrerBreakdownProps) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  if (total === 0) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        Referrer data will appear after your first visitors arrive.
      </p>
    );
  }

  const maxCount = Math.max(...items.map((item) => item.count), 1);

  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item) => {
        const widthPercent = (item.count / maxCount) * 100;
        const sharePercent = Math.round((item.count / total) * 100);
        return (
          <li key={item.source}>
            <div className="mb-1 flex items-center justify-between gap-2 text-sm">
              <span className="font-medium">{item.label}</span>
              <span className="tabular-nums text-muted-foreground">
                {item.count} · {sharePercent}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary/70"
                style={{ width: `${widthPercent}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
