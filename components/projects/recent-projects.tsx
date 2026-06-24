"use client";

import { ProjectCard } from "@/components/cards/project-card";
import { useProjects } from "@/hooks/use-projects";

interface RecentProjectsProps {
  limit?: number;
}

export function RecentProjects({ limit = 3 }: RecentProjectsProps) {
  const { projects, isLoaded } = useProjects();

  if (!isLoaded) {
    return (
      <p className="col-span-full text-sm text-muted-foreground">Loading projects…</p>
    );
  }

  const recent = projects.slice(0, limit);

  if (recent.length === 0) {
    return (
      <p className="col-span-full text-sm text-muted-foreground">
        No projects yet. Add your first project to see it here.
      </p>
    );
  }

  return (
    <>
      {recent.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </>
  );
}
