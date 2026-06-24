"use client";

import { Loader2, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { PortfolioSectionScores } from "@/components/ai/portfolio-section-scores";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscription } from "@/hooks/use-subscription";
import { PAYMENT_PATH } from "@/constants/plans";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { cn } from "@/lib/utils";
import { usePortfolioReviewMutation } from "@/store/api/portfolioApi";

const DASHBOARD_REVIEW_CACHE_KEY = "dashboard-portfolio-review";

let hasAutoTriggeredReview = false;

export function resetPortfolioReviewSession() {
  hasAutoTriggeredReview = false;
}

function priorityVariant(priority: string) {
  if (priority === "high") return "destructive" as const;
  if (priority === "medium") return "secondary" as const;
  return "outline" as const;
}

export function PortfolioReviewCard() {
  const { canUseAI } = useSubscription();
  const [runReview, { data: result, isLoading, error }] =
    usePortfolioReviewMutation({
      fixedCacheKey: DASHBOARD_REVIEW_CACHE_KEY,
    });

  useEffect(() => {
    if (!canUseAI || hasAutoTriggeredReview) return;
    hasAutoTriggeredReview = true;
    void runReview();
  }, [runReview, canUseAI]);

  const errorMessage = error ? getApiErrorMessage(error) : null;

  return (
    <Card className="overflow-hidden border-primary/15">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          AI Portfolio Health
        </CardTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={() => void runReview()}
          disabled={isLoading || !canUseAI}
          title={canUseAI ? undefined : "AI portfolio review requires Pro"}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorMessage && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}
        {isLoading && !result && (
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Analyzing your portfolio…
            </p>
            <p className="text-xs text-muted-foreground">
              Local AI can take up to a minute on first run.
            </p>
          </div>
        )}
        {result && (
          <>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary">Score: {result.score}/100</Badge>
              <Badge variant="outline">
                Completeness: {result.completeness_score}%
              </Badge>
              {result.target_role ? (
                <Badge variant="outline">Role: {result.target_role}</Badge>
              ) : null}
            </div>
            {result.section_scores && result.section_scores.length > 0 ? (
              <PortfolioSectionScores
                scores={result.section_scores}
                layout="horizontal"
              />
            ) : null}
            <p className="text-sm leading-relaxed">{result.summary}</p>
            {result.suggestions.length > 0 && (
              <ul className="space-y-2">
                {result.suggestions.slice(0, 4).map((item, index) => (
                  <li
                    key={`${item.category}-${index}`}
                    className={cn(
                      "flex flex-wrap items-start gap-2 rounded-lg border p-3 text-sm"
                    )}
                  >
                    <Badge variant={priorityVariant(item.priority)}>
                      {item.priority}
                    </Badge>
                    <span className="min-w-0 flex-1">{item.message}</span>
                    {item.action_path && (
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0"
                        render={<Link href={item.action_path} />}
                        nativeButton={false}
                      >
                        Fix
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        {!canUseAI && (
          <p className="text-sm text-muted-foreground">
            AI portfolio review is a Pro feature.{" "}
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0"
              render={<Link href={PAYMENT_PATH} />}
              nativeButton={false}
            >
              Upgrade to Pro
            </Button>
          </p>
        )}
        {!isLoading && !result && !errorMessage && canUseAI && (
          <p className="text-sm text-muted-foreground">
            Click Refresh to run an AI portfolio review.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
