"use client";

import { MapPin } from "lucide-react";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { PortfolioAbout } from "@/components/portfolio/portfolio-about";
import {
  ContactLinks,
  PortfolioBody,
  PortfolioFooter,
} from "@/components/portfolio/templates/shared";
import { templateRootStyles } from "@/components/portfolio/templates/template-motion";
import type { PortfolioTemplateLayoutProps } from "@/components/portfolio/templates/types";
import { animationDelays, motion } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function MinimalLayout({
  profile,
  isLoaded,
  embedded,
  className,
}: PortfolioTemplateLayoutProps) {
  return (
    <div
      data-template="minimal"
      className={cn(
        "bg-background",
        templateRootStyles.minimal,
        embedded ? "min-h-0" : undefined,
        className
      )}
    >
      <section className="relative border-b border-border/60">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-muted/40 via-background to-background" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.5_0.02_276/12%),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent" />

        <div className="relative mx-auto max-w-2xl px-4 py-24 sm:px-6 sm:py-32">
          <div className="flex flex-col items-center text-center">
            <div
              className={cn(
                "animate-fade-in h-px w-12 bg-foreground/30 opacity-0",
                animationDelays[100]
              )}
            />
            <ProfileAvatar
              src={profile.avatarUrl}
              alt={profile.fullName || "Profile"}
              size="md"
              className={cn(
                "animate-scale-in mt-10 border border-border/80 opacity-0 grayscale-[10%]",
                motion.transitionTransform,
                "hover:grayscale-0 hover:scale-[1.03]"
              )}
              priority
              isLoading={!isLoaded}
            />
            <h1
              className={cn(
                "animate-fade-in-up mt-10 text-4xl font-extralight tracking-tight opacity-0 sm:text-5xl",
                animationDelays[200]
              )}
            >
              {profile.fullName || "Your Name"}
            </h1>
            <p
              className={cn(
                "animate-fade-in-up mt-4 text-sm uppercase tracking-[0.35em] text-muted-foreground opacity-0",
                animationDelays[300]
              )}
            >
              {profile.title || "Your professional title"}
            </p>
            {profile.location ? (
              <p
                className={cn(
                  "animate-fade-in-up mt-5 flex items-center justify-center gap-1.5 text-xs tracking-wide text-muted-foreground opacity-0",
                  animationDelays[350]
                )}
              >
                <MapPin className="h-3.5 w-3.5" />
                {profile.location}
              </p>
            ) : null}
            <PortfolioAbout
              about={profile.about}
              wrapperClassName={cn(
                "animate-fade-in-up mt-10 max-w-lg opacity-0",
                animationDelays[400]
              )}
              className="text-sm leading-8 text-muted-foreground"
            />
            <ContactLinks
              profile={profile}
              variant="minimal"
              className={cn(
                "animate-fade-in-up mt-10 justify-center opacity-0",
                animationDelays[500]
              )}
            />
            <div
              className={cn(
                "animate-fade-in mt-14 h-px w-full max-w-xs bg-border/60 opacity-0",
                animationDelays[500]
              )}
            />
          </div>
        </div>
      </section>

      <PortfolioBody
        template="minimal"
        className="mx-auto max-w-2xl space-y-16 px-4 py-16 sm:px-6"
      />
      <PortfolioFooter template="minimal" />
    </div>
  );
}
