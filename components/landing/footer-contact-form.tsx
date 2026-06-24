"use client";

import { Loader2, Mail, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { notifySuccess } from "@/lib/toast";
import { useAppSelector } from "@/store/hooks";
import { useSubmitPlatformSupportMutation } from "@/store/api/portfolioApi";

export function FooterContactForm() {
  const user = useAppSelector((state) => state.auth.user);
  const [submitSupport, { isLoading }] = useSubmitPlatformSupportMutation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [sentToEmail, setSentToEmail] = useState("");

  useEffect(() => {
    if (!user) return;

    const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
    if (fullName && !name) {
      setName(fullName);
    }
    if (user.email && !email) {
      setEmail(user.email);
    }
  }, [user, name, email]);

  const canSubmit =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    message.trim().length >= 5;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    try {
      await submitSupport({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      }).unwrap();

      setSent(true);
      setSentToEmail(email.trim());
      setSubject("");
      setMessage("");
      if (!user) {
        setName("");
        setEmail("");
      }
      notifySuccess("Message sent. We'll get back to you soon.");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  return (
    <div className="rounded-2xl border bg-card/80 p-5 shadow-sm sm:p-6">
      {sent ? (
        <div className="space-y-2 py-4 text-center sm:py-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold">Thanks for reaching out</h3>
          <p className="text-sm text-muted-foreground">
            We received your message and will reply to{" "}
            <span className="font-medium text-foreground">{sentToEmail || "your email"}</span>{" "}
            as soon as we can.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => setSent(false)}
          >
            Send another message
          </Button>
        </div>
      ) : (
        <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="support-name">Name</Label>
              <Input
                id="support-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                required
                maxLength={120}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-email">Email</Label>
              <Input
                id="support-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                maxLength={255}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="support-subject">Subject (optional)</Label>
            <Input
              id="support-subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Billing, feature request, bug report..."
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="support-message">Message</Label>
            <Textarea
              id="support-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Tell us how we can help..."
              rows={4}
              required
              minLength={5}
              maxLength={2000}
              className="max-h-40 min-h-28 resize-none overflow-y-auto [field-sizing:fixed]"
            />
            <p className="text-[11px] text-muted-foreground">
              {message.length > 0
                ? `${message.length.toLocaleString()} / 2,000 characters`
                : "Up to 2,000 characters"}
            </p>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button type="submit" disabled={isLoading || !canSubmit}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Send message
          </Button>
        </form>
      )}
    </div>
  );
}
