"use client";

import { Quote } from "lucide-react";
import { useOptionalDemoPortfolio } from "@/contexts/portfolio-demo-context";
import { ScrollableCardBody } from "@/components/ui/scrollable-card-body";
import { cn } from "@/lib/utils";

interface PortfolioTestimonialsProps {
  className?: string;
}

export function PortfolioTestimonials({ className }: PortfolioTestimonialsProps) {
  const portfolio = useOptionalDemoPortfolio();

  if (
    !portfolio?.testimonialsEnabled ||
    (!portfolio.testimonials?.length && !portfolio.displayOnly)
  ) {
    return null;
  }

  return (
    <section
      data-portfolio-section="testimonials"
      className={cn("min-w-0 space-y-6", className)}
    >
      <div className="flex items-center gap-2">
        <Quote className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold tracking-tight">Testimonials</h2>
      </div>
      <div className="portfolio-stagger-children grid min-w-0 gap-4 sm:grid-cols-2">
        {portfolio.testimonials.map((item) => {
          const subtitle = [item.authorRole, item.authorCompany].filter(Boolean).join(" · ");
          return (
            <figure
              key={item.id}
              className="min-w-0 overflow-hidden rounded-xl border bg-card/60 p-5 shadow-sm"
            >
              <ScrollableCardBody>
                <blockquote className="break-words [overflow-wrap:anywhere] whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  “{item.quote}”
                </blockquote>
              </ScrollableCardBody>
              <figcaption className="mt-4 border-t pt-3">
                <p className="font-medium">{item.authorName}</p>
                {subtitle ? (
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                ) : null}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
