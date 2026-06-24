"use client";

import Link from "next/link";
import { Loader2, Search } from "lucide-react";
import { PortfolioSectionScores } from "@/components/ai/portfolio-section-scores";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { cn } from "@/lib/utils";
import { usePortfolioReviewMutation } from "@/store/api/portfolioApi";

function priorityVariant(priority: string) {
  if (priority === "high") return "destructive" as const;
  if (priority === "medium") return "secondary" as const;
  return "outline" as const;
}

export function PortfolioReviewPanel() {
  const [portfolioReview, { isLoading: reviewLoading, data: reviewResult, error }] =
    usePortfolioReviewMutation({
      fixedCacheKey: "dashboard-portfolio-review",
    });

  const reviewError = error ? getApiErrorMessage(error) : null;

  async function handleReview() {
    try {
      await portfolioReview().unwrap();
    } catch {
      // Errors surface via mutation state when we add error UI; Run is manual here.
    }
  }

  return (
    <Card className="flex h-full w-full flex-col">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-3">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-base">
            <Search className="h-4 w-4 text-primary" />
            Portfolio review
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Section scores, summary, and prioritized fixes for your target role.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => void handleReview()}
          disabled={reviewLoading}
        >
          {reviewLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Run"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviewError ? <p className="text-sm text-destructive">{reviewError}</p> : null}
        {reviewResult ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                Score {reviewResult.score}/100
              </Badge>
              <Badge variant="outline" className="text-xs">
                {reviewResult.completeness_score}% complete
              </Badge>
              {reviewResult.target_role ? (
                <Badge variant="outline" className="text-xs">
                  {reviewResult.target_role}
                </Badge>
              ) : null}
            </div>

            {reviewResult.section_scores && reviewResult.section_scores.length > 0 ? (
              <PortfolioSectionScores
                scores={reviewResult.section_scores}
                layout="horizontal"
              />
            ) : null}

            <p className="text-sm leading-relaxed text-muted-foreground">
              {reviewResult.summary}
            </p>

            {reviewResult.suggestions.length > 0 ? (
              <ul className="grid gap-2 sm:grid-cols-2">
                {reviewResult.suggestions.slice(0, 4).map((item, index) => (
                  <li
                    key={`${item.category}-${index}`}
                    className={cn(
                      "flex flex-col gap-2 rounded-lg border bg-muted/15 p-3 text-sm"
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={priorityVariant(item.priority)} className="text-[10px]">
                        {item.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{item.category}</span>
                    </div>
                    <p className="min-w-0 flex-1 text-xs leading-relaxed text-foreground">
                      {item.message}
                    </p>
                    {item.action_path ? (
                      <Button
                        size="sm"
                        variant="link"
                        className="h-auto self-start p-0 text-xs"
                        render={<Link href={item.action_path} />}
                        nativeButton={false}
                      >
                        Fix →
                      </Button>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Run a review to see section scores, summary, and suggested fixes.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
