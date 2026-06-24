import { LogoMark } from "@/components/brand/logo-mark";
import Link from "next/link";
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
    <div className="lg:flex lg:h-svh lg:flex-row lg:overflow-hidden">
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden p-10 text-primary-foreground lg:flex">
        <div className="absolute inset-0 auth-panel-bg" aria-hidden />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,oklch(1_0_0/0.14),transparent_55%)]"
          aria-hidden
        />
        <div className="absolute inset-0 auth-panel-grid opacity-60" aria-hidden />
        <div
          className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"
          aria-hidden
        />
        <div
          className="absolute -left-24 top-1/4 size-72 rounded-full bg-violet-400/20 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -right-16 bottom-1/4 size-64 rounded-full bg-indigo-300/15 blur-3xl"
          aria-hidden
        />

        <Link href="/" className="relative z-10 flex items-center gap-2.5">
          <LogoMark className="h-10 w-10 shadow-lg shadow-black/25" priority />
          <span className="text-xl font-semibold tracking-tight">PortfolioAI</span>
        </Link>

        <div className="relative z-10 max-w-md space-y-6">
          <h1
            className={cn(
              "text-3xl font-bold leading-tight tracking-tight xl:text-4xl",
              motion.fadeInUp,
              animationDelays[100]
            )}
          >
            {title}
          </h1>
          <p
            className={cn(
              "text-lg leading-relaxed text-primary-foreground/85",
              motion.fadeInUp,
              animationDelays[200]
            )}
          >
            {subtitle}
          </p>
          <ul className="space-y-3">
            {highlights.map((item, index) => (
              <li
                key={item}
                className={cn(
                  "flex items-center gap-3 text-sm text-primary-foreground/90",
                  motion.fadeInUp
                )}
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-[10px] ring-1 ring-white/20 backdrop-blur-sm">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-sm text-primary-foreground/55">
          © 2026 PortfolioAI. All rights reserved.
        </p>
      </div>

      <div className="flex flex-1 flex-col bg-background lg:min-h-0 lg:overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border/80 p-4 sm:p-6 lg:border-0">
          <Link href="/" className="flex items-center gap-2.5 lg:hidden">
            <LogoMark className="h-9 w-9" priority />
            <span className="text-lg font-semibold tracking-tight">PortfolioAI</span>
          </Link>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 pb-10 sm:px-6">
          <FadeIn className="w-full max-w-md" delay={150} direction="up">
            {children}
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
