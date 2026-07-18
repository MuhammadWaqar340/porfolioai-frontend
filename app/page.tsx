import { AmbientLayers } from "@/components/landing/ambient-layers";
import { CTA } from "@/components/landing/cta";
import { Features } from "@/components/landing/features";
import { LandingFooter } from "@/components/landing/footer";
import { LandingHeader } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { PricingSection } from "@/components/landing/pricing-section";
import { TemplatesSection } from "@/components/landing/templates-section";
import { LandingBackdrop } from "@/components/landing/three/LandingBackdrop";

export default function HomePage() {
  return (
    <>
      <LandingBackdrop />
      <AmbientLayers />
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
