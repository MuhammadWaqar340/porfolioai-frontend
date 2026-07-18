"use client";

import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { PortfolioAbout } from "@/components/portfolio/portfolio-about";
import { TextReveal } from "@/components/landing/text-reveal";
import { AuroraPortfolioBody } from "@/components/portfolio/templates/aurora/aurora-portfolio-body";
import {
  AuroraAvatarFrame,
  AuroraDivider,
} from "@/components/portfolio/templates/aurora/aurora-motion";
import { AuroraVeilBackdrop } from "@/components/portfolio/templates/aurora/aurora-veil-backdrop";
import {
  ContactLinks,
  PortfolioFooter,
  TemplateNav,
} from "@/components/portfolio/templates/shared";
import { templateRootStyles } from "@/components/portfolio/templates/template-motion";
import type { PortfolioTemplateLayoutProps } from "@/components/portfolio/templates/types";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { landingEase, landingSpring } from "@/lib/landing-motion";
import { motion as motionClasses } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function AuroraLayout({
  profile,
  isLoaded,
  embedded,
  className,
}: PortfolioTemplateLayoutProps) {
  const reducedMotion = useReducedMotion();
  const displayName = profile.fullName || "Your Name";

  return (
    <div
      data-template="aurora"
      className={cn(
        "relative bg-transparent",
        templateRootStyles.aurora,
        embedded ? "min-h-0" : undefined,
        className,
      )}
    >
      <AuroraVeilBackdrop embedded={embedded} />

      <section className="relative z-10 overflow-hidden border-b border-violet-500/15">
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-rose-400/60 via-violet-500/40 to-transparent" />

        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <motion.p
              className="text-[11px] font-semibold uppercase tracking-[0.4em] text-rose-600/90 dark:text-rose-400"
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...landingSpring, delay: 0.05 }}
            >
              Portfolio
            </motion.p>

            <TextReveal
              text={displayName}
              className="font-heading mt-5 text-5xl font-light leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
              stagger={0.032}
            />

            <AuroraDivider className="mt-8 w-20" />

            <motion.p
              className="mt-6 text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground sm:text-base"
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: landingEase, delay: 0.45 }}
            >
              {profile.title || "Your professional title"}
            </motion.p>

            {profile.location ? (
              <motion.p
                className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"
                initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: landingEase, delay: 0.55 }}
              >
                <MapPin className="h-4 w-4 text-rose-500" />
                {profile.location}
              </motion.p>
            ) : null}

            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: landingEase, delay: 0.62 }}
            >
              <PortfolioAbout
                about={profile.about}
                wrapperClassName="mt-8 max-w-xl"
                className="text-base leading-8 text-muted-foreground"
              />
            </motion.div>

            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: landingEase, delay: 0.72 }}
            >
              <ContactLinks
                profile={profile}
                variant="aurora"
                className="mt-10"
              />
            </motion.div>
          </div>

          <AuroraAvatarFrame className="mx-auto lg:mx-0">
            <div className="absolute -inset-3 border border-violet-500/20" />
            <div className="absolute -right-3 -top-3 h-8 w-8 border-r-2 border-t-2 border-rose-400/50" />
            <div className="absolute -bottom-3 -left-3 h-8 w-8 border-b-2 border-l-2 border-violet-500/40" />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-violet-500/10"
              aria-hidden
            />
            <ProfileAvatar
              src={profile.avatarUrl}
              alt={profile.fullName || "Profile"}
              size="md"
              className={cn(
                "relative rounded-none border border-violet-500/20 shadow-xl",
                motionClasses.transitionTransform,
              )}
              priority
              isLoading={!isLoaded}
            />
          </AuroraAvatarFrame>
        </div>
      </section>

      <div className="relative z-10">
        <TemplateNav template="aurora" />
        <AuroraPortfolioBody />
        <PortfolioFooter template="aurora" />
      </div>
    </div>
  );
}
