"use client";

import { MessagesInbox } from "@/components/messages/messages-inbox";
import { PageHeader } from "@/components/layout/page-header";

export function MessagesPageClient() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages & Feedback"
        description="Full contact form messages and share-link feedback from visitors to your portfolio."
      />
      <div className="max-w-3xl">
        <MessagesInbox />
      </div>
    </div>
  );
}
