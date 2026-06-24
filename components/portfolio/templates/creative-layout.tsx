"use client";

import { MapPin, Palette } from "lucide-react";
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

export function CreativeLayout({
  profile,
  isLoaded,
  embedded,
  className,
}: PortfolioTemplateLayoutProps) {
  return (
    <div
      data-template="creative"
      className={cn(
        "bg-background",
        templateRootStyles.creative,
        embedded ? "min-h-0" : undefined,
        className
      )}
    >
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-fuchsia-500/15 to-sky-500/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,oklch(0.55_0.25_300/32%),transparent_45%),radial-gradient(circle_at_80%_10%,oklch(0.6_0.2_250/26%),transparent_40%),radial-gradient(circle_at_50%_100%,oklch(0.55_0.22_278/18%),transparent_50%)]" />
        <div className="animate-template-float absolute -right-24 top-8 h-72 w-72 rounded-full bg-gradient-to-bl from-fuchsia-500/35 to-violet-500/25 blur-3xl" />
        <div className="animate-template-float absolute -left-20 bottom-4 h-56 w-56 rounded-full bg-gradient-to-tr from-sky-500/30 to-primary/20 blur-3xl animation-delay-300" />
        <div className="animate-template-glow absolute right-0 top-0 h-full w-1/3 skew-x-[-12deg] bg-gradient-to-b from-primary/20 via-fuchsia-500/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_auto] lg:items-end">
            <div>
              <div
                className={cn(
                  "animate-scale-in inline-flex items-center gap-2 rounded-full border border-white/20 bg-background/55 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-primary opacity-0 backdrop-blur-md",
                  animationDelays[100]
                )}
              >
                <Palette className="h-3.5 w-3.5" />
                Creative
              </div>
              <h1
                className={cn(
                  "animate-fade-in-up mt-6 text-4xl font-black leading-[1.05] tracking-tight opacity-0 sm:text-5xl lg:text-6xl",
                  animationDelays[150]
                )}
              >
                <span className="text-gradient template-shimmer-text">
                  {profile.fullName || "Your Name"}
                </span>
              </h1>
              <p
                className={cn(
                  "animate-fade-in-up mt-4 text-2xl font-semibold text-foreground/90 opacity-0 sm:text-3xl",
                  animationDelays[250]
                )}
              >
                {profile.title || "Your professional title"}
              </p>
              {profile.location ? (
                <p
                  className={cn(
                    "animate-fade-in-up mt-4 flex items-center gap-2 text-muted-foreground opacity-0",
                    animationDelays[300]
                  )}
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 transition-transform duration-300 hover:scale-110">
                    <MapPin className="h-4 w-4 text-primary" />
                  </span>
                  {profile.location}
                </p>
              ) : null}
              <PortfolioAbout
                about={profile.about}
                wrapperClassName={cn(
                  "animate-fade-in-up mt-7 max-w-2xl opacity-0",
                  animationDelays[400]
                )}
                className="text-lg leading-relaxed text-muted-foreground"
              />
              <ContactLinks
                profile={profile}
                variant="creative"
                className={cn(
                  "animate-fade-in-up mt-8 opacity-0",
                  animationDelays[500]
                )}
              />
            </div>

            <div
              className={cn(
                "animate-scale-in relative mx-auto opacity-0 lg:mx-0",
                animationDelays[200]
              )}
            >
              <div className="animate-template-glow absolute -inset-4 rounded-full bg-gradient-to-br from-primary via-fuchsia-500 to-sky-500 opacity-60 blur-lg" />
              <ProfileAvatar
                src={profile.avatarUrl}
                alt={profile.fullName || "Profile"}
                size="md"
                className={cn(
                  "relative border-4 border-background shadow-2xl",
                  motion.transitionTransform,
                  "hover:scale-105 hover:rotate-3"
                )}
                priority
                isLoading={!isLoaded}
              />
            </div>
          </div>
        </div>
      </section>

      <PortfolioBody
        template="creative"
        className="mx-auto max-w-6xl space-y-16 px-4 py-16 sm:px-6"
      />
      <PortfolioFooter template="creative" />
    </div>
  );
}
