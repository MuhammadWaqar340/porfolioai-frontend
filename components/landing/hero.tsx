import { Suspense } from "react";
import {
  HeroPreviewCard,
  HeroPreviewFrame,
} from "@/components/landing/hero-preview-card";
import { HeroCardTilt } from "@/components/landing/hero-card-tilt";
import { HeroCopy, HeroFloatingOrbs } from "@/components/landing/hero-copy";

function HeroPreviewFallback() {
  return (
    <div className="space-y-6 p-6 animate-pulse">
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
      <HeroFloatingOrbs />

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <HeroCopy />

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
