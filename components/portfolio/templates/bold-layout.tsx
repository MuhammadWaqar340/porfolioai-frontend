"use client";

import { MapPin, Zap } from "lucide-react";
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

export function BoldLayout({
  profile,
  isLoaded,
  embedded,
  className,
}: PortfolioTemplateLayoutProps) {
  return (
    <div
      data-template="bold"
      className={cn(
        "bg-background",
        templateRootStyles.bold,
        embedded ? "min-h-0" : undefined,
        className
      )}
    >
      <section className="relative overflow-hidden border-b-4 border-foreground">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_80px,oklch(0_0_0/3%)_80px,oklch(0_0_0/3%)_81px)] dark:bg-[repeating-linear-gradient(90deg,transparent,transparent_80px,oklch(1_0_0/4%)_80px,oklch(1_0_0/4%)_81px)]" />
        <div className="grid min-h-[28rem] lg:grid-cols-2">
          <div className="relative flex flex-col justify-center bg-gradient-to-br from-foreground via-foreground to-foreground/90 px-6 py-16 text-background sm:px-10 lg:px-14">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10" />
            <div
              className={cn(
                "animate-template-slide-in relative z-[1] inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.35em] opacity-0",
                animationDelays[100]
              )}
            >
              <Zap className="h-4 w-4" />
              Bold
            </div>
            <h1
              className={cn(
                "animate-template-zoom-in relative z-[1] mt-6 text-5xl font-black uppercase leading-[0.9] tracking-tighter opacity-0 sm:text-6xl lg:text-7xl",
                animationDelays[150]
              )}
            >
              {profile.fullName || "Your Name"}
            </h1>
            <p
              className={cn(
                "animate-fade-in-up mt-6 text-xl font-bold uppercase tracking-wide opacity-0 sm:text-2xl",
                animationDelays[250]
              )}
            >
              {profile.title || "Your professional title"}
            </p>
            {profile.location ? (
              <p
                className={cn(
                  "animate-fade-in-up mt-4 flex items-center gap-2 text-sm font-medium opacity-80 opacity-0",
                  animationDelays[300]
                )}
              >
                <MapPin className="h-4 w-4" />
                {profile.location}
              </p>
            ) : null}
            <ContactLinks
              profile={profile}
              variant="bold"
              className={cn(
                "animate-fade-in-up mt-8 opacity-0",
                animationDelays[400]
              )}
            />
          </div>

          <div className="relative flex flex-col justify-center border-t-4 border-foreground bg-gradient-to-bl from-muted/30 via-background to-background px-6 py-16 sm:px-10 lg:border-l-4 lg:border-t-0 lg:px-14">
            <div
              className={cn(
                "animate-scale-in mx-auto opacity-0 lg:mx-0",
                animationDelays[200]
              )}
            >
              <ProfileAvatar
                src={profile.avatarUrl}
                alt={profile.fullName || "Profile"}
                size="md"
                className={cn(
                  "rounded-none border-4 border-foreground shadow-[8px_8px_0_0_var(--foreground)]",
                  motion.transitionTransform,
                  "hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[10px_10px_0_0_var(--foreground)]"
                )}
                priority
                isLoading={!isLoaded}
              />
            </div>
            <PortfolioAbout
              about={profile.about}
              wrapperClassName={cn(
                "animate-template-rise mt-10 max-w-md opacity-0",
                animationDelays[350]
              )}
              className="text-lg font-medium leading-relaxed text-muted-foreground"
            />
          </div>
        </div>
      </section>

      <TemplateNav template="bold" />
      <PortfolioBody
        template="bold"
        className="mx-auto max-w-5xl space-y-16 px-4 py-14 sm:px-6"
      />
      <PortfolioFooter template="bold" />
    </div>
  );
}
