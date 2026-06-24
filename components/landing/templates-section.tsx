import { FadeIn } from "@/components/motion/fade-in";
import { TemplatesGrid } from "@/components/templates/templates-grid";

export function TemplatesSection() {
  return (
    <section id="templates" className="bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Beautiful templates
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose from professionally designed templates and customize to match
            your personal brand.
          </p>
        </FadeIn>
        <FadeIn className="mt-16" delay={150}>
          <TemplatesGrid />
        </FadeIn>
      </div>
    </section>
  );
}
