"use client";

import { Crown } from "lucide-react";
import { ProBadge } from "@/components/subscription/pro-badge";
import { ProUpgradeCard } from "@/components/subscription/pro-upgrade-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscription } from "@/hooks/use-subscription";

export function SubscriptionPanel() {
  const { plan, isPro } = useSubscription();

  if (isPro) {
    return (
      <Card id="upgrade">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-600" />
            Pro plan
            <ProBadge />
          </CardTitle>
          <CardDescription>
            You have full access to all PortfolioAI Pro features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Current plan: <span className="font-medium capitalize text-foreground">{plan}</span>
            {" · "}Unlimited AI · All templates · Analytics · Variants · Share links · Video intro
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div id="upgrade" className="space-y-4">
      <ProUpgradeCard />
      <p className="text-sm text-muted-foreground">
        AI assistance, premium templates, analytics, and more require Pro. Choose a billing period above to see pricing.
      </p>
    </div>
  );
}
