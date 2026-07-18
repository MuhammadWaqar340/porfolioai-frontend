"use client";

import { useSearchParams } from "next/navigation";
import { SiteBackdrop } from "@/components/brand/site-backdrop";
import { PortfolioProjectDetail } from "@/components/portfolio/portfolio-project-detail";
import { TemplateDemoToolbar } from "@/components/portfolio/template-demo-toolbar";
import { PortfolioDemoProvider } from "@/contexts/portfolio-demo-context";
import {
  getTemplateDemoPath,
  isTemplateSlug,
  resolveTemplateSlug,
} from "@/constants/templates";
import { buildTemplatePreviewPortfolio } from "@/lib/demo-portfolio-preview";
import { mapPublicPortfolio } from "@/lib/api/mappers";
import { useGetDemoPortfolioQuery } from "@/store/api/portfolioApi";

interface DemoProjectDetailViewProps {
  projectId: string;
  templateSlug?: string;
}

export function DemoProjectDetailView({
  projectId,
  templateSlug,
}: DemoProjectDetailViewProps) {
  const searchParams = useSearchParams();
  const templateFromQuery = searchParams.get("template");
  const resolvedTemplate = isTemplateSlug(templateFromQuery)
    ? templateFromQuery
    : resolveTemplateSlug(templateSlug ?? null);

  const { data, isLoading, isError } = useGetDemoPortfolioQuery();

  if (isLoading) {
    return (
      <div className="relative min-h-svh">
        <SiteBackdrop />
        <div className="relative z-10 min-h-[50vh] animate-pulse">
          <div className="mx-auto max-w-3xl space-y-6 px-4 py-12">
            <div className="h-8 w-40 rounded bg-muted/50" />
            <div className="aspect-video rounded-2xl bg-muted/50" />
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
          Demo project is unavailable right now.
        </p>
      </div>
    );
  }

  const mapped = mapPublicPortfolio(data);
  const demo = buildTemplatePreviewPortfolio({
    ...mapped,
    templateSlug: resolvedTemplate,
  });
  const project = demo.projects.find((item) => item.id === projectId);

  if (!project) {
    return (
      <div className="relative flex min-h-svh items-center justify-center px-4">
        <SiteBackdrop />
        <p className="relative z-10 rounded-xl border border-border/60 bg-card/75 px-6 py-4 text-center text-muted-foreground backdrop-blur-md">
          Project not found in demo portfolio.
        </p>
      </div>
    );
  }

  const templateName =
    data.template?.name ??
    resolvedTemplate.charAt(0).toUpperCase() + resolvedTemplate.slice(1);

  return (
    <div className="relative min-h-svh">
      <SiteBackdrop />
      <div className="relative z-10">
        <TemplateDemoToolbar
          templateSlug={resolvedTemplate}
          templateName={templateName}
          backHref={`${getTemplateDemoPath(resolvedTemplate)}#projects`}
          backLabel="Back to demo"
        />
        <PortfolioDemoProvider value={demo}>
          <PortfolioProjectDetail
            project={project}
            portfolioHref={`${getTemplateDemoPath(resolvedTemplate)}#projects`}
            backLabel="Back to projects"
          />
        </PortfolioDemoProvider>
      </div>
    </div>
  );
}
