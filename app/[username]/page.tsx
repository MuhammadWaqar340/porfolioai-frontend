import { Suspense } from "react";
import { PublicPortfolioView } from "@/components/portfolio/public-portfolio-view";

type PageProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;

  return {
    title: `${username} | Portfolio`,
  };
}

export default async function PublicPortfolioPage({ params }: PageProps) {
  const { username } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] animate-pulse bg-muted/20" aria-busy="true" />
      }
    >
      <PublicPortfolioView username={username} />
    </Suspense>
  );
}
