"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PRO_BILLING_OPTIONS, type ProBillingInterval } from "@/constants/plans";

interface ProBillingOptionsProps {
  value?: ProBillingInterval;
  onChange?: (interval: ProBillingInterval) => void;
  className?: string;
  compact?: boolean;
}

export function ProBillingOptions({
  value: controlledValue,
  onChange,
  className,
  compact = false,
}: ProBillingOptionsProps) {
  const [internalValue, setInternalValue] = useState<ProBillingInterval>("quarterly");
  const selected = controlledValue ?? internalValue;

  function select(interval: ProBillingInterval) {
    setInternalValue(interval);
    onChange?.(interval);
  }

  const option = PRO_BILLING_OPTIONS.find((o) => o.id === selected) ?? PRO_BILLING_OPTIONS[1];

  return (
    <div className={cn("space-y-3", className)}>
      <div
        className={cn(
          "grid gap-2",
          compact ? "grid-cols-3" : "sm:grid-cols-3"
        )}
        role="radiogroup"
        aria-label="Pro billing period"
      >
        {PRO_BILLING_OPTIONS.map((billing) => {
          const isActive = billing.id === selected;
          return (
            <button
              key={billing.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => select(billing.id)}
              className={cn(
                "rounded-lg border px-3 py-2.5 text-left transition-colors",
                isActive
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-border hover:border-primary/40 hover:bg-muted/40"
              )}
            >
              <p className="text-sm font-medium">{billing.label}</p>
              <p className="mt-0.5 text-lg font-bold tracking-tight">${billing.price}</p>
              {billing.savings ? (
                <p className="text-xs text-amber-700 dark:text-amber-400">{billing.savings}</p>
              ) : (
                <p className="text-xs text-muted-foreground">Billed monthly</p>
              )}
            </button>
          );
        })}
      </div>
      {!compact ? (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">${option.price}</span>
          {" "}
          {option.periodLabel}
          {" · "}
          ~${option.perMonth.toFixed(2)}/mo equivalent
        </p>
      ) : null}
    </div>
  );
}

export function formatProPrice(interval: ProBillingInterval): string {
  const option = PRO_BILLING_OPTIONS.find((o) => o.id === interval) ?? PRO_BILLING_OPTIONS[0];
  return `$${option.price}`;
}
