"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { PortfolioPreview } from "@/components/portfolio/portfolio-preview";
import { PortfolioDemoProvider } from "@/contexts/portfolio-demo-context";
import { mapPublicPortfolio } from "@/lib/api/mappers";
import {
  useGetPublicPortfolioQuery,
  useRecordPortfolioViewMutation,
} from "@/store/api/portfolioApi";

interface PublicPortfolioViewProps {
  username: string;
}

export function PublicPortfolioView({ username }: PublicPortfolioViewProps) {
  const searchParams = useSearchParams();
  const variant = searchParams.get("variant") ?? undefined;
  const share = searchParams.get("share") ?? undefined;

  const { data, isLoading, isError } = useGetPublicPortfolioQuery({
    username,
    variant,
    share,
  });
  const [recordView] = useRecordPortfolioViewMutation();
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!data || trackedRef.current) return;
    trackedRef.current = true;
    recordView({
      username,
      referrer: typeof document !== "undefined" ? document.referrer : "",
    });
  }, [data, username, recordView]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] animate-pulse bg-muted/20">
        <div className="mx-auto max-w-4xl space-y-8 px-4 py-16">
          <div className="h-48 rounded-2xl bg-muted/40" />
          <div className="h-8 w-40 rounded bg-muted/40" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-40 rounded-xl bg-muted/40" />
            <div className="h-40 rounded-xl bg-muted/40" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4 text-center text-muted-foreground">
        This portfolio is unavailable right now.
      </div>
    );
  }

  const portfolio = mapPublicPortfolio(data, { username });

  return (
    <PortfolioDemoProvider value={portfolio}>
      <PortfolioPreview templateSlug={portfolio.templateSlug} />
    </PortfolioDemoProvider>
  );
}
