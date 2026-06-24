"use client";

import { useSearchParams } from "next/navigation";
import { PortfolioProjectDetail } from "@/components/portfolio/portfolio-project-detail";
import { PortfolioDemoProvider } from "@/contexts/portfolio-demo-context";
import { mapPublicPortfolio } from "@/lib/api/mappers";
import { getPublicPortfolioProjectsHref } from "@/lib/project-url";
import { useGetPublicPortfolioQuery } from "@/store/api/portfolioApi";

interface PublicProjectDetailViewProps {
  username: string;
  projectId: string;
}

export function PublicProjectDetailView({
  username,
  projectId,
}: PublicProjectDetailViewProps) {
  const searchParams = useSearchParams();
  const variant = searchParams.get("variant") ?? undefined;
  const share = searchParams.get("share") ?? undefined;

  const { data, isLoading, isError } = useGetPublicPortfolioQuery({
    username,
    variant,
    share,
  });

  if (isLoading) {
    return (
      <div className="min-h-[50vh] animate-pulse bg-muted/20">
        <div className="mx-auto max-w-3xl space-y-6 px-4 py-12">
          <div className="h-8 w-40 rounded bg-muted/50" />
          <div className="aspect-video rounded-2xl bg-muted/50" />
          <div className="h-10 w-2/3 rounded bg-muted/50" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-muted/40" />
            <div className="h-4 w-full rounded bg-muted/40" />
            <div className="h-4 w-3/4 rounded bg-muted/40" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4 text-center text-muted-foreground">
        This project is unavailable right now.
      </div>
    );
  }

  const portfolio = mapPublicPortfolio(data, { username });
  const project = portfolio.projects.find((item) => item.id === projectId);

  if (!project) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4 text-center text-muted-foreground">
        Project not found.
      </div>
    );
  }

  const portfolioHref = getPublicPortfolioProjectsHref(username, { variant, share });

  return (
    <PortfolioDemoProvider value={portfolio}>
      <div className="min-h-screen bg-background">
        <PortfolioProjectDetail
          project={project}
          portfolioHref={portfolioHref}
        />
      </div>
    </PortfolioDemoProvider>
  );
}
