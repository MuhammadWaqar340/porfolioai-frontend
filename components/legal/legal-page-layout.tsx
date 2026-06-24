import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LandingFooter } from "@/components/landing/footer";
import { LandingHeader } from "@/components/landing/header";
import { FadeIn } from "@/components/motion/fade-in";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalPageLayout({
  title,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  return (
    <>
      <LandingHeader />
      <main className="min-h-[calc(100vh-8rem)] bg-background">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <FadeIn>
            <header className="mb-10 space-y-2 border-b pb-8">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {title}
              </h1>
              <p className="text-sm text-muted-foreground">
                Last updated: {lastUpdated}
              </p>
            </header>
          </FadeIn>

          <FadeIn delay={100}>
            <article className="legal-prose space-y-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {children}
            </article>
          </FadeIn>
        </div>
      </main>
      <LandingFooter />
    </>
  );
}

interface LegalSectionProps {
  title: string;
  children: React.ReactNode;
}

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground sm:text-xl">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
