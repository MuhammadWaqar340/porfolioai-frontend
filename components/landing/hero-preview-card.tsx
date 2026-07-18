import type { ReactNode } from "react";
import {
  Briefcase,
  Code2,
  ExternalLink,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchDemoPortfolio } from "@/lib/api/fetch-demo-portfolio";
import { mapPublicPortfolio } from "@/lib/api/mappers";
import { animationDelays, motion } from "@/lib/motion";
import { cn } from "@/lib/utils";

function HeroPreviewSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start gap-4">
        <div className="size-16 shrink-0 animate-pulse rounded-full bg-muted" />
        <div className="space-y-2">
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />
          <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="h-12 animate-pulse rounded bg-muted" />
    </div>
  );
}

export async function HeroPreviewCard() {
  const data = await fetchDemoPortfolio();
  if (!data) {
    return <HeroPreviewSkeleton />;
  }

  const demo = mapPublicPortfolio(data);
  const { profile } = demo;
  const skillNames = demo.skills.flatMap((category) =>
    category.skills.map((skill) => skill.name)
  );
  const previewSkills = skillNames.slice(0, 4);
  const projectCount = demo.projects.length;
  const skillCount = skillNames.length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start gap-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/25">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={profile.fullName || "Demo profile"}
              fill
              className="object-cover"
              sizes="64px"
              priority
            />
          ) : (
            <div className="size-full bg-gradient-to-br from-primary to-violet-500" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold">{profile.fullName}</h3>
          <p className="text-sm text-primary">{profile.title}</p>
          {profile.location ? (
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {profile.location}
            </p>
          ) : null}
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
        {profile.about}
      </p>
      <div className="flex flex-wrap gap-2">
        {previewSkills.map((skill) => (
          <Badge key={skill} variant="secondary" className="text-xs">
            {skill}
          </Badge>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border p-3">
          <Briefcase className="mb-2 h-4 w-4 text-primary" />
          <p className="text-xs font-medium">{projectCount} Projects</p>
        </div>
        <div className="rounded-lg border p-3">
          <Code2 className="mb-2 h-4 w-4 text-primary" />
          <p className="text-xs font-medium">{skillCount} Skills</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="flex-1 text-xs">
          <Code2 className="mr-1 h-3 w-3" />
          GitHub
        </Button>
        <Button size="sm" className="flex-1 text-xs">
          <ExternalLink className="mr-1 h-3 w-3" />
          Contact
        </Button>
      </div>
    </div>
  );
}

export function HeroPreviewFrame({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-lg lg:max-w-none",
        motion.scaleIn,
        animationDelays[200]
      )}
    >
      <div
        className="absolute -inset-6 rounded-3xl bg-gradient-to-r from-primary/30 to-violet-500/25 blur-2xl dark:from-primary/20 dark:to-violet-500/15 animate-template-glow"
        aria-hidden
      />
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-[var(--shadow-card-hover)] backdrop-blur-xl",
          "ring-1 ring-primary/15",
          motion.transition,
          "hover:shadow-[0_28px_60px_-18px_oklch(0.45_0.2_280/0.45)] hover:ring-primary/30 motion-reduce:transform-none"
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Glass reflection */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/3 bg-gradient-to-b from-white/12 to-transparent dark:from-white/8"
          aria-hidden
        />
        {/* Animated border glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-60"
          style={{
            background:
              "linear-gradient(120deg, transparent 30%, oklch(0.7 0.18 280 / 0.35) 50%, transparent 70%)",
            backgroundSize: "200% 200%",
            animation: "hero-border-glow 6s ease-in-out infinite",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
            padding: "1px",
          }}
          aria-hidden
        />
        <div className="relative flex items-center gap-2 border-b border-border/50 bg-muted/40 px-4 py-3 backdrop-blur-sm">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <span className="ml-2 text-xs text-muted-foreground">
            portfolioai.app/demo
          </span>
        </div>
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
