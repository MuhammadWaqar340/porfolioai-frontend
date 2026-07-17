import { Suspense } from "react";
import {
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import {
  HeroPreviewCard,
  HeroPreviewFrame,
} from "@/components/landing/hero-preview-card";
import { HeroCardTilt } from "@/components/landing/hero-card-tilt";
import { MagneticButton } from "@/components/landing/magnetic-button";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { animationDelays, motion } from "@/lib/motion";
import { cn } from "@/lib/utils";

function HeroPreviewFallback() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="size-16 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-32 rounded bg-muted" />
          <div className="h-4 w-40 rounded bg-muted" />
        </div>
      </div>
      <div className="h-10 rounded bg-muted" />
      <div className="flex gap-2">
        <div className="h-6 w-14 rounded-full bg-muted" />
        <div className="h-6 w-16 rounded-full bg-muted" />
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--hero-glow),transparent)]"
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 app-mesh opacity-70" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <Badge
              variant="secondary"
              className={cn("gap-1.5 px-3 py-1", motion.fadeInUp)}
            >
              <Sparkles className="h-3 w-3" />
              AI-Powered Portfolio Builder
            </Badge>
            <h1
              className={cn(
                "text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl",
                motion.fadeInUp,
                animationDelays[100]
              )}
            >
              Build Your Portfolio{" "}
              <span className="text-gradient with-ai-glow">with AI</span>
            </h1>
            <p
              className={cn(
                "max-w-xl text-lg text-muted-foreground",
                motion.fadeInUp,
                animationDelays[200]
              )}
            >
              Create beautiful and professional portfolios manually or with AI
              assistance.
            </p>
            <div
              className={cn(
                "flex flex-col gap-3 sm:flex-row",
                motion.fadeInUp,
                animationDelays[300]
              )}
            >
              <MagneticButton>
                <Link
                  href="/signup"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "gap-2 shadow-[0_8px_30px_-8px_var(--primary)] transition-shadow hover:shadow-[0_10px_40px_-6px_var(--primary)]",
                  )}
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  href="/demo"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "backdrop-blur-sm",
                  )}
                >
                  View Demo
                </Link>
              </MagneticButton>
            </div>
            <div
              className={cn(
                "flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground",
                motion.fadeInUp,
                animationDelays[400]
              )}
            >
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Free to start
              </span>
              <span>No credit card required</span>
            </div>
          </div>

          <HeroCardTilt>
            <HeroPreviewFrame>
              <Suspense fallback={<HeroPreviewFallback />}>
                <HeroPreviewCard />
              </Suspense>
            </HeroPreviewFrame>
          </HeroCardTilt>
        </div>
      </div>
    </section>
  );
}
