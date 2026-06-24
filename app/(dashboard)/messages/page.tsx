import { Suspense } from "react";
import { MessagesPageClient } from "@/components/messages/messages-page-client";

export const metadata = {
  title: "Messages & Feedback",
};

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="h-40 animate-pulse rounded-lg bg-muted/30" aria-busy="true" />
      }
    >
      <MessagesPageClient />
    </Suspense>
  );
}
