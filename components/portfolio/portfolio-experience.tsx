"use client";

import { useExperience } from "@/hooks/use-experience";
import { formatExperienceDuration } from "@/lib/experience-utils";

export function PortfolioExperience() {
  const { experiences, isLoaded } = useExperience();

  if (!isLoaded) {
    return null;
  }

  if (experiences.length === 0) {
    return (
      <section data-portfolio-section="experience">
        <h2 className="mb-6 text-2xl font-bold">Experience</h2>
        <p className="text-sm text-muted-foreground">No experience added yet.</p>
      </section>
    );
  }

  return (
    <section data-portfolio-section="experience">
      <h2 className="mb-6 text-2xl font-bold">Experience</h2>
      <div className="portfolio-stagger-children space-y-6">
        {experiences.map((exp) => (
          <div key={exp.id} className="rounded-xl border p-5">
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="break-words font-semibold">{exp.position}</h3>
                <p className="text-sm text-primary">{exp.company}</p>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatExperienceDuration(exp)}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {exp.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
