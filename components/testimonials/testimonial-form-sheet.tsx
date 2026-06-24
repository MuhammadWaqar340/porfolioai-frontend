"use client";

import { Eye, EyeOff, Loader2, Quote } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/form-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ScrollableCardBody } from "@/components/ui/scrollable-card-body";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { cn } from "@/lib/utils";
import type { PortfolioTestimonial } from "@/lib/api/types";
import {
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
} from "@/store/api/portfolioApi";

interface TestimonialFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial: PortfolioTestimonial | null;
}

function TestimonialPreview({
  authorName,
  authorRole,
  authorCompany,
  quote,
  className,
}: {
  authorName: string;
  authorRole: string;
  authorCompany: string;
  quote: string;
  className?: string;
}) {
  const subtitle = [authorRole, authorCompany].filter(Boolean).join(" · ");
  const hasQuote = quote.trim().length > 0;

  return (
    <div
      className={cn(
        "rounded-xl border bg-gradient-to-br from-primary/8 via-card to-violet-500/5 p-5 shadow-sm",
        className
      )}
    >
      <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-primary">
        <Quote className="h-3.5 w-3.5" />
        Portfolio preview
      </div>
      <ScrollableCardBody className="max-h-36">
        <blockquote
          className={cn(
            "break-words [overflow-wrap:anywhere] whitespace-pre-wrap text-sm leading-relaxed",
            hasQuote ? "text-foreground" : "italic text-muted-foreground"
          )}
        >
          {hasQuote ? `“${quote.trim()}”` : "Their quote will show here as you type…"}
        </blockquote>
      </ScrollableCardBody>
      <figcaption className="mt-4 border-t border-border/60 pt-3">
        <p className="font-medium">{authorName.trim() || "Author name"}</p>
        <p className="text-sm text-muted-foreground">
          {subtitle || "Role · Company (optional)"}
        </p>
      </figcaption>
    </div>
  );
}

export function TestimonialFormSheet({
  open,
  onOpenChange,
  testimonial,
}: TestimonialFormSheetProps) {
  const [createTestimonial, { isLoading: isCreating }] = useCreateTestimonialMutation();
  const [updateTestimonial, { isLoading: isUpdating }] = useUpdateTestimonialMutation();
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [authorCompany, setAuthorCompany] = useState("");
  const [quote, setQuote] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(testimonial);
  const busy = isCreating || isUpdating;
  const quoteLength = quote.length;

  const canSubmit = useMemo(
    () => authorName.trim().length > 0 && quote.trim().length >= 5,
    [authorName, quote]
  );

  useEffect(() => {
    if (!open) return;
    setAuthorName(testimonial?.author_name ?? "");
    setAuthorRole(testimonial?.author_role ?? "");
    setAuthorCompany(testimonial?.author_company ?? "");
    setQuote(testimonial?.quote ?? "");
    setIsPublished(testimonial?.is_published ?? true);
    setError(null);
  }, [open, testimonial]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const body = {
      author_name: authorName.trim(),
      author_role: authorRole.trim(),
      author_company: authorCompany.trim(),
      quote: quote.trim(),
      is_published: isPublished,
    };

    try {
      if (isEditing && testimonial) {
        await updateTestimonial({ id: testimonial.id, ...body }).unwrap();
      } else {
        await createTestimonial(body).unwrap();
      }
      onOpenChange(false);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg">
        <SheetHeader className="border-b pb-4 pr-12">
          <SheetTitle className="text-lg">
            {isEditing ? "Edit testimonial" : "Add testimonial"}
          </SheetTitle>
          <SheetDescription>
            Social proof from clients, managers, or colleagues — shown on your public
            portfolio.
          </SheetDescription>
        </SheetHeader>

        <form
          id="testimonial-form"
          onSubmit={(e) => void handleSubmit(e)}
          className="flex flex-col gap-6 px-4 py-6"
        >
          <TestimonialPreview
            authorName={authorName}
            authorRole={authorRole}
            authorCompany={authorCompany}
            quote={quote}
          />

          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-foreground">Who said it</legend>
            <div className="space-y-2">
              <Label htmlFor="testimonial-name">Full name</Label>
              <Input
                id="testimonial-name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Sarah Chen"
                required
                maxLength={120}
                autoFocus
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="testimonial-role">Role / title</Label>
                <Input
                  id="testimonial-role"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  placeholder="Engineering Manager"
                  maxLength={200}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="testimonial-company">Company</Label>
                <Input
                  id="testimonial-company"
                  value={authorCompany}
                  onChange={(e) => setAuthorCompany(e.target.value)}
                  placeholder="Acme Corp"
                  maxLength={200}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-2">
            <legend className="mb-2 text-sm font-semibold text-foreground">Their quote</legend>
            <Textarea
              id="testimonial-quote"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="What did they say about working with you? Keep it specific and credible."
              rows={6}
              required
              minLength={5}
              maxLength={2000}
              className="max-h-52 min-h-[140px] resize-none overflow-y-auto overflow-x-auto leading-relaxed [field-sizing:fixed]"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Minimum 5 characters</span>
              <span className={cn(quoteLength > 1900 && "text-amber-600 dark:text-amber-400")}>
                {quoteLength.toLocaleString()} / 2,000
              </span>
            </div>
          </fieldset>

          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  isPublished ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                )}
              >
                {isPublished ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="testimonial-published" className="text-sm font-medium">
                    Show on public portfolio
                  </Label>
                  <Switch
                    id="testimonial-published"
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                  />
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {isPublished
                    ? "Visitors will see this quote on your portfolio."
                    : "Saved as a draft — publish when you are ready."}
                </p>
              </div>
            </div>
          </div>

          {error ? <FormAlert message={error} /> : null}
        </form>

        <SheetFooter className="border-t bg-background/95 px-4 py-4 backdrop-blur-sm">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="testimonial-form"
            disabled={busy || !canSubmit}
          >
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isEditing ? "Save changes" : "Add testimonial"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
