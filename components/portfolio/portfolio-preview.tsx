"use client";

import { useProfile } from "@/hooks/use-profile";
import { getTemplateLayout } from "@/components/portfolio/templates/template-registry";
import { resolveTemplateSlug } from "@/constants/templates";
import {
  useGetPortfolioSettingsQuery,
} from "@/store/api/portfolioApi";
import { useIsAuthenticated } from "@/store/hooks";

interface PortfolioPreviewProps {
  className?: string;
  embedded?: boolean;
  templateSlug?: string | null;
}

export function PortfolioPreview({
  className,
  embedded = false,
  templateSlug,
}: PortfolioPreviewProps) {
  const { profile, isLoaded } = useProfile();
  const isAuthenticated = useIsAuthenticated();
  const { data: settings } = useGetPortfolioSettingsQuery(undefined, {
    skip: !isAuthenticated || templateSlug !== undefined,
  });

  const slug = resolveTemplateSlug(
    templateSlug ?? settings?.template_slug ?? null
  );
  const Layout = getTemplateLayout(slug);

  return (
    <Layout
      profile={profile}
      isLoaded={isLoaded}
      embedded={embedded}
      className={className}
    />
  );
}
