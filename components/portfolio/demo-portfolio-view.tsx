"use client";

import { SiteBackdrop } from "@/components/brand/site-backdrop";
import { PortfolioPreview } from "@/components/portfolio/portfolio-preview";
import { TemplateDemoToolbar } from "@/components/portfolio/template-demo-toolbar";
import { PortfolioDemoProvider } from "@/contexts/portfolio-demo-context";
import type { TemplateSlug } from "@/constants/templates";
import { buildTemplatePreviewPortfolio } from "@/lib/demo-portfolio-preview";
import { mapPublicPortfolio } from "@/lib/api/mappers";
import { useGetDemoPortfolioQuery } from "@/store/api/portfolioApi";

interface DemoPortfolioViewProps {
  templateSlug?: TemplateSlug;
  templateName?: string;
  showToolbar?: boolean;
  backHref?: string;
  backLabel?: string;
}

export function DemoPortfolioView({
  templateSlug,
  templateName,
  showToolbar = Boolean(templateSlug),
  backHref,
  backLabel,
}: DemoPortfolioViewProps) {
  const { data, isLoading, isError } = useGetDemoPortfolioQuery();

  if (isLoading) {
    return (
      <div className="relative min-h-svh">
        <SiteBackdrop />
        <div className="relative z-10 min-h-[60vh] animate-pulse">
          <div className="mx-auto max-w-4xl space-y-8 px-4 py-16">
            <div className="h-48 rounded-2xl bg-muted/40 backdrop-blur-sm" />
            <div className="h-8 w-40 rounded bg-muted/40" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-40 rounded-xl bg-muted/40" />
              <div className="h-40 rounded-xl bg-muted/40" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="relative flex min-h-svh items-center justify-center px-4">
        <SiteBackdrop />
        <p className="relative z-10 rounded-xl border border-border/60 bg-card/75 px-6 py-4 text-center text-muted-foreground backdrop-blur-md">
          Demo portfolio is unavailable right now. Please try again later.
        </p>
      </div>
    );
  }

  const mapped = mapPublicPortfolio(data);
  const resolvedSlug = templateSlug ?? mapped.templateSlug;
  const resolvedName =
    templateName ??
    data.template?.name ??
    resolvedSlug.charAt(0).toUpperCase() + resolvedSlug.slice(1);

  const demo = buildTemplatePreviewPortfolio({
    ...mapped,
    templateSlug: resolvedSlug,
  });

  return (
    <div id="top" className="relative min-h-svh">
      <SiteBackdrop />
      <div className="relative z-10">
        {showToolbar ? (
          <TemplateDemoToolbar
            templateSlug={resolvedSlug}
            templateName={resolvedName}
            backHref={backHref}
            backLabel={backLabel}
          />
        ) : null}
        <PortfolioDemoProvider value={demo}>
          <PortfolioPreview
            templateSlug={resolvedSlug}
            className="!bg-transparent"
          />
        </PortfolioDemoProvider>
      </div>
    </div>
  );
}
