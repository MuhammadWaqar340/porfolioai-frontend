import type { ReactNode } from "react";
import { ScrollableCardBody } from "@/components/ui/scrollable-card-body";

interface InboxScrollableBodyProps {
  children: ReactNode;
}

/** Scrollable message/feedback body for inbox cards. */
export function InboxScrollableBody({ children }: InboxScrollableBodyProps) {
  return (
    <ScrollableCardBody>
      <p className="break-words [overflow-wrap:anywhere] whitespace-pre-wrap text-sm leading-relaxed text-foreground">
        {children}
      </p>
    </ScrollableCardBody>
  );
}
