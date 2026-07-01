"use client";

import { Code2, ExternalLink, Pencil, Sparkles } from "lucide-react";
import Link from "next/link";
import { CardOverlayActions } from "@/components/cards/card-overlay-actions";
import { ProjectImage } from "@/components/projects/project-image";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { Project } from "@/types";
import {
  formatDescriptionPreview,
  hasProjectUrl,
} from "@/lib/project-utils";
import { cn } from "@/lib/utils";

const MAX_VISIBLE_TECH = 4;

interface ProjectCardProps {
  project: Project;
  className?: string;
  variant?: "default" | "dashboard";
  completeness?: number;
  missingFields?: string[];
  onEdit?: (project: Project) => void;
  onRemove?: (project: Project) => void;
  onDragStart?: (event: React.DragEvent) => void;
  onDragEnd?: () => void;
}

function missingFieldLabel(field: string) {
  const labels: Record<string, string> = {
    description: "Add description",
    image: "Add image",
    technologies: "Add tech stack",
    links: "Add GitHub or demo link",
  };
  return labels[field] ?? field;
}

function ProjectTechTags({ technologies }: { technologies: string[] }) {
  if (technologies.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">No technologies listed yet.</p>
    );
  }

  const visible = technologies.slice(0, MAX_VISIBLE_TECH);
  const remaining = technologies.length - visible.length;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((tech) => (
        <Badge
          key={tech}
          variant="secondary"
          className="max-w-full truncate text-[11px] font-normal"
        >
          {tech}
        </Badge>
      ))}
      {remaining > 0 ? (
        <Badge variant="outline" className="text-[11px] font-normal tabular-nums">
          +{remaining} more
        </Badge>
      ) : null}
    </div>
  );
}

export function ProjectCard({
  project,
  className,
  variant = "default",
  completeness,
  missingFields = [],
  onEdit,
  onRemove,
  onDragStart,
  onDragEnd,
}: ProjectCardProps) {
  const isDashboard = variant === "dashboard";
  const hasGithub = hasProjectUrl(project.githubUrl);
  const hasLiveDemo = hasProjectUrl(project.liveUrl);
  const description = formatDescriptionPreview(project.description);
  const hasLinks = hasGithub || hasLiveDemo;
  const topMissing = missingFields[0];

  return (
    <Card
      className={cn(
        "group flex h-full flex-col overflow-hidden border-border/80 pb-0 transition-all duration-200",
        isDashboard
          ? "bg-card/80 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5"
          : "hover:border-primary/20 hover:shadow-md",
        className
      )}
    >
      <div className="relative shrink-0">
        <ProjectImage
          src={project.imageUrl}
          alt={project.title}
          title={project.title}
          imageClassName="transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent transition-opacity",
            isDashboard ? "opacity-50 group-hover:opacity-70" : "opacity-60 group-hover:opacity-80"
          )}
          aria-hidden
        />

        {isDashboard && typeof completeness === "number" ? (
          <Badge
            variant="secondary"
            className={cn(
              "absolute left-3 top-3 z-10 border-0 bg-black/50 text-[11px] text-white backdrop-blur-sm",
              completeness >= 100 && "bg-emerald-600/80"
            )}
          >
            {completeness}% complete
          </Badge>
        ) : null}

        {!isDashboard ? (
          <CardOverlayActions
            dragLabel={`Reorder ${project.title}`}
            editLabel={`Edit ${project.title}`}
            removeLabel={`Remove ${project.title}`}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onEdit={onEdit ? () => onEdit(project) : undefined}
            onRemove={onRemove ? () => onRemove(project) : undefined}
          />
        ) : (
          <Link
            href="/projects"
            className={cn(
              buttonVariants({ variant: "secondary", size: "icon-sm" }),
              "absolute right-3 top-3 z-10 h-8 w-8 border border-white/20 bg-black/45 text-white opacity-100 backdrop-blur-sm transition-opacity hover:bg-black/60 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
            )}
            aria-label={`Edit ${project.title}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      <CardHeader className="space-y-2 pb-2">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight">
          {project.title}
        </h3>
        {description ? (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : isDashboard && topMissing === "description" ? (
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Add a description with AI
          </Link>
        ) : (
          <p className="text-sm italic text-muted-foreground">No description yet.</p>
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-3 pt-0">
        <ProjectTechTags technologies={project.technologies} />
        {isDashboard && topMissing && topMissing !== "description" ? (
          <p className="text-xs text-amber-700 dark:text-amber-300">
            {missingFieldLabel(topMissing)}
          </p>
        ) : null}
      </CardContent>

      <CardFooter
        className={cn(
          "mt-auto gap-2 border-t px-4 py-3",
          isDashboard ? "bg-muted/10" : "bg-muted/20"
        )}
      >
        {isDashboard ? (
          <>
            {hasGithub ? (
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "min-w-0 flex-1 bg-background/80",
                })}
              >
                <Code2 className="mr-1.5 h-4 w-4 shrink-0" />
                <span className="truncate">GitHub</span>
              </Link>
            ) : null}
            {hasLiveDemo ? (
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className:
                    "min-w-0 flex-1 border-primary/40 bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
                })}
              >
                <ExternalLink className="mr-1.5 h-4 w-4 shrink-0" />
                <span className="truncate">Live demo</span>
              </Link>
            ) : null}
            {!hasLinks ? (
              <Link
                href="/projects"
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "w-full justify-center bg-background/80",
                })}
              >
                Add project links
              </Link>
            ) : null}
          </>
        ) : (
          <>
            {hasGithub ? (
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "min-w-0 flex-1 bg-background/80",
                })}
              >
                <Code2 className="mr-1.5 h-4 w-4 shrink-0" />
                <span className="truncate">GitHub</span>
              </Link>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="min-w-0 flex-1 bg-background/80"
                disabled
              >
                <Code2 className="mr-1.5 h-4 w-4 shrink-0" />
                <span className="truncate">GitHub</span>
              </Button>
            )}
            {hasLiveDemo ? (
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className:
                    "min-w-0 flex-1 border-primary/40 bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
                })}
              >
                <ExternalLink className="mr-1.5 h-4 w-4 shrink-0" />
                <span className="truncate">Live demo</span>
              </Link>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="min-w-0 flex-1"
                disabled
              >
                <ExternalLink className="mr-1.5 h-4 w-4 shrink-0" />
                <span className="truncate">Live demo</span>
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}
