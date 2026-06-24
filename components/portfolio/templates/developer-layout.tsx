"use client";

import { MapPin, Terminal } from "lucide-react";
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

export function DeveloperLayout({
  profile,
  isLoaded,
  embedded,
  className,
}: PortfolioTemplateLayoutProps) {
  const displayName = profile.fullName || "Your Name";

  return (
    <div
      data-template="developer"
      className={cn(
        "bg-background",
        templateRootStyles.developer,
        embedded ? "min-h-0" : undefined,
        className
      )}
    >
      <section className="relative overflow-hidden border-b border-emerald-500/25 bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950/40 text-zinc-50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.65_0.18_155/10%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.65_0.18_155/10%)_1px,transparent_1px)] bg-[size:2rem_2rem]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/[0.08] via-transparent to-transparent" />
        <div className="animate-template-float absolute right-0 top-0 h-80 w-80 rounded-full bg-gradient-to-bl from-emerald-500/25 to-emerald-400/10 blur-3xl" />
        <div className="animate-template-glow absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-emerald-400/12 blur-3xl animation-delay-200" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <div
            className={cn(
              "animate-template-slide-in mb-8 inline-flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-emerald-300 opacity-0",
              animationDelays[100]
            )}
          >
            <Terminal className="h-3.5 w-3.5" />
            developer.template
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start">
            <div>
              <p
                className={cn(
                  "animate-fade-in-up font-mono text-xs text-emerald-400/80 opacity-0",
                  animationDelays[150]
                )}
              >
                {"// portfolio.init()"}
              </p>
              <h1
                className={cn(
                  "animate-template-zoom-in mt-2 font-mono text-3xl font-bold tracking-tight text-zinc-50 opacity-0 sm:text-4xl lg:text-5xl",
                  animationDelays[200]
                )}
              >
                <span className="text-emerald-400">const</span>{" "}
                <span className="text-zinc-100">{displayName.replace(/\s+/g, "_")}</span>
                <span className="text-emerald-400"> = </span>
                <span className="text-amber-300">&quot;{profile.title || "developer"}&quot;</span>
                <span className="text-emerald-400">;</span>
              </h1>
              {profile.location ? (
                <p
                  className={cn(
                    "animate-fade-in-up mt-4 flex items-center gap-2 font-mono text-sm text-zinc-400 opacity-0",
                    animationDelays[250]
                  )}
                >
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  {profile.location}
                </p>
              ) : null}
              <div
                className={cn(
                  "animate-template-rise mt-8 rounded-lg border border-emerald-500/25 bg-zinc-900/80 p-5 font-mono text-sm leading-relaxed text-zinc-300 opacity-0 shadow-[0_0_40px_-12px_oklch(0.65_0.18_155/40%)]",
                  animationDelays[300]
                )}
              >
                <span className="text-emerald-400">/**</span>
                <PortfolioAbout
                  about={profile.about}
                  wrapperClassName="mt-1"
                  className="font-mono text-sm leading-relaxed text-zinc-300"
                />
                <span className="text-emerald-400"> */</span>
              </div>
              <ContactLinks
                profile={profile}
                variant="developer"
                className={cn(
                  "animate-fade-in-up mt-8 opacity-0",
                  animationDelays[400]
                )}
              />
            </div>

            <div
              className={cn(
                "animate-scale-in relative mx-auto opacity-0 lg:mx-0",
                animationDelays[350]
              )}
            >
              <div className="absolute -inset-2 rounded-xl bg-emerald-500/20 blur-md" />
              <ProfileAvatar
                src={profile.avatarUrl}
                alt={displayName}
                size="md"
                className={cn(
                  "relative rounded-xl border-2 border-emerald-500/40 shadow-xl ring-2 ring-emerald-500/20",
                  motion.transitionTransform,
                  "hover:scale-105"
                )}
                priority
                isLoading={!isLoaded}
              />
            </div>
          </div>
        </div>
      </section>

      <TemplateNav template="developer" />
      <PortfolioBody
        template="developer"
        className="mx-auto max-w-5xl space-y-16 px-4 py-14 sm:px-6"
      />
      <PortfolioFooter template="developer" />
    </div>
  );
}
