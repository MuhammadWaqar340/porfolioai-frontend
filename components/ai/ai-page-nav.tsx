"use client";

import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "build", label: "Get started" },
  { id: "analyze", label: "Analyze" },
  { id: "chat", label: "Copilot" },
  { id: "checklist", label: "Checklist" },
] as const;

export function AIPageNav() {
  return (
    <nav
      aria-label="AI assistance sections"
      className="rounded-lg border border-border bg-card px-2 py-1.5"
    >
      <ul className="flex gap-0.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SECTIONS.map((section) => (
          <li key={section.id} className="shrink-0">
            <a
              href={`#${section.id}`}
              className={cn(
                "inline-flex rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors",
                "hover:bg-muted hover:text-foreground"
              )}
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
