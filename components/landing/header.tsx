"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LogoMark } from "@/components/brand/logo-mark";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { landingNavItems } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export function LandingHeader() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 shadow-[var(--shadow-header)] backdrop-blur-md transition-shadow duration-300 supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <LogoMark className="h-9 w-9" priority />
          <span className="truncate text-lg font-semibold tracking-tight">
            PortfolioAI
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {landingNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open navigation menu"
                />
              }
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs p-0">
              <nav className="flex flex-col gap-1 p-4 pt-12">
                {landingNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {item.title}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-2 border-t pt-4">
                  <Link
                    href="/login"
                    onClick={() => setMobileNavOpen(false)}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full"
                    )}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileNavOpen(false)}
                    className={cn(buttonVariants({ variant: "default" }), "w-full")}
                  >
                    Sign up
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          <ThemeToggle />
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden sm:inline-flex"
            )}
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "hidden sm:inline-flex"
            )}
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
