import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { buttonVariants } from "@/components/ui/button";
import { motion } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function CTA() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div
            className={cn(
              "relative overflow-hidden rounded-3xl px-6 py-16 text-center shadow-2xl shadow-primary/15 ring-1 ring-white/10 sm:px-16 sm:py-20",
              motion.transition,
              "hover:shadow-[0_24px_60px_-12px_oklch(0.45_0.2_280/0.35)]"
            )}
          >
            <div className="absolute inset-0 cta-panel-bg" aria-hidden />
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-20%,oklch(1_0_0/0.16),transparent_60%)]"
              aria-hidden
            />
            <div className="absolute inset-0 auth-panel-grid opacity-40" aria-hidden />
            <div
              className="absolute -left-20 top-1/2 size-56 -translate-y-1/2 rounded-full bg-violet-300/25 blur-3xl"
              aria-hidden
            />
            <div
              className="absolute -right-16 top-1/3 size-48 rounded-full bg-indigo-200/20 blur-3xl"
              aria-hidden
            />
            <div
              className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
              aria-hidden
            />

            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Ready to build your portfolio?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/85">
                Join thousands of professionals who have created stunning portfolios
                with PortfolioAI. Start for free today.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className={cn(buttonVariants({ size: "lg" }), "gap-2")}
                >
                  Create Your Portfolio
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/ai"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "border-white/35 text-primary-foreground hover:text-primary-foreground"
                  )}
                >
                  Try AI Assistant
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
