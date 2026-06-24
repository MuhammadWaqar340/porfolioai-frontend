"use client";

import { GraduationCap } from "lucide-react";
import { useEducation } from "@/hooks/use-education";
import { formatEducationYears } from "@/lib/education-utils";

export function PortfolioEducation() {
  const { education, isLoaded } = useEducation();

  if (!isLoaded) {
    return null;
  }

  if (education.length === 0) {
    return (
      <section data-portfolio-section="education">
        <h2 className="mb-6 text-2xl font-bold">Education</h2>
        <p className="text-sm text-muted-foreground">No education added yet.</p>
      </section>
    );
  }

  return (
    <section data-portfolio-section="education">
      <h2 className="mb-6 text-2xl font-bold">Education</h2>
      <div className="portfolio-stagger-children grid gap-4 sm:grid-cols-2">
        {education.map((item) => (
          <div
            key={item.id}
            className="portfolio-item-card flex items-start gap-3 rounded-xl border p-4"
          >
            <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <h3 className="break-words font-semibold">{item.degree}</h3>
              <p className="text-sm text-muted-foreground">{item.institution}</p>
              <p className="mt-1 text-sm font-medium text-primary">
                {formatEducationYears(item)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
