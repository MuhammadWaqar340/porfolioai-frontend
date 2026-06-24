"use client";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { MobileSidebar } from "@/components/layout/sidebar";
import { NotificationsMenu } from "@/components/layout/notifications-menu";
import { UserMenu } from "@/components/layout/user-menu";

interface NavbarProps {
  title?: string;
}

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="z-40 flex h-16 shrink-0 items-center gap-4 border-b border-border/80 bg-background/90 px-4 shadow-[var(--shadow-header)] transition-shadow duration-300 md:sticky md:top-0 md:backdrop-blur-md md:supports-[backdrop-filter]:bg-background/75 md:px-6">
      <MobileSidebar />
      {title && (
        <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
      )}
      <div className="ml-auto flex items-center gap-2">
        <NotificationsMenu />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
