"use client";

import { Bot, Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { AI_QUICK_PROMPTS } from "@/lib/ai/copilot";
import { cn } from "@/lib/utils";
import {
  useAiChatMutation,
  useGetAIStatusQuery,
} from "@/store/api/portfolioApi";
import { useTargetRole } from "@/store/hooks";
import type { ChatMessage } from "@/types";

function newMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date().toISOString(),
  };
}

export function AIChatPanel() {
  const { data: aiStatus } = useGetAIStatusQuery();
  const [aiChat, { isLoading: chatLoading }] = useAiChatMutation();
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatError, setChatError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const targetRole = useTargetRole();

  const aiReady = aiStatus?.available ?? false;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatHistory, chatLoading]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || chatLoading || !aiReady) return;

    setChatError(null);
    const userMsg = newMessage("user", trimmed);
    setChatHistory((prev) => [...prev, userMsg]);
    setChatInput("");

    try {
      const history = [...chatHistory, userMsg].slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const result = await aiChat({
        message: trimmed,
        history: history.slice(0, -1),
        target_role: targetRole,
      }).unwrap();

      setChatHistory((prev) => [
        ...prev,
        newMessage("assistant", result.reply),
      ]);
    } catch (error) {
      setChatError(getApiErrorMessage(error));
    }
  }

  return (
    <Card id="chat" className="flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="h-4 w-4 text-primary" />
          Chat
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Uses your saved profile data
          {targetRole ? ` and target role (${targetRole})` : ""} for context-aware answers.
        </p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {AI_QUICK_PROMPTS.map((prompt) => (
            <Button
              key={prompt}
              type="button"
              variant="secondary"
              size="sm"
              className="h-auto whitespace-normal px-3 py-1.5 text-left text-xs font-normal"
              disabled={chatLoading || !aiReady}
              onClick={() => void sendMessage(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>

        <div
          className="h-80 max-h-[50vh] overflow-y-auto rounded-lg border p-4 scroll-smooth"
          aria-label="Chat messages"
          role="log"
        >
          {chatHistory.length === 0 ? (
            <div className="flex h-full min-h-[12rem] flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
              <Bot className="h-8 w-8 text-primary/60" />
              <p>Pick a prompt above or type your own question.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "max-w-[92%] break-words rounded-lg px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap",
                    msg.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {msg.content}
                </div>
              ))}
              {chatLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking…
                </div>
              )}
              <div ref={messagesEndRef} aria-hidden />
            </div>
          )}
        </div>

        {chatError && <p className="text-sm text-destructive">{chatError}</p>}

        <div className="flex gap-2">
          <Input
            className="min-w-0 flex-1"
            placeholder="e.g. How can I make my about section stronger?"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={chatLoading || !aiReady}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void sendMessage(chatInput);
              }
            }}
          />
          <Button
            size="icon"
            onClick={() => void sendMessage(chatInput)}
            disabled={chatLoading || !chatInput.trim() || !aiReady}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
