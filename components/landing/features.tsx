import {
  FileText,
  Globe,
  LayoutTemplate,
  Moon,
  PenTool,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { Stagger } from "@/components/motion/stagger";
import { Tilt } from "@/components/motion/tilt";
import { SectionAurora } from "@/components/landing/section-aurora";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LANDING_FEATURES } from "@/constants/landing-features";

const iconMap: Record<string, LucideIcon> = {
  "pen-tool": PenTool,
  sparkles: Sparkles,
  "layout-template": LayoutTemplate,
  "file-text": FileText,
  globe: Globe,
  moon: Moon,
};

export function Features() {
  return (
    <section id="features" className="relative py-20 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-muted/30 dark:bg-muted/10" aria-hidden />
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
              <Tilt key={feature.id}>
                <Card className="h-full transition-colors duration-300 hover:border-primary/40">
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-violet-500/10 ring-1 ring-primary/10 transition-transform duration-300 group-hover/card:scale-105">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Tilt>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
