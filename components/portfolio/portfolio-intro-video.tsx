"use client";

import {
  parseIntroVideoEmbed,
  shouldShowIntroVideo,
} from "@/lib/intro-video";
import type { Profile } from "@/types";
import { cn } from "@/lib/utils";

interface PortfolioIntroVideoProps {
  profile: Profile;
  className?: string;
  title?: string;
}

export function PortfolioIntroVideo({
  profile,
  className,
  title = "Video introduction",
}: PortfolioIntroVideoProps) {
  if (!shouldShowIntroVideo(profile)) return null;

  const embed = parseIntroVideoEmbed(profile.introVideoUrl);
  if (!embed) return null;

  return (
    <div className={cn("space-y-6", className)}>
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="overflow-hidden rounded-xl border bg-muted/20 shadow-sm">
        <div className="aspect-video w-full">
          <iframe
            src={embed.embedUrl}
            title={`${profile.fullName || "Portfolio owner"} video introduction`}
            className="h-full w-full border-0"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

interface IntroVideoPreviewProps {
  url: string;
  className?: string;
}

export function IntroVideoPreview({ url, className }: IntroVideoPreviewProps) {
  const embed = parseIntroVideoEmbed(url);
  if (!embed) return null;

  return (
    <div className={cn("overflow-hidden rounded-lg border bg-muted/20", className)}>
      <div className="aspect-video w-full">
        <iframe
          src={embed.embedUrl}
          title="Intro video preview"
          className="h-full w-full border-0"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
