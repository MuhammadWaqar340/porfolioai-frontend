"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MeData } from "@/lib/api/types";
import { useGetPortfolioSettingsQuery } from "@/store/api/portfolioApi";
import { useAppSelector } from "@/store/hooks";

export function OpenPortfolioLinkButton() {
  const user = useAppSelector((state) => state.auth.user);
  const { data: settings } = useGetPortfolioSettingsQuery();

  const portfolioSlug =
    settings?.username ??
    (user && "portfolio_slug" in user
      ? (user as MeData).portfolio_slug
      : null) ??
    user?.username;

  const href = portfolioSlug ? `/${portfolioSlug}` : "/demo";

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
    >
      <ExternalLink className="h-4 w-4" />
      Open in New Tab
    </Link>
  );
}
