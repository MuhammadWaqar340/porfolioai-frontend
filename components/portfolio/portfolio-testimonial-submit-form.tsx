"use client";

import { Loader2, Quote, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useOptionalDemoPortfolio } from "@/contexts/portfolio-demo-context";
import { PortfolioPreviewOnlyNote } from "@/components/portfolio/portfolio-preview-only-note";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { notifySuccess } from "@/lib/toast";
import { useSubmitPortfolioTestimonialMutation } from "@/store/api/portfolioApi";

export function PortfolioTestimonialSubmitForm() {
  const portfolio = useOptionalDemoPortfolio();
  const [submitTestimonial, { isLoading }] = useSubmitPortfolioTestimonialMutation();
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [authorCompany, setAuthorCompany] = useState("");
  const [quote, setQuote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const displayOnly = portfolio?.displayOnly ?? false;

  if (!portfolio?.testimonialsEnabled) {
    return null;
  }

  if (
    !portfolio.testimonialSubmissionsEnabled &&
    !displayOnly
  ) {
    return null;
  }

  if (!portfolio.portfolioUsername && !displayOnly) {
    return null;
  }

  const canSubmit =
    !displayOnly && authorName.trim().length > 0 && quote.trim().length >= 5;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (displayOnly) return;
    setError(null);

    try {
      const username = portfolio?.portfolioUsername;
      if (!username) return;

      await submitTestimonial({
        username,
        author_name: authorName.trim(),
        author_role: authorRole.trim() || undefined,
        author_company: authorCompany.trim() || undefined,
        quote: quote.trim(),
      }).unwrap();
      setSent(true);
      setAuthorName("");
      setAuthorRole("");
      setAuthorCompany("");
      setQuote("");
      notifySuccess("Thank you — your testimonial was submitted for review.");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-dashed bg-muted/20 p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Quote className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold">Leave a testimonial</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Share a short quote about working with{" "}
            {portfolio.profile.fullName || "this person"}. It will be reviewed before
            appearing publicly.
          </p>
        </div>
      </div>

      {sent ? (
        <p className="rounded-lg border bg-background/60 px-4 py-3 text-sm text-muted-foreground">
          Thanks — your quote was sent for review. The portfolio owner will publish it if
          they approve.
        </p>
      ) : (
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          {displayOnly ? <PortfolioPreviewOnlyNote /> : null}
          <div className="space-y-2">
            <Label htmlFor="testimonial-submit-name">Your name</Label>
            <Input
              id="testimonial-submit-name"
              value={displayOnly ? "Taylor Brooks" : authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your full name"
              required
              maxLength={120}
              readOnly={displayOnly}
              disabled={displayOnly}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="testimonial-submit-role">Role (optional)</Label>
              <Input
                id="testimonial-submit-role"
                value={displayOnly ? "Design Lead" : authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="Your job title"
                maxLength={200}
                readOnly={displayOnly}
                disabled={displayOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="testimonial-submit-company">Company (optional)</Label>
              <Input
                id="testimonial-submit-company"
                value={displayOnly ? "Studio North" : authorCompany}
                onChange={(e) => setAuthorCompany(e.target.value)}
                placeholder="Where you work"
                maxLength={200}
                readOnly={displayOnly}
                disabled={displayOnly}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="testimonial-submit-quote">Your testimonial</Label>
            <Textarea
              id="testimonial-submit-quote"
              value={
                displayOnly
                  ? "Consistently thoughtful, reliable, and great to work with on cross-functional launches."
                  : quote
              }
              onChange={(e) => setQuote(e.target.value)}
              placeholder="What stood out about their work, communication, or impact?"
              rows={5}
              required
              minLength={5}
              maxLength={2000}
              className="max-h-48 min-h-[120px] resize-none overflow-y-auto overflow-x-auto leading-relaxed [field-sizing:fixed]"
              readOnly={displayOnly}
              disabled={displayOnly}
            />
            {!displayOnly ? (
              <p className="text-xs text-muted-foreground">
                {quote.length.toLocaleString()} / 2,000 characters
              </p>
            ) : null}
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" size="sm" disabled={isLoading || !canSubmit}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Submit testimonial
          </Button>
        </form>
      )}
    </section>
  );
}
