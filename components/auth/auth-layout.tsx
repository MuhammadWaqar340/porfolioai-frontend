import Link from "next/link";
import { AuthBackdrop } from "@/components/auth/auth-backdrop";
import { LogoMark } from "@/components/brand/logo-mark";
import { FadeIn } from "@/components/motion/fade-in";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { animationDelays, motion } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const highlights = [
  "Build portfolios manually or with AI",
  "Choose from professional templates",
  "Share your work with a public URL",
];

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative min-h-svh overflow-x-clip">
      <AuthBackdrop />

      <div className="relative z-10 flex min-h-svh flex-col">
        <header className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-2.5 text-foreground">
            <LogoMark className="h-9 w-9 sm:h-10 sm:w-10" priority />
            <span className="text-lg font-semibold tracking-tight sm:text-xl">
              PortfolioAI
            </span>
          </Link>
          <div className="rounded-full border border-border/60 bg-background/70 shadow-sm backdrop-blur-md">
            <ThemeToggle />
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-10 px-4 pb-10 pt-2 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-10 lg:pb-14">
          <FadeIn className="hidden max-w-lg shrink-0 lg:block lg:w-[44%]">
            <h1
              className={cn(
                "text-3xl font-bold leading-tight tracking-tight text-foreground xl:text-4xl",
                motion.fadeInUp,
                animationDelays[100],
              )}
            >
              {title}
            </h1>
            <p
              className={cn(
                "mt-4 text-lg leading-relaxed text-muted-foreground",
                motion.fadeInUp,
                animationDelays[200],
              )}
            >
              {subtitle}
            </p>
            <ul className="mt-8 space-y-3">
              {highlights.map((item, index) => (
                <li
                  key={item}
                  className={cn(
                    "flex items-center gap-3 text-sm text-foreground/90",
                    motion.fadeInUp,
                  )}
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] text-primary ring-1 ring-primary/20 backdrop-blur-sm">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn
            className="mx-auto w-full max-w-md lg:mx-0 lg:ml-auto"
            delay={120}
            direction="up"
          >
            <div
              className={cn(
                "rounded-2xl border border-border/60 bg-card/75 p-1 shadow-[var(--shadow-card-hover)]",
                "backdrop-blur-xl supports-[backdrop-filter]:bg-card/65",
                "ring-1 ring-primary/10",
                "[&_[data-slot=card]]:border-0 [&_[data-slot=card]]:bg-transparent [&_[data-slot=card]]:shadow-none [&_[data-slot=card]]:ring-0 [&_[data-slot=card]]:animate-none [&_[data-slot=card]]:opacity-100",
              )}
            >
              <div className="rounded-[0.9rem] bg-card/90 p-1 sm:p-2 dark:bg-card/85">
                {children}
              </div>
            </div>
          </FadeIn>
        </div>

        <p className="px-4 pb-5 text-center text-xs text-muted-foreground sm:text-sm">
          © 2026 PortfolioAI. All rights reserved.
        </p>
      </div>
    </div>
  );
}
