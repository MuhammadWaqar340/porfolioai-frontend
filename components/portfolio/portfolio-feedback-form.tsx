"use client";

import { Loader2, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useOptionalDemoPortfolio } from "@/contexts/portfolio-demo-context";
import { PortfolioPreviewOnlyNote } from "@/components/portfolio/portfolio-preview-only-note";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { notifySuccess } from "@/lib/toast";
import { useSubmitShareFeedbackMutation } from "@/store/api/portfolioApi";

export function PortfolioFeedbackForm() {
  const portfolio = useOptionalDemoPortfolio();
  const [submitFeedback, { isLoading }] = useSubmitShareFeedbackMutation();
  const [viewerName, setViewerName] = useState("");
  const [section, setSection] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const displayOnly = portfolio?.displayOnly ?? false;

  if (!portfolio?.allowFeedback) {
    return null;
  }

  if (!portfolio.shareToken && !displayOnly) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (displayOnly) return;
    setError(null);

    try {
      const shareToken = portfolio?.shareToken;
      if (!shareToken) return;

      await submitFeedback({
        token: shareToken,
        viewer_name: viewerName.trim(),
        section: section.trim() || undefined,
        message: message.trim(),
      }).unwrap();
      setSent(true);
      notifySuccess("Feedback submitted. Thank you!");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  return (
    <section className="rounded-xl border border-dashed bg-muted/20 p-5">
      <div className="mb-3 flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-primary" />
        <h2 className="text-base font-semibold">Leave feedback</h2>
      </div>
      {sent ? (
        <p className="text-sm text-muted-foreground">Thanks for the feedback.</p>
      ) : (
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
          {displayOnly ? <PortfolioPreviewOnlyNote /> : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="feedback-name">Your name</Label>
              <Input
                id="feedback-name"
                value={displayOnly ? "Recruiter preview" : viewerName}
                onChange={(e) => setViewerName(e.target.value)}
                required
                readOnly={displayOnly}
                disabled={displayOnly}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="feedback-section">Section (optional)</Label>
              <Input
                id="feedback-section"
                placeholder="e.g. Projects"
                value={displayOnly ? "Projects" : section}
                onChange={(e) => setSection(e.target.value)}
                readOnly={displayOnly}
                disabled={displayOnly}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="feedback-message">Feedback</Label>
            <Textarea
              id="feedback-message"
              value={
                displayOnly
                  ? "The projects section is clear and easy to scan — great use of visuals."
                  : message
              }
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              required
              minLength={5}
              maxLength={2000}
              className="max-h-32 min-h-20 resize-none overflow-y-auto [field-sizing:fixed]"
              readOnly={displayOnly}
              disabled={displayOnly}
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button
            type="submit"
            size="sm"
            variant="outline"
            disabled={isLoading || displayOnly}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Submit feedback
          </Button>
        </form>
      )}
    </section>
  );
}
