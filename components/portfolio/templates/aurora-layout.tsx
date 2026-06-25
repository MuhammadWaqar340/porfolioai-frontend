"use client";

import { MapPin } from "lucide-react";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { PortfolioAbout } from "@/components/portfolio/portfolio-about";
import { AuroraPortfolioBody } from "@/components/portfolio/templates/aurora/aurora-portfolio-body";
import {
  ContactLinks,
  PortfolioFooter,
  TemplateNav,
} from "@/components/portfolio/templates/shared";
import { templateRootStyles } from "@/components/portfolio/templates/template-motion";
import type { PortfolioTemplateLayoutProps } from "@/components/portfolio/templates/types";
import { animationDelays, motion } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function AuroraLayout({
  profile,
  isLoaded,
  embedded,
  className,
}: PortfolioTemplateLayoutProps) {
  return (
    <div
      data-template="aurora"
      className={cn(
        "bg-[#faf9f7] dark:bg-background",
        templateRootStyles.aurora,
        embedded ? "min-h-0" : undefined,
        className,
      )}
    >
      <section className="relative overflow-hidden border-b border-violet-500/15">
        <div className="absolute inset-0 bg-[#faf9f7] dark:bg-background" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,oklch(0.35_0.12_320/4%)_0%,transparent_42%,oklch(0.65_0.1_55/5%)_100%)]" />
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-rose-400/60 via-violet-500/40 to-transparent" />

        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <p
              className={cn(
                "animate-fade-in-up text-[11px] font-semibold uppercase tracking-[0.4em] text-rose-600/90 opacity-0 dark:text-rose-400",
                animationDelays[100],
              )}
            >
              Portfolio
            </p>
            <h1
              className={cn(
                "animate-fade-in-up font-heading mt-5 text-5xl font-light leading-[1.05] tracking-tight text-foreground opacity-0 sm:text-6xl lg:text-7xl",
                animationDelays[150],
              )}
            >
              {profile.fullName || "Your Name"}
            </h1>
            <div
              className={cn(
                "animate-fade-in mt-8 h-px w-20 bg-gradient-to-r from-violet-600/70 to-transparent opacity-0",
                animationDelays[200],
              )}
            />
            <p
              className={cn(
                "animate-fade-in-up mt-6 text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground opacity-0 sm:text-base",
                animationDelays[250],
              )}
            >
              {profile.title || "Your professional title"}
            </p>
            {profile.location ? (
              <p
                className={cn(
                  "animate-fade-in-up mt-5 flex items-center gap-2 text-sm text-muted-foreground opacity-0",
                  animationDelays[300],
                )}
              >
                <MapPin className="h-4 w-4 text-rose-500" />
                {profile.location}
              </p>
            ) : null}
            <PortfolioAbout
              about={profile.about}
              wrapperClassName={cn(
                "animate-fade-in-up mt-8 max-w-xl opacity-0",
                animationDelays[350],
              )}
              className="text-base leading-8 text-muted-foreground"
            />
            <ContactLinks
              profile={profile}
              variant="aurora"
              className={cn(
                "animate-fade-in-up mt-10 opacity-0",
                animationDelays[400],
              )}
            />
          </div>

          <div
            className={cn(
              "animate-scale-in relative mx-auto opacity-0 lg:mx-0",
              animationDelays[200],
            )}
          >
            <div className="absolute -inset-3 border border-violet-500/20" />
            <div className="absolute -right-3 -top-3 h-8 w-8 border-r-2 border-t-2 border-rose-400/50" />
            <div className="absolute -bottom-3 -left-3 h-8 w-8 border-b-2 border-l-2 border-violet-500/40" />
            <ProfileAvatar
              src={profile.avatarUrl}
              alt={profile.fullName || "Profile"}
              size="md"
              className={cn(
                "relative rounded-none border border-violet-500/20 shadow-xl",
                motion.transitionTransform,
                "hover:scale-[1.02]",
              )}
              priority
              isLoading={!isLoaded}
            />
          </div>
        </div>
      </section>

      <TemplateNav template="aurora" />
      <AuroraPortfolioBody />
      <PortfolioFooter template="aurora" />
    </div>
  );
}
