"use client";

import {
  FileText,
  Globe,
  LayoutTemplate,
  Moon,
  PenTool,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/motion/fade-in";
import { Stagger } from "@/components/motion/stagger";
import { Tilt } from "@/components/motion/tilt";
import { PremiumCard } from "@/components/landing/premium-card";
import { SectionAurora } from "@/components/landing/section-aurora";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LANDING_FEATURES } from "@/constants/landing-features";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const iconMap: Record<string, LucideIcon> = {
  "pen-tool": PenTool,
  sparkles: Sparkles,
  "layout-template": LayoutTemplate,
  "file-text": FileText,
  globe: Globe,
  moon: Moon,
};

export function Features() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="features" className="relative py-20 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-muted/20 dark:bg-muted/10" aria-hidden />
      <SectionAurora align="left" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to shine
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features to help you create a portfolio that stands out from
            the crowd.
          </p>
        </FadeIn>
        <Stagger
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={90}
        >
          {LANDING_FEATURES.map((feature) => {
            const Icon = iconMap[feature.icon] ?? Sparkles;
            return (
              <Tilt key={feature.id} max={8} lift={14}>
                <PremiumCard>
                  <Card className="h-full border-border/60 bg-card/70 shadow-[var(--shadow-card)] backdrop-blur-md transition-colors duration-300 hover:border-primary/40 hover:shadow-[var(--shadow-card-hover)]">
                    <CardHeader>
                      <motion.div
                        className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-violet-500/10 ring-1 ring-primary/10"
                        style={{ transformStyle: "preserve-3d" }}
                        whileHover={
                          reducedMotion
                            ? undefined
                            : { scale: 1.12, rotate: 8, z: 24 }
                        }
                        transition={{ type: "spring", stiffness: 220, damping: 16 }}
                      >
                        <Icon className="h-6 w-6 text-primary drop-shadow-[0_0_10px_oklch(0.62_0.2_280/0.45)]" />
                      </motion.div>
                      <CardTitle className="text-lg transition-transform duration-300 group-hover/premium:-translate-y-0.5">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </PremiumCard>
              </Tilt>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
