import { Suspense } from "react";
import { PublicProjectDetailView } from "@/components/portfolio/public-project-detail-view";

type PageProps = {
  params: Promise<{ username: string; projectId: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { username, projectId } = await params;
  return {
    title: `Project | ${username}`,
    description: `Project details on ${username}'s portfolio.`,
  };
}

export default async function PublicProjectDetailPage({ params }: PageProps) {
  const { username, projectId } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] animate-pulse bg-muted/20" aria-busy="true" />
      }
    >
      <PublicProjectDetailView username={username} projectId={projectId} />
    </Suspense>
  );
}
