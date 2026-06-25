import { AuroraLayout } from "@/components/portfolio/templates/aurora-layout";
import { BoldLayout } from "@/components/portfolio/templates/bold-layout";
import { CreativeLayout } from "@/components/portfolio/templates/creative-layout";
import { DeveloperLayout } from "@/components/portfolio/templates/developer-layout";
import { ElegantLayout } from "@/components/portfolio/templates/elegant-layout";
import { MinimalLayout } from "@/components/portfolio/templates/minimal-layout";
import { ModernLayout } from "@/components/portfolio/templates/modern-layout";
import { ProfessionalLayout } from "@/components/portfolio/templates/professional-layout";
import type { PortfolioTemplateLayoutProps } from "@/components/portfolio/templates/types";
import {
  DEFAULT_TEMPLATE_SLUG,
  type TemplateSlug,
} from "@/constants/templates";
import type { ComponentType } from "react";

export const templateLayouts: Record<
  TemplateSlug,
  ComponentType<PortfolioTemplateLayoutProps>
> = {
  modern: ModernLayout,
  minimal: MinimalLayout,
  professional: ProfessionalLayout,
  creative: CreativeLayout,
  elegant: ElegantLayout,
  developer: DeveloperLayout,
  bold: BoldLayout,
  aurora: AuroraLayout,
};

export function getTemplateLayout(
  slug: string | null | undefined
): ComponentType<PortfolioTemplateLayoutProps> {
  if (slug && slug in templateLayouts) {
    return templateLayouts[slug as TemplateSlug];
  }
  return templateLayouts[DEFAULT_TEMPLATE_SLUG];
}
