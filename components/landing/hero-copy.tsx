"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/landing/magnetic-button";
import { TextReveal } from "@/components/landing/text-reveal";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { landingEase, landingSpring } from "@/lib/landing-motion";
import { cn } from "@/lib/utils";

export function HeroCopy() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="space-y-8">
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...landingSpring, delay: 0.05 }}
      >
        <Badge variant="secondary" className="gap-1.5 px-3 py-1">
          <Sparkles className="h-3 w-3" />
          AI-Powered Portfolio Builder
        </Badge>
      </motion.div>

      <div>
        <TextReveal
          text="Build Your Portfolio"
          className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
        />
        <motion.span
          className="mt-1 block text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          initial={
            reducedMotion ? false : { opacity: 0, y: 16, filter: "blur(8px)" }
          }
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: landingEase, delay: 0.55 }}
        >
          <span className="text-gradient with-ai-glow">with AI</span>
        </motion.span>
      </div>

      <motion.p
        className="max-w-xl text-lg text-muted-foreground"
        initial={reducedMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: landingEase, delay: 0.65 }}
      >
        Create beautiful and professional portfolios manually or with AI
        assistance.
      </motion.p>

      <motion.div
        className="flex flex-col gap-3 sm:flex-row"
        initial={reducedMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: landingEase, delay: 0.75 }}
      >
        <MagneticButton>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "lg" }),
              "gap-2 shadow-[0_8px_30px_-8px_var(--primary)] transition-shadow hover:shadow-[0_12px_44px_-6px_var(--primary)]",
            )}
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </MagneticButton>
        <MagneticButton>
          <Link
            href="/demo"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "backdrop-blur-sm",
            )}
          >
            View Demo
          </Link>
        </MagneticButton>
      </motion.div>

      <motion.div
        className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.9 }}
      >
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Free to start
        </span>
        <span>No credit card required</span>
      </motion.div>
    </div>
  );
}

export function HeroFloatingOrbs() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[8%] top-[22%] size-24 rounded-full bg-primary/25 blur-2xl"
        animate={{ y: [0, -18, 0], opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[12%] top-[18%] size-32 rounded-full bg-violet-500/20 blur-3xl"
        animate={{ y: [0, 22, 0], x: [0, -12, 0], opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-[12%] left-[40%] size-20 rounded-full bg-indigo-400/20 blur-2xl"
        animate={{ y: [0, -14, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}
