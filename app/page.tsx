import { CTA } from "@/components/landing/cta";
import { Features } from "@/components/landing/features";
import { LandingFooter } from "@/components/landing/footer";
import { LandingHeader } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { PricingSection } from "@/components/landing/pricing-section";
import { TemplatesSection } from "@/components/landing/templates-section";

export default function HomePage() {
  return (
    <>
      <LandingHeader />
      <Hero />
      <Features />
      <TemplatesSection />
      <PricingSection />
      <CTA />
      <LandingFooter />
    </>
  );
}
