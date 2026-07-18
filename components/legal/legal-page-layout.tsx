import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SiteBackdrop } from "@/components/brand/site-backdrop";
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
    <div className="relative min-h-svh">
      <SiteBackdrop />
      <LandingHeader />
      <main className="relative z-10 min-h-[calc(100vh-8rem)]">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <FadeIn>
            <div className="rounded-2xl border border-border/60 bg-card/75 p-6 shadow-[var(--shadow-card)] backdrop-blur-xl supports-[backdrop-filter]:bg-card/65 sm:p-8 lg:p-10">
              <header className="mb-10 space-y-2 border-b border-border/60 pb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Last updated: {lastUpdated}
                </p>
              </header>

              <article className="legal-prose space-y-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {children}
              </article>
            </div>
          </FadeIn>
        </div>
      </main>
      <div className="relative z-10">
        <LandingFooter />
      </div>
    </div>
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
