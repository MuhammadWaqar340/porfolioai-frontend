import { Suspense } from "react";
import { DemoProjectDetailView } from "@/components/portfolio/demo-project-detail-view";
import { isTemplateSlug } from "@/constants/templates";

type PageProps = {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ template?: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { projectId } = await params;
  return {
    title: "Demo project",
    description: `View demo project ${projectId} in PortfolioAI.`,
  };
}

export default async function DemoProjectDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { projectId } = await params;
  const { template } = await searchParams;
  const templateSlug = isTemplateSlug(template) ? template : undefined;

  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] animate-pulse bg-muted/20" aria-busy="true" />
      }
    >
      <DemoProjectDetailView projectId={projectId} templateSlug={templateSlug} />
    </Suspense>
  );
}
