"use client";

import {
  ArrowRight,
  FolderKanban,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { ProjectCard } from "@/components/cards/project-card";
import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjects } from "@/hooks/use-projects";
import { getProjectCompleteness, getProjectMissingFields } from "@/lib/project-utils";
import { cn } from "@/lib/utils";

interface RecentProjectsProps {
  limit?: number;
}

function RecentProjectsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-border/80 bg-card"
        >
          <div className="aspect-video animate-pulse bg-muted/70" />
          <div className="space-y-3 p-4">
            <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
            <div className="space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-muted/80" />
              <div className="h-3 w-4/5 animate-pulse rounded bg-muted/80" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-14 animate-pulse rounded-full bg-muted/80" />
              <div className="h-6 w-16 animate-pulse rounded-full bg-muted/80" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function RecentProjectsEmpty() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/15 px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <FolderKanban className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight">No projects yet</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Add your best work to strengthen your portfolio. Aim for 3–5 projects with
        descriptions, tech tags, and links.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link href="/projects" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          Add your first project
        </Link>
        <Link href="/ai#build" className={buttonVariants({ variant: "outline" })}>
          <Sparkles className="mr-2 h-4 w-4" />
          Import from GitHub
        </Link>
      </div>
    </div>
  );
}

export function RecentProjects({ limit = 3 }: RecentProjectsProps) {
  const { projects, isLoaded } = useProjects();

  const recent = projects.slice(0, limit);
  const needsAttention = recent.filter(
    (project) => getProjectCompleteness(project) < 100
  ).length;
  const avgCompleteness =
    recent.length > 0
      ? Math.round(
          recent.reduce((sum, project) => sum + getProjectCompleteness(project), 0) /
            recent.length
        )
      : 0;

  return (
    <Card className="overflow-hidden border-border/80">
      <CardHeader className="gap-4 border-b bg-muted/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-xl">Recent Projects</CardTitle>
            {isLoaded && projects.length > 0 ? (
              <Badge variant="secondary" className="tabular-nums">
                {projects.length} total
              </Badge>
            ) : null}
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            {isLoaded && recent.length > 0
              ? needsAttention > 0
                ? `${needsAttention} of ${recent.length} shown ${
                    needsAttention === 1 ? "needs" : "need"
                  } polish — add images, descriptions, or links to stand out.`
                : "Your latest projects look complete. Keep them updated as you ship new work."
              : "Your newest projects appear here once you add them."}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {isLoaded && recent.length > 0 ? (
            <Badge
              variant={avgCompleteness >= 80 ? "secondary" : "outline"}
              className={cn(
                "tabular-nums",
                avgCompleteness < 80 && "border-amber-500/40 text-amber-700 dark:text-amber-300"
              )}
            >
              {avgCompleteness}% avg. complete
            </Badge>
          ) : null}
          <Link
            href="/projects"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Manage projects
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {!isLoaded ? (
            <RecentProjectsSkeleton count={limit} />
          ) : recent.length === 0 ? (
            <RecentProjectsEmpty />
          ) : (
            recent.map((project, index) => (
              <FadeIn key={project.id} delay={index * 70} className="contents">
                <ProjectCard
                  project={project}
                  variant="dashboard"
                  missingFields={getProjectMissingFields(project)}
                  completeness={getProjectCompleteness(project)}
                />
              </FadeIn>
            ))
          )}
        </div>

        {isLoaded && recent.length > 0 && projects.length > limit ? (
          <div className="mt-6 flex justify-center border-t pt-5">
            <Button variant="ghost" size="sm" render={<Link href="/projects" />} nativeButton={false}>
              View all {projects.length} projects
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
