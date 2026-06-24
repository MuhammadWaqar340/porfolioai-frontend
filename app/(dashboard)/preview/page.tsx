import { PortfolioPreview } from "@/components/portfolio/portfolio-preview";
import { OpenPortfolioLinkButton } from "@/components/portfolio/open-portfolio-link-button";
import { PageHeader } from "@/components/layout/page-header";

export const metadata = {
  title: "Portfolio Preview",
};

export default function PreviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio Preview"
        description="See how your public portfolio will look to visitors."
      >
        <OpenPortfolioLinkButton />
      </PageHeader>

      <div className="overflow-hidden rounded-xl border shadow-lg">
        <PortfolioPreview embedded />
      </div>
    </div>
  );
}
