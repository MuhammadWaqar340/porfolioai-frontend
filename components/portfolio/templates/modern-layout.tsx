"use client";

import { MapPin, Sparkles } from "lucide-react";
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

export function ModernLayout({
  profile,
  isLoaded,
  embedded,
  className,
}: PortfolioTemplateLayoutProps) {
  return (
    <div
      data-template="modern"
      className={cn(
        "bg-background",
        templateRootStyles.modern,
        embedded ? "min-h-0" : undefined,
        className
      )}
    >
      <section className="relative overflow-hidden border-b border-primary/10">
        <div className="absolute inset-0 app-mesh opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.08] via-transparent to-violet-500/[0.06]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.5_0.2_280/7%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.5_0.2_280/7%)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
        <div className="animate-template-float absolute -right-20 top-0 h-80 w-80 rounded-full bg-gradient-to-br from-primary/25 to-violet-500/20 blur-3xl" />
        <div className="animate-template-float absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-gradient-to-tr from-violet-500/20 to-sky-500/15 blur-3xl animation-delay-300" />
        <div className="animate-template-glow absolute left-1/2 top-1/4 h-48 w-48 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/15 via-fuchsia-500/10 to-violet-500/15 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <div
            className={cn(
              "animate-fade-in-up rounded-2xl border border-primary/15 bg-gradient-to-br from-card/85 via-card/75 to-primary/[0.06] p-6 shadow-[var(--shadow-card)] backdrop-blur-xl sm:p-8",
              motion.transition,
              "hover:border-primary/25 hover:shadow-[var(--shadow-card-hover)]"
            )}
          >
            <div
              className={cn(
                "mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary",
                "animate-scale-in opacity-0",
                animationDelays[100]
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Portfolio
            </div>
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:gap-8 sm:text-left">
              <ProfileAvatar
                src={profile.avatarUrl}
                alt={profile.fullName || "Profile"}
                size="md"
                className={cn(
                  "border-4 border-background shadow-xl ring-2 ring-primary/20",
                  motion.transitionTransform,
                  "hover:scale-105 hover:ring-primary/40"
                )}
                priority
                isLoading={!isLoaded}
              />
              <div className="mt-6 flex-1 sm:mt-0">
                <h1
                  className={cn(
                    "animate-fade-in-up text-3xl font-bold tracking-tight opacity-0 sm:text-4xl",
                    animationDelays[150]
                  )}
                >
                  {profile.fullName || "Your Name"}
                </h1>
                <p
                  className={cn(
                    "animate-fade-in-up mt-2 text-xl font-semibold text-gradient opacity-0",
                    animationDelays[200]
                  )}
                >
                  {profile.title || "Your professional title"}
                </p>
                {profile.location ? (
                  <p
                    className={cn(
                      "animate-fade-in-up mt-2 flex items-center justify-center gap-1.5 text-sm text-muted-foreground opacity-0 sm:justify-start",
                      animationDelays[250]
                    )}
                  >
                    <MapPin className="h-4 w-4 text-primary" />
                    {profile.location}
                  </p>
                ) : null}
                <PortfolioAbout
                  about={profile.about}
                  wrapperClassName={cn(
                    "animate-fade-in-up mt-5 max-w-2xl opacity-0",
                    animationDelays[300]
                  )}
                  className="text-base leading-relaxed text-muted-foreground"
                />
                <ContactLinks
                  profile={profile}
                  className={cn(
                    "animate-fade-in-up mt-6 justify-center opacity-0 sm:justify-start",
                    animationDelays[400]
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <TemplateNav template="modern" />
      <PortfolioBody
        template="modern"
        className="mx-auto max-w-4xl space-y-16 px-4 py-14 sm:px-6"
      />
      <PortfolioFooter template="modern" />
    </div>
  );
}
