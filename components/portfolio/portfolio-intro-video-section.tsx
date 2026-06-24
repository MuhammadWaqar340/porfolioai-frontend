"use client";

import { PortfolioIntroVideo } from "@/components/portfolio/portfolio-intro-video";
import { useOptionalDemoPortfolio } from "@/contexts/portfolio-demo-context";
import { useProfile } from "@/hooks/use-profile";
import { shouldShowIntroVideo } from "@/lib/intro-video";

export function PortfolioIntroVideoSection() {
  const demo = useOptionalDemoPortfolio();
  const { profile: authProfile, isLoaded } = useProfile();
  const profile = demo?.profile ?? authProfile;

  if (!demo && !isLoaded) return null;
  if (!shouldShowIntroVideo(profile)) return null;

  return (
    <section data-portfolio-section="intro-video">
      <PortfolioIntroVideo profile={profile} title="Video Introduction" />
    </section>
  );
}
