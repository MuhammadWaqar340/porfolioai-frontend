"use client";

import { Loader2, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useOptionalDemoPortfolio } from "@/contexts/portfolio-demo-context";
import { PortfolioPreviewOnlyNote } from "@/components/portfolio/portfolio-preview-only-note";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { notifySuccess } from "@/lib/toast";
import { useSubmitPortfolioContactMutation } from "@/store/api/portfolioApi";

export function PortfolioContactForm() {
  const portfolio = useOptionalDemoPortfolio();
  const [submitContact, { isLoading }] = useSubmitPortfolioContactMutation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const displayOnly = portfolio?.displayOnly ?? false;

  if (!portfolio?.contactFormEnabled) {
    return null;
  }

  if (!portfolio.portfolioUsername && !displayOnly) {
    return null;
  }

  const canSubmit =
    name.trim().length > 0 && message.trim().length >= 5;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (displayOnly) return;
    setError(null);

    try {
      const ownerUsername = portfolio?.portfolioUsername;
      if (!ownerUsername) return;

      await submitContact({
        username: ownerUsername,
        name: name.trim(),
        email: email.trim() || undefined,
        message: message.trim(),
      }).unwrap();
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
      notifySuccess("Message sent to the portfolio owner.");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  return (
    <section id="contact" className="rounded-xl border bg-card/60 p-5">
      <div className="mb-4 flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-primary" />
        <h2 className="text-lg font-semibold">Get in touch</h2>
      </div>
      {sent ? (
        <p className="text-sm text-muted-foreground">
          Thanks — your message was sent. The portfolio owner will be notified in their dashboard.
        </p>
      ) : (
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
          {displayOnly ? <PortfolioPreviewOnlyNote /> : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                value={displayOnly ? "Jordan Lee" : name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={120}
                readOnly={displayOnly}
                disabled={displayOnly}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact-email">Email (optional)</Label>
              <Input
                id="contact-email"
                type="email"
                value={displayOnly ? "jordan@example.com" : email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                readOnly={displayOnly}
                disabled={displayOnly}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contact-message">Message</Label>
            <Textarea
              id="contact-message"
              value={
                displayOnly
                  ? "Hi — I saw your portfolio and would love to connect about an opportunity."
                  : message
              }
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
              minLength={5}
              maxLength={2000}
              className="max-h-36 min-h-24 resize-none overflow-y-auto [field-sizing:fixed]"
              readOnly={displayOnly}
              disabled={displayOnly}
            />
            {!displayOnly ? (
              <p className="text-[11px] text-muted-foreground">
                {message.length > 0
                  ? `${message.length.toLocaleString()} / 2,000 characters`
                  : "Up to 2,000 characters"}
              </p>
            ) : null}
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" size="sm" disabled={isLoading || displayOnly || !canSubmit}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Send message
          </Button>
        </form>
      )}
    </section>
  );
}
