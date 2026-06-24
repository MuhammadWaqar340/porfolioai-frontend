import { notFound } from "next/navigation";
import { DemoPortfolioView } from "@/components/portfolio/demo-portfolio-view";
import {
  isTemplateSlug,
  TEMPLATE_SLUGS,
  type TemplateSlug,
} from "@/constants/templates";

type PageProps = {
  params: Promise<{ template: string }>;
  searchParams: Promise<{ from?: string }>;
};

export function generateStaticParams() {
  return TEMPLATE_SLUGS.map((template) => ({ template }));
}

export async function generateMetadata({ params }: PageProps) {
  const { template } = await params;
  if (!isTemplateSlug(template)) {
    return { title: "Template demo" };
  }

  const label = template.charAt(0).toUpperCase() + template.slice(1);
  return {
    title: `${label} template demo`,
    description: `Preview the ${label} portfolio template with sample content.`,
  };
}

export default async function TemplateDemoPage({ params, searchParams }: PageProps) {
  const { template } = await params;
  const { from } = await searchParams;

  if (!isTemplateSlug(template)) {
    notFound();
  }

  const backHref = from === "templates" ? "/templates" : "/#templates";
  const backLabel = from === "templates" ? "Templates" : "All templates";

  return (
    <DemoPortfolioView
      templateSlug={template as TemplateSlug}
      backHref={backHref}
      backLabel={backLabel}
    />
  );
}
