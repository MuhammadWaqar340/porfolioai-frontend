"use client";

import { ArrowLeft, Code2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ProjectImageGallery } from "@/components/projects/project-image-gallery";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { hasProjectUrl } from "@/lib/project-utils";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

interface PortfolioProjectDetailProps {
  project: Project;
  portfolioHref: string;
  backLabel?: string;
  className?: string;
}

export function PortfolioProjectDetail({
  project,
  portfolioHref,
  backLabel = "Back to portfolio",
  className,
}: PortfolioProjectDetailProps) {
  const hasGithub = hasProjectUrl(project.githubUrl);
  const hasLiveDemo = hasProjectUrl(project.liveUrl);
  const description = project.description.trim();

  return (
    <article className={cn("mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12", className)}>
      <Link
        href={portfolioHref}
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "mb-6 -ml-2 gap-1.5 text-muted-foreground hover:text-foreground"
        )}
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <ProjectImageGallery
        images={
          project.imageUrls.length > 0
            ? project.imageUrls
            : project.imageUrl
              ? [project.imageUrl]
              : []
        }
        title={project.title}
      />

      <header className="mt-8 space-y-4">
        <h1 className="break-words text-3xl font-bold tracking-tight sm:text-4xl">
          {project.title}
        </h1>

        {project.technologies.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        ) : null}

        {hasGithub || hasLiveDemo ? (
          <div className="flex flex-wrap gap-2">
            {hasGithub ? (
              <Button
                variant="outline"
                size="sm"
                render={
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" />
                }
                nativeButton={false}
              >
                <Code2 className="mr-2 h-4 w-4" />
                View on GitHub
              </Button>
            ) : null}
            {hasLiveDemo ? (
              <Button
                size="sm"
                render={
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" />
                }
                nativeButton={false}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Live demo
              </Button>
            ) : null}
          </div>
        ) : null}
      </header>

      {description ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">About this project</h2>
          <p className="mt-4 break-words [overflow-wrap:anywhere] whitespace-pre-wrap text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        </section>
      ) : null}
    </article>
  );
}
