"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { motion } from "framer-motion";
import { LogoMark } from "@/components/brand/logo-mark";
import { FooterContactForm } from "@/components/landing/footer-contact-form";
import { FadeIn } from "@/components/motion/fade-in";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function LandingFooter() {
  const reducedMotion = useReducedMotion();

  return (
    <footer className="relative overflow-hidden border-t bg-muted/25">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 app-mesh opacity-30"
      />
      {!reducedMotion ? (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-10 top-8 size-40 rounded-full bg-primary/15 blur-3xl"
            animate={{ y: [0, 16, 0], opacity: [0.3, 0.55, 0.3] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute right-10 top-16 size-28 rounded-full bg-violet-400/15 blur-2xl"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      ) : null}

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <FadeIn>
          <section
            id="contact"
            className="grid gap-8 border-b border-border/60 pb-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                <motion.span
                  animate={
                    reducedMotion ? undefined : { y: [0, -2, 0], rotate: [0, 6, 0] }
                  }
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-flex"
                >
                  <Mail className="h-3.5 w-3.5" />
                </motion.span>
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
        </FadeIn>

        <div className="flex flex-col items-center justify-between gap-6 pt-10 md:flex-row">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark className="h-8 w-8" />
            <span className="text-lg font-bold">PortfolioAI</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            © 2026 PortfolioAI. Build your future today.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {(
              [
                ["#features", "Features"],
                ["/#contact", "Contact"],
                ["/discover", "Discover"],
                ["/demo", "Demo"],
                ["/terms", "Terms"],
                ["/privacy", "Privacy"],
              ] as const
            ).map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
