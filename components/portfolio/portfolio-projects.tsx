"use client";

import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProjectImage } from "@/components/projects/project-image";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { usePortfolioProjectLinks } from "@/hooks/use-portfolio-project-links";
import { useProjects } from "@/hooks/use-projects";
import { cn } from "@/lib/utils";

interface PortfolioProjectsProps {
  limit?: number;
}

const MAX_VISIBLE_TECH = 4;

function ProjectCardDescription({ description }: { description: string }) {
  const trimmed = description.trim();

  return (
    <p
      className={cn(
        "line-clamp-3 min-h-[4.25rem] text-sm leading-relaxed",
        trimmed ? "text-muted-foreground" : "italic text-muted-foreground/60"
      )}
    >
      {trimmed || "No description provided."}
    </p>
  );
}

function PortfolioProjectsContent({ limit }: PortfolioProjectsProps) {
  const { projects, isLoaded } = useProjects();
  const { getProjectHref, hasProjectPages } = usePortfolioProjectLinks();

  if (!isLoaded) {
    return null;
  }

  const displayProjects =
    limit != null && limit > 0 ? projects.slice(0, limit) : projects;

  if (displayProjects.length === 0) {
    return (
      <section data-portfolio-section="projects">
        <h2 className="mb-6 text-2xl font-bold">Projects</h2>
        <p className="text-sm text-muted-foreground">No projects added yet.</p>
      </section>
    );
  }

  return (
    <section data-portfolio-section="projects" className="min-w-0">
      <h2 className="mb-6 text-2xl font-bold">Projects</h2>
      <div className="portfolio-stagger-children grid min-w-0 auto-rows-fr gap-6 sm:grid-cols-2">
        {displayProjects.map((project) => {
          const detailHref = getProjectHref(project.id);
          const showDetailsLink = Boolean(detailHref && hasProjectPages);
          const visibleTech = project.technologies.slice(0, MAX_VISIBLE_TECH);
          const remainingTech = project.technologies.length - visibleTech.length;

          return (
            <div
              key={project.id}
              className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg"
            >
              {detailHref ? (
                <Link href={detailHref} className="block shrink-0">
                  <ProjectImage
                    src={project.imageUrl}
                    alt={project.title}
                    imageClassName="transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </Link>
              ) : (
                <ProjectImage
                  src={project.imageUrl}
                  alt={project.title}
                  imageClassName="transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
              <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
                {detailHref ? (
                  <Link
                    href={detailHref}
                    className="line-clamp-2 min-h-12 break-words font-semibold leading-snug transition-colors hover:text-primary"
                  >
                    {project.title}
                  </Link>
                ) : (
                  <h3 className="line-clamp-2 min-h-12 break-words font-semibold leading-snug">
                    {project.title}
                  </h3>
                )}
                <ProjectCardDescription description={project.description} />
                <div className="mt-auto flex flex-col gap-3 pt-1">
                  <div className="flex min-h-7 flex-wrap content-start gap-1">
                    {visibleTech.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {remainingTech > 0 ? (
                      <Badge variant="outline" className="text-xs tabular-nums">
                        +{remainingTech} more
                      </Badge>
                    ) : null}
                  </div>
                  <div className="flex min-h-8 items-center justify-end">
                    {showDetailsLink && detailHref ? (
                      <Link
                        href={detailHref}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "gap-1"
                        )}
                      >
                        View details
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function PortfolioProjectsFallback() {
  return (
    <section data-portfolio-section="projects" className="min-w-0">
      <h2 className="mb-6 text-2xl font-bold">Projects</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="h-72 animate-pulse rounded-xl border bg-muted/30" />
        ))}
      </div>
    </section>
  );
}

export function PortfolioProjects(props: PortfolioProjectsProps) {
  return (
    <Suspense fallback={<PortfolioProjectsFallback />}>
      <PortfolioProjectsContent {...props} />
    </Suspense>
  );
}
