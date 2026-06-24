"use client";

import Link from "next/link";
import { useState } from "react";
import { Crown, Sparkles } from "lucide-react";
import { ProBadge } from "@/components/subscription/pro-badge";
import {
  formatProPrice,
  ProBillingOptions,
} from "@/components/subscription/pro-billing-options";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PLAN_FEATURES, PAYMENT_PATH, type ProBillingInterval } from "@/constants/plans";
import { cn } from "@/lib/utils";

interface ProUpgradeCardProps {
  title?: string;
  description?: string;
  className?: string;
  compact?: boolean;
}

export function ProUpgradeCard({
  title = "Upgrade to Pro",
  description = "Unlock premium templates, unlimited AI, video intro, analytics, variants, and private share links.",
  className,
  compact = false,
}: ProUpgradeCardProps) {
  const [billing, setBilling] = useState<ProBillingInterval>("quarterly");

  return (
    <Card
      className={cn(
        "overflow-hidden border-amber-500/20 bg-gradient-to-br from-amber-500/[0.06] via-background to-primary/[0.04]",
        className
      )}
    >
      <CardHeader className={cn(compact && "pb-3")}>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300">
            <Crown className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              {title}
              <ProBadge />
            </CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className={cn("space-y-4", compact && "pt-0")}>
        {!compact ? (
          <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            {PLAN_FEATURES.pro.slice(0, 6).map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <ProBillingOptions value={billing} onChange={setBilling} compact={compact} />
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={PAYMENT_PATH}
            className={cn(buttonVariants())}
          >
            Upgrade — {formatProPrice(billing)}
          </Link>
          <p className="text-xs text-muted-foreground">
            Secure checkout is coming soon on the payment page.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
