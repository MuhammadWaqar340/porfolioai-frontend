"use client";

import { useEffect, useRef } from "react";
import { PortfolioPreview } from "@/components/portfolio/portfolio-preview";
import { PortfolioDemoProvider } from "@/contexts/portfolio-demo-context";
import { mapPublicPortfolio } from "@/lib/api/mappers";
import {
  useGetSharedPortfolioQuery,
  useRecordPortfolioViewMutation,
} from "@/store/api/portfolioApi";

interface SharedPortfolioViewProps {
  token: string;
}

export function SharedPortfolioView({ token }: SharedPortfolioViewProps) {
  const { data, isLoading, isError } = useGetSharedPortfolioQuery(token);
  const [recordView] = useRecordPortfolioViewMutation();
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!data?.username || trackedRef.current) return;
    trackedRef.current = true;
    recordView({
      username: data.username,
      referrer: typeof document !== "undefined" ? document.referrer : "",
    });
  }, [data, recordView]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] animate-pulse bg-muted/20">
        <div className="mx-auto max-w-4xl space-y-8 px-4 py-16">
          <div className="h-48 rounded-2xl bg-muted/40" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4 text-center text-muted-foreground">
        This share link is invalid or has expired.
      </div>
    );
  }

  const portfolio = mapPublicPortfolio(data);

  return (
    <PortfolioDemoProvider value={portfolio}>
      <div className="border-b bg-muted/30 px-4 py-2 text-center text-xs text-muted-foreground">
        Private preview link — feedback may be enabled below.
      </div>
      <PortfolioPreview templateSlug={portfolio.templateSlug} />
    </PortfolioDemoProvider>
  );
}
