"use client";

import { useSearchParams } from "next/navigation";
import { getTemplateDemoPath } from "@/constants/templates";
import { useOptionalDemoPortfolio } from "@/contexts/portfolio-demo-context";
import {
  getDemoProjectPath,
  getPublicPortfolioProjectsHref,
  getPublicProjectPath,
} from "@/lib/project-url";
import { useGetPortfolioSettingsQuery } from "@/store/api/portfolioApi";
import { useIsAuthenticated } from "@/store/hooks";

export function usePortfolioProjectLinks() {
  const searchParams = useSearchParams();
  const demo = useOptionalDemoPortfolio();
  const isAuthenticated = useIsAuthenticated();
  const { data: settings } = useGetPortfolioSettingsQuery(undefined, {
    skip: Boolean(demo) || !isAuthenticated,
  });

  const variant = searchParams.get("variant") ?? undefined;
  const share = searchParams.get("share") ?? undefined;
  const query = { variant, share };
  const username = demo?.portfolioUsername ?? settings?.username ?? undefined;
  const isDemoPreview = demo?.displayOnly ?? false;

  function getProjectHref(projectId: string): string | null {
    if (isDemoPreview && demo) {
      return getDemoProjectPath(projectId, demo.templateSlug);
    }
    if (username) {
      return getPublicProjectPath(username, projectId, query);
    }
    return null;
  }

  function getPortfolioHref(): string {
    if (isDemoPreview && demo) {
      return `${getTemplateDemoPath(demo.templateSlug)}#projects`;
    }
    if (username) {
      return getPublicPortfolioProjectsHref(username, query);
    }
    return "/demo#projects";
  }

  return {
    getProjectHref,
    getPortfolioHref,
    hasProjectPages: Boolean(username || isDemoPreview),
  };
}
