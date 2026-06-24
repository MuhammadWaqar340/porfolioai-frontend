"use client";

import { Code2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { CardOverlayActions } from "@/components/cards/card-overlay-actions";
import { ProjectImage } from "@/components/projects/project-image";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { Project } from "@/types";
import { hasProjectUrl } from "@/lib/project-utils";
import { cn } from "@/lib/utils";

const MAX_VISIBLE_TECH = 4;

interface ProjectCardProps {
  project: Project;
  className?: string;
  onEdit?: (project: Project) => void;
  onRemove?: (project: Project) => void;
  onDragStart?: (event: React.DragEvent) => void;
  onDragEnd?: () => void;
}

function formatDescriptionPreview(description: string) {
  return description
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
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
  onEdit,
  onRemove,
  onDragStart,
  onDragEnd,
}: ProjectCardProps) {
  const hasGithub = hasProjectUrl(project.githubUrl);
  const hasLiveDemo = hasProjectUrl(project.liveUrl);
  const description = formatDescriptionPreview(project.description);

  return (
    <Card
      className={cn(
        "group flex h-full flex-col overflow-hidden border-border/80 pb-0 transition-all duration-200",
        "hover:border-primary/20 hover:shadow-md",
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
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent opacity-60 transition-opacity group-hover:opacity-80"
          aria-hidden
        />

        <CardOverlayActions
          dragLabel={`Reorder ${project.title}`}
          editLabel={`Edit ${project.title}`}
          removeLabel={`Remove ${project.title}`}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onEdit={onEdit ? () => onEdit(project) : undefined}
          onRemove={onRemove ? () => onRemove(project) : undefined}
        />
      </div>

      <CardHeader className="space-y-2 pb-2">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight">
          {project.title}
        </h3>
        {description ? (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : (
          <p className="text-sm italic text-muted-foreground">No description yet.</p>
        )}
      </CardHeader>

      <CardContent className="flex-1 pt-0">
        <ProjectTechTags technologies={project.technologies} />
      </CardContent>

      <CardFooter className="mt-auto gap-2 border-t bg-muted/20 px-4 py-3">
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
      </CardFooter>
    </Card>
  );
}
