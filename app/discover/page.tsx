import { DiscoverBackdrop } from "@/components/discover/discover-backdrop";
import { DiscoverTabs } from "@/components/discover/discover-tabs";
import { LandingFooter } from "@/components/landing/footer";
import { LandingHeader } from "@/components/landing/header";

export const metadata = {
  title: "Discover",
  description:
    "Browse public portfolios and organizations built with PortfolioAI.",
};

export default function DiscoverPage() {
  return (
    <div className="relative min-h-svh">
      <DiscoverBackdrop />
      <LandingHeader />
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Gallery
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Discover talent & teams
          </h1>
          <p className="mt-3 text-muted-foreground">
            Explore public portfolios and organizations. Open a team page to meet
            members and visit their portfolios.
          </p>
        </div>
        <DiscoverTabs />
      </main>
      <div className="relative z-10">
        <LandingFooter />
      </div>
    </div>
  );
}
