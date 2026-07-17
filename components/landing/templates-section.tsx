import { FadeIn } from "@/components/motion/fade-in";
import { SectionAurora } from "@/components/landing/section-aurora";
import { TemplatesGrid } from "@/components/templates/templates-grid";

export function TemplatesSection() {
  return (
    <section id="templates" className="relative overflow-hidden bg-muted/30 py-16 sm:py-20 lg:py-28">
      <SectionAurora align="right" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Templates
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Beautiful templates
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:mt-4 sm:text-lg">
            Choose from professionally designed layouts and customize them to match
            your personal brand.
          </p>
        </FadeIn>
      </div>

      <FadeIn className="mt-10 sm:mt-12 lg:mt-16" delay={150}>
        <TemplatesGrid showToolbar={false} layout="carousel" />
      </FadeIn>
    </section>
  );
}
