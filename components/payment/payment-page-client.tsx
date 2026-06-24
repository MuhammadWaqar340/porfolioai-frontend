"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, Clock, Crown, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ProBadge } from "@/components/subscription/pro-badge";
import {
  formatProPrice,
  ProBillingOptions,
} from "@/components/subscription/pro-billing-options";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PLAN_FEATURES,
  type ProBillingInterval,
} from "@/constants/plans";
import { useSubscription } from "@/hooks/use-subscription";
import { cn } from "@/lib/utils";

export function PaymentPageClient() {
  const { isPro, plan } = useSubscription();
  const [billing, setBilling] = useState<ProBillingInterval>("quarterly");

  if (isPro) {
    return (
      <div className="mx-auto max-w-2xl space-y-8">
        <PageHeader
          title="Billing"
          description="Manage your PortfolioAI subscription."
        />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-600" />
              You&apos;re on Pro
              <ProBadge />
            </CardTitle>
            <CardDescription>
              Current plan: <span className="capitalize text-foreground">{plan}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Subscription management and invoices will be available here when payments
              launch.
            </p>
            <Link href="/settings" className={buttonVariants({ variant: "outline" })}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to settings
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader
        title="Upgrade to Pro"
        description="Unlock premium templates, unlimited AI, analytics, and more."
      />

      <Card className="overflow-hidden border-amber-500/20 bg-gradient-to-br from-amber-500/[0.06] via-background to-primary/[0.04]">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="flex flex-wrap items-center gap-2 text-xl">
                Payments coming soon
                <ProBadge />
              </CardTitle>
              <CardDescription className="mt-2 text-base">
                We&apos;re finishing secure checkout. Pick a billing period below — you&apos;ll
                be able to complete payment here shortly.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProBillingOptions value={billing} onChange={setBilling} />

          <div className="rounded-lg border border-dashed border-amber-500/30 bg-background/60 px-4 py-3 text-center">
            <p className="text-sm font-medium text-foreground">
              Selected plan: {formatProPrice(billing)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Checkout is not live yet. Check back soon or contact support to enable Pro
              manually.
            </p>
          </div>

          <Button type="button" className="w-full" disabled>
            Pay {formatProPrice(billing)} — coming soon
          </Button>

          <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            {PLAN_FEATURES.pro.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Free plan includes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {PLAN_FEATURES.free.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "outline" }), "mt-6")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue with Free
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
