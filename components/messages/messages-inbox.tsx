"use client";

import { formatDistanceToNow } from "date-fns";
import { Loader2, Mail, MessageCircle, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { InboxScrollableBody } from "@/components/messages/inbox-scrollable-body";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notifySuccess } from "@/lib/toast";
import {
  useDeleteContactMessageMutation,
  useDeletePortfolioFeedbackMutation,
  useGetContactMessagesQuery,
  useGetPortfolioFeedbackQuery,
} from "@/store/api/portfolioApi";

function formatTime(value: string) {
  try {
    return formatDistanceToNow(new Date(value), { addSuffix: true });
  } catch {
    return "Recently";
  }
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 px-6 py-12 text-center">
      <p className="font-medium">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function MessagesInbox() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "feedback" ? "feedback" : "messages";
  const [tab, setTab] = useState<"messages" | "feedback">(initialTab);

  const {
    data: messages = [],
    isLoading: messagesLoading,
    isFetching: messagesFetching,
  } = useGetContactMessagesQuery();
  const {
    data: feedback = [],
    isLoading: feedbackLoading,
    isFetching: feedbackFetching,
  } = useGetPortfolioFeedbackQuery();
  const [deleteMessage, { isLoading: deletingMessage }] = useDeleteContactMessageMutation();
  const [deleteFeedback, { isLoading: deletingFeedback }] = useDeletePortfolioFeedbackMutation();

  useEffect(() => {
    if (searchParams.get("tab") === "feedback") {
      setTab("feedback");
    }
  }, [searchParams]);

  async function handleDeleteMessage(id: string) {
    try {
      await deleteMessage(id).unwrap();
      notifySuccess("Message deleted.");
    } catch {
      // Error toast handled by API layer if configured
    }
  }

  async function handleDeleteFeedback(id: string) {
    try {
      await deleteFeedback(id).unwrap();
      notifySuccess("Feedback deleted.");
    } catch {
      // ignore
    }
  }

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => setTab(value as "messages" | "feedback")}
      className="space-y-4"
    >
      <TabsList>
        <TabsTrigger value="messages" className="gap-2">
          <Mail className="h-4 w-4" />
          Messages
          {messages.length > 0 ? (
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium">
              {messages.length}
            </span>
          ) : null}
        </TabsTrigger>
        <TabsTrigger value="feedback" className="gap-2">
          <MessageCircle className="h-4 w-4" />
          Feedback
          {feedback.length > 0 ? (
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium">
              {feedback.length}
            </span>
          ) : null}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="messages" className="space-y-3">
        {messagesLoading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading messages…
          </div>
        ) : messages.length === 0 ? (
          <EmptyState
            title="No messages yet"
            description="When someone uses the contact form on your public portfolio, their full message will appear here."
          />
        ) : (
          <ul className="space-y-3">
            {messages.map((item) => (
              <li key={item.id}>
                <Card>
                  <CardContent className="space-y-3 pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{item.sender_name}</p>
                        {item.sender_email ? (
                          <a
                            href={`mailto:${item.sender_email}`}
                            className="text-sm text-primary hover:underline"
                          >
                            {item.sender_email}
                          </a>
                        ) : (
                          <p className="text-xs text-muted-foreground">No email provided</p>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {formatTime(item.created_at)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          className="text-muted-foreground hover:text-destructive"
                          disabled={deletingMessage}
                          aria-label="Delete message"
                          onClick={() => void handleDeleteMessage(item.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <InboxScrollableBody>{item.message}</InboxScrollableBody>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
        {messagesFetching && !messagesLoading ? (
          <p className="text-center text-xs text-muted-foreground">Refreshing…</p>
        ) : null}
      </TabsContent>

      <TabsContent value="feedback" className="space-y-3">
        {feedbackLoading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading feedback…
          </div>
        ) : feedback.length === 0 ? (
          <EmptyState
            title="No feedback yet"
            description="Feedback from private share links appears here with the full comment and section."
          />
        ) : (
          <ul className="space-y-3">
            {feedback.map((item) => (
              <li key={item.id}>
                <Card>
                  <CardContent className="space-y-3 pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{item.viewer_name}</p>
                        {item.section ? (
                          <p className="text-xs text-muted-foreground">
                            Section: <span className="font-medium text-foreground">{item.section}</span>
                          </p>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {formatTime(item.created_at)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          className="text-muted-foreground hover:text-destructive"
                          disabled={deletingFeedback}
                          aria-label="Delete feedback"
                          onClick={() => void handleDeleteFeedback(item.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <InboxScrollableBody>{item.message}</InboxScrollableBody>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
        {feedbackFetching && !feedbackLoading ? (
          <p className="text-center text-xs text-muted-foreground">Refreshing…</p>
        ) : null}
      </TabsContent>
    </Tabs>
  );
}
