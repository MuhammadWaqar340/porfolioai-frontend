"use client";

import { Briefcase, MapPin } from "lucide-react";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { PortfolioAbout } from "@/components/portfolio/portfolio-about";
import {
  ContactLinks,
  PortfolioBody,
  PortfolioFooter,
  TemplateNav,
  hasUrl,
} from "@/components/portfolio/templates/shared";
import { templateRootStyles } from "@/components/portfolio/templates/template-motion";
import type { PortfolioTemplateLayoutProps } from "@/components/portfolio/templates/types";
import { animationDelays, motion } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function ProfessionalLayout({
  profile,
  isLoaded,
  embedded,
  className,
}: PortfolioTemplateLayoutProps) {
  const hasContact =
    hasUrl(profile.phone) ||
    hasUrl(profile.email) ||
    hasUrl(profile.linkedin) ||
    hasUrl(profile.github) ||
    hasUrl(profile.website);

  return (
    <div
      data-template="professional"
      className={cn(
        "bg-background",
        templateRootStyles.professional,
        embedded ? "min-h-0" : undefined,
        className
      )}
    >
      <div className="h-1.5 bg-gradient-to-r from-primary via-violet-500/80 to-primary/30" />

      <section className="relative overflow-hidden border-b bg-gradient-to-br from-muted/40 via-background to-primary/[0.04]">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,oklch(0.52_0.24_278/6%)_0%,transparent_45%,oklch(0.52_0.24_278/4%)_100%)]" />
        <div className="absolute -right-24 top-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-violet-500/8 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
            <aside className="space-y-6">
              <ProfileAvatar
                src={profile.avatarUrl}
                alt={profile.fullName || "Profile"}
                size="md"
                className={cn(
                  "animate-scale-in mx-auto border-2 border-border opacity-0 shadow-md lg:mx-0",
                  motion.transition,
                  "hover:shadow-lg hover:border-primary/30"
                )}
                priority
                isLoading={!isLoaded}
              />
              <div
                className={cn(
                  "animate-template-slide-in rounded-xl border border-primary/15 bg-gradient-to-br from-card/95 to-primary/[0.04] p-5 shadow-md backdrop-blur-sm",
                  motion.transition,
                  "hover:border-primary/25 hover:shadow-md",
                  animationDelays[200]
                )}
              >
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  Contact
                </p>
                {profile.location ? (
                  <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {profile.location}
                  </p>
                ) : null}
                {hasContact ? (
                  <ContactLinks
                    profile={profile}
                    variant="professional"
                    className="mt-4 flex-col items-stretch gap-2 [&_a]:w-full [&_a]:justify-center [&_a]:transition-all [&_a]:duration-300"
                  />
                ) : null}
              </div>
            </aside>

            <div className="animate-fade-in-up opacity-0 animation-delay-150">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                <Briefcase className="h-4 w-4 text-primary" />
                Professional Profile
              </div>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                {profile.fullName || "Your Name"}
              </h1>
              <p className="mt-2 text-xl font-medium text-foreground/85">
                {profile.title || "Your professional title"}
              </p>
              <div className="mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-primary to-primary/30 transition-all duration-500 hover:w-28" />
              <PortfolioAbout
                about={profile.about}
                wrapperClassName="mt-6 max-w-3xl"
                className="text-base leading-relaxed text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </section>

      <TemplateNav template="professional" />
      <PortfolioBody
        template="professional"
        className="mx-auto max-w-6xl space-y-14 px-4 py-12 sm:px-6"
      />
      <PortfolioFooter template="professional" />
    </div>
  );
}
