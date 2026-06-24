import { SharedPortfolioView } from "@/components/portfolio/shared-portfolio-view";

type PageProps = {
  params: Promise<{ token: string }>;
};

export default async function SharedPortfolioPage({ params }: PageProps) {
  const { token } = await params;
  return <SharedPortfolioView token={token} />;
}
