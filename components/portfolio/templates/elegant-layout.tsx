"use client";

import { Gem, MapPin } from "lucide-react";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { PortfolioAbout } from "@/components/portfolio/portfolio-about";
import {
  ContactLinks,
  PortfolioBody,
  PortfolioFooter,
  TemplateNav,
} from "@/components/portfolio/templates/shared";
import { templateRootStyles } from "@/components/portfolio/templates/template-motion";
import type { PortfolioTemplateLayoutProps } from "@/components/portfolio/templates/types";
import { animationDelays, motion } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function ElegantLayout({
  profile,
  isLoaded,
  embedded,
  className,
}: PortfolioTemplateLayoutProps) {
  return (
    <div
      data-template="elegant"
      className={cn(
        "bg-background",
        templateRootStyles.elegant,
        embedded ? "min-h-0" : undefined,
        className
      )}
    >
      <section className="relative overflow-hidden border-b border-amber-500/15">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.1] via-orange-400/[0.04] to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,oklch(0.75_0.15_75/14%),transparent)]" />
        <div className="animate-template-float absolute -right-32 top-0 h-96 w-96 rounded-full bg-gradient-to-bl from-amber-400/20 to-orange-300/10 blur-3xl" />
        <div className="animate-template-float absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-amber-300/12 blur-3xl animation-delay-300" />
        <div className="animate-template-glow absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />

        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[auto_1fr] lg:items-center">
            <div
              className={cn(
                "animate-template-blur-in relative mx-auto opacity-0 lg:mx-0",
                animationDelays[100]
              )}
            >
              <div className="absolute -inset-3 rounded-full border border-amber-500/20" />
              <ProfileAvatar
                src={profile.avatarUrl}
                alt={profile.fullName || "Profile"}
                size="md"
                className={cn(
                  "relative border-2 border-amber-500/30 shadow-2xl",
                  motion.transitionTransform,
                  "hover:scale-[1.03]"
                )}
                priority
                isLoading={!isLoaded}
              />
            </div>

            <div>
              <div
                className={cn(
                  "animate-template-rise inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-amber-700 opacity-0 dark:text-amber-300",
                  animationDelays[150]
                )}
              >
                <Gem className="h-3.5 w-3.5" />
                Elegant
              </div>
              <h1
                className={cn(
                  "animate-template-blur-in mt-5 font-heading text-4xl font-light tracking-tight opacity-0 sm:text-5xl lg:text-6xl",
                  animationDelays[200]
                )}
              >
                {profile.fullName || "Your Name"}
              </h1>
              <p
                className={cn(
                  "animate-fade-in-up mt-4 text-xl font-light italic text-amber-800/80 opacity-0 dark:text-amber-200/80 sm:text-2xl",
                  animationDelays[250]
                )}
              >
                {profile.title || "Your professional title"}
              </p>
              {profile.location ? (
                <p
                  className={cn(
                    "animate-fade-in-up mt-4 flex items-center gap-2 text-sm text-muted-foreground opacity-0",
                    animationDelays[300]
                  )}
                >
                  <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  {profile.location}
                </p>
              ) : null}
              <PortfolioAbout
                about={profile.about}
                wrapperClassName={cn(
                  "animate-fade-in-up mt-6 max-w-xl opacity-0",
                  animationDelays[350]
                )}
                className="text-base leading-relaxed text-muted-foreground"
              />
              <ContactLinks
                profile={profile}
                variant="elegant"
                className={cn(
                  "animate-fade-in-up mt-8 opacity-0",
                  animationDelays[400]
                )}
              />
            </div>
          </div>
        </div>
      </section>

      <TemplateNav template="elegant" />
      <PortfolioBody
        template="elegant"
        className="mx-auto max-w-5xl space-y-20 px-4 py-16 sm:px-6"
      />
      <PortfolioFooter template="elegant" />
    </div>
  );
}
