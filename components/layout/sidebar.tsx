"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoMark } from "@/components/brand/logo-mark";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  sidebarFooterNavItem,
  sidebarNavItems,
} from "@/constants/navigation";
import { cn } from "@/lib/utils";

type NavItem =
  | (typeof sidebarNavItems)[number]
  | typeof sidebarFooterNavItem;

function NavLink({
  item,
  isActive,
  onNavigate,
}: {
  item: NavItem;
  isActive: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/15"
          : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
      )}
    >
      {isActive ? (
        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
      ) : null}
      <Icon className="h-4 w-4 shrink-0" />
      {item.title}
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const settingsActive = pathname === sidebarFooterNavItem.href;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-5">
        <LogoMark className="h-9 w-9" priority />
        <div className="min-w-0">
          <span className="block truncate text-base font-semibold tracking-tight">
            PortfolioAI
          </span>
          <span className="block truncate text-[11px] text-muted-foreground">
            Portfolio builder
          </span>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1 [&_[data-slot=scroll-area-viewport]]:!block [&_[data-slot=scroll-area-viewport]]:h-full">
        <nav className="flex flex-col gap-0.5 px-3 py-4 pb-2">
          {sidebarNavItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              onNavigate={onNavigate}
            />
          ))}
        </nav>
      </ScrollArea>

      <div className="shrink-0 space-y-1 border-t border-sidebar-border bg-sidebar px-3 py-3 pb-14">
        <NavLink
          item={sidebarFooterNavItem}
          isActive={settingsActive}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden h-svh min-h-0 w-64 shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar shadow-[var(--shadow-header)] md:flex">
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        }
      />
      <SheetContent
        side="left"
        className="flex h-full w-64 flex-col gap-0 border-sidebar-border bg-sidebar p-0"
      >
        <SidebarContent onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
