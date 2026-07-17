"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { Tilt } from "@/components/motion/tilt";
import { SectionAurora } from "@/components/landing/section-aurora";
import { ProBadge } from "@/components/subscription/pro-badge";
import {
  formatProPrice,
  ProBillingOptions,
} from "@/components/subscription/pro-billing-options";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PLAN_FEATURES, type ProBillingInterval } from "@/constants/plans";
import { cn } from "@/lib/utils";

export function PricingSection() {
  const [billing, setBilling] = useState<ProBillingInterval>("quarterly");

  return (
    <section id="pricing" className="relative py-20 sm:py-28">
      <SectionAurora align="left" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Upgrade when you are ready to stand out with Pro features.
          </p>
        </FadeIn>

        <FadeIn className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-10" delay={100}>
          <Tilt max={5}>
          <Card className="h-full border-border/80">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Everything you need to publish your first portfolio.</CardDescription>
              <p className="pt-2 text-4xl font-bold tracking-tight">
                $0
                <span className="text-base font-normal text-muted-foreground"> / forever</span>
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {PLAN_FEATURES.free.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={cn(buttonVariants({ variant: "outline" }), "w-full")}
              >
                Get started free
              </Link>
            </CardContent>
          </Card>
          </Tilt>

          <Tilt max={5}>
          <Card
            className={cn(
              "relative h-full overflow-hidden border-primary/25 shadow-lg",
              "bg-gradient-to-br from-primary/[0.06] via-background to-amber-500/[0.05]"
            )}
          >
            <div className="absolute right-4 top-4">
              <ProBadge />
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <CardDescription>For serious job seekers and freelancers.</CardDescription>
              <p className="pt-2 text-4xl font-bold tracking-tight">
                {formatProPrice(billing)}
              </p>
              <p className="text-sm text-muted-foreground">
                Includes unlimited AI, all templates, analytics, and more
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <ProBillingOptions value={billing} onChange={setBilling} />
              <ul className="space-y-3">
                {PLAN_FEATURES.pro.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup" className={cn(buttonVariants(), "w-full")}>
                Start free, upgrade later
              </Link>
            </CardContent>
          </Card>
          </Tilt>
        </FadeIn>
      </div>
    </section>
  );
}
