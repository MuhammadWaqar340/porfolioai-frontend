"use client";

import Link from "next/link";
import { Bot, Crown, Loader2, Send, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSubscription } from "@/hooks/use-subscription";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { cn } from "@/lib/utils";
import { PAYMENT_PATH } from "@/constants/plans";
import { useGetAIStatusQuery, usePageChatMutation } from "@/store/api/portfolioApi";
import { useTargetRole } from "@/store/hooks";

type Message = { role: "user" | "assistant"; content: string };

export function AskAIFab() {
  const pathname = usePathname();
  const { canUseAI } = useSubscription();
  const { data: aiStatus } = useGetAIStatusQuery();
  const [pageChat, { isLoading }] = usePageChatMutation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const targetRole = useTargetRole();

  const aiReady = aiStatus?.available ?? false;
  const page = pathname.replace(/^\//, "") || "dashboard";

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading || !canUseAI) return;

    setError(null);
    const userMsg: Message = { role: "user", content: trimmed };
    const nextHistory = [...history, userMsg];
    setHistory(nextHistory);
    setInput("");

    try {
      const result = await pageChat({
        message: trimmed,
        page,
        history: history.slice(-6),
        target_role: targetRole,
      }).unwrap();
      setHistory([...nextHistory, { role: "assistant", content: result.reply }]);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  if (!canUseAI) {
    return (
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="fixed bottom-6 right-6 z-50 h-9 rounded-full px-3.5 shadow-md"
        render={<Link href={PAYMENT_PATH} />}
        nativeButton={false}
        title="AI assistance requires Pro"
      >
        <Crown className="mr-1.5 h-3.5 w-3.5 text-amber-600" />
        AI — Pro
      </Button>
    );
  }

  if (!open) {
    return (
      <Button
        type="button"
        size="sm"
        className="fixed bottom-6 right-6 z-50 h-9 rounded-full px-3.5 shadow-md"
        onClick={() => setOpen(true)}
        disabled={!aiReady}
        title={aiReady ? "Ask AI about this page" : aiStatus?.message}
      >
        <Bot className="mr-1.5 h-3.5 w-3.5" />
        Ask AI
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 flex w-[min(100vw-2rem,380px)] flex-col shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="h-4 w-4 text-primary" />
          Ask AI
        </CardTitle>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 pb-4">
        <p className="text-xs text-muted-foreground">
          Context: /{page}
        </p>
        <ScrollArea className="h-48 rounded-lg border p-3">
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Ask for help with this section of your portfolio.
            </p>
          ) : (
            <div className="space-y-2">
              {history.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-lg px-2 py-1.5 text-sm",
                    msg.role === "user" ? "bg-primary/10" : "bg-muted"
                  )}
                >
                  {msg.content}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Thinking…
                </div>
              )}
            </div>
          )}
        </ScrollArea>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <div className="flex gap-2">
          <Input
            className="min-w-0 flex-1"
            placeholder="Ask about this page…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading || !aiReady}
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleSend();
            }}
          />
          <Button
            type="button"
            size="icon"
            onClick={() => void handleSend()}
            disabled={!input.trim() || isLoading || !aiReady}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
