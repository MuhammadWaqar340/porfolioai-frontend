"use client";

import { Badge } from "@/components/ui/badge";
import { useSkills } from "@/hooks/use-skills";

export function PortfolioSkills() {
  const { skills, isLoaded } = useSkills();

  if (!isLoaded) {
    return null;
  }

  const allSkills = skills.flatMap((category) => category.skills);

  if (allSkills.length === 0) {
    return (
      <section data-portfolio-section="skills">
        <h2 className="mb-6 text-2xl font-bold">Skills</h2>
        <p className="text-sm text-muted-foreground">No skills added yet.</p>
      </section>
    );
  }

  return (
    <section data-portfolio-section="skills">
      <h2 className="mb-6 text-2xl font-bold">Skills</h2>
      <div className="portfolio-stagger-children flex flex-wrap gap-2">
        {allSkills.map((skill) => (
          <Badge key={skill.id} variant="secondary" className="px-3 py-1.5">
            {skill.name}
          </Badge>
        ))}
      </div>
    </section>
  );
}
