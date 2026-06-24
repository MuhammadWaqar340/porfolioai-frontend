import Link from "next/link";
import { Mail } from "lucide-react";
import { LogoMark } from "@/components/brand/logo-mark";
import { FooterContactForm } from "@/components/landing/footer-contact-form";

export function LandingFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section
          id="contact"
          className="grid gap-8 border-b border-border/60 pb-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              Contact us
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Questions, feedback, or need help?
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Send us a message about billing, features, bugs, or anything else
              while using PortfolioAI. We read every submission and reply by email.
            </p>
          </div>

          <FooterContactForm />
        </section>

        <div className="flex flex-col items-center justify-between gap-6 pt-10 md:flex-row">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark className="h-8 w-8" />
            <span className="text-lg font-bold">PortfolioAI</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            © 2026 PortfolioAI. Build your future today.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="/#contact"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Contact
            </Link>
            <Link
              href="/discover"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Discover
            </Link>
            <Link
              href="/demo"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Demo
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
