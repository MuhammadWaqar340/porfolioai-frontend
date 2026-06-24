"use client";

import { AccountSettingsPanel } from "@/components/settings/account-settings-panel";
import { MeetBookingPanel } from "@/components/settings/meet-booking-panel";
import { PortfolioSettingsPanel } from "@/components/settings/portfolio-settings-panel";
import { PortfolioVariantsPanel } from "@/components/settings/portfolio-variants-panel";
import { ShareLinksPanel } from "@/components/settings/share-links-panel";
import { SubscriptionPanel } from "@/components/settings/subscription-panel";
import { TargetRoleSettings } from "@/components/settings/target-role-settings";

export function SettingsPageContent() {
  return (
    <div className="grid max-w-2xl gap-6">
      <SubscriptionPanel />
      <TargetRoleSettings />
      <PortfolioSettingsPanel />
      <MeetBookingPanel />
      <PortfolioVariantsPanel />
      <ShareLinksPanel />
      <AccountSettingsPanel />
    </div>
  );
}
