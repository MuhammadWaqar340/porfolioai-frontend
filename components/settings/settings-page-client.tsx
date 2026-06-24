"use client";

import { PageHeader } from "@/components/layout/page-header";
import { SettingsPageContent } from "@/components/settings/settings-page-content";

export function SettingsPageClient() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your account and portfolio preferences."
      />
      <SettingsPageContent />
    </div>
  );
}
