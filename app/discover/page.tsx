import { DiscoverGallery } from "@/components/discover/discover-gallery";
import { LandingFooter } from "@/components/landing/footer";
import { LandingHeader } from "@/components/landing/header";

export const metadata = {
  title: "Discover Portfolios",
  description: "Browse public portfolios built with PortfolioAI.",
};

export default function DiscoverPage() {
  return (
    <>
      <LandingHeader />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Discover portfolios
          </h1>
          <p className="mt-3 text-muted-foreground">
            Explore public portfolios from creators who opted in to the gallery. Get
            inspiration for your own site or find talented people to connect with.
          </p>
        </div>
        <DiscoverGallery />
      </main>
      <LandingFooter />
    </>
  );
}
