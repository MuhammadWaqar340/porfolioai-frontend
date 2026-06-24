"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ProBadge } from "@/components/subscription/pro-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { PAYMENT_PATH, isPremiumTemplateSlug } from "@/constants/plans";
import type { TemplateSlug } from "@/constants/templates";
import { useSubscription } from "@/hooks/use-subscription";
import { cn } from "@/lib/utils";

interface TemplateDemoToolbarProps {
  templateSlug: TemplateSlug;
  templateName: string;
  backHref?: string;
  backLabel?: string;
}

export function TemplateDemoToolbar({
  templateSlug,
  templateName,
  backHref = "/templates",
  backLabel = "All templates",
}: TemplateDemoToolbarProps) {
  const { isPro, canUseTemplate } = useSubscription();
  const isPremium = isPremiumTemplateSlug(templateSlug);
  const canSelect = canUseTemplate(templateSlug);

  return (
    <div className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href={backHref}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "shrink-0 gap-1.5"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
          <div className="hidden h-5 w-px bg-border sm:block" aria-hidden />
          <p className="truncate text-sm text-muted-foreground">
            Previewing{" "}
            <span className="font-medium text-foreground">{templateName}</span>
            {isPremium ? (
              <span className="ml-2 inline-flex align-middle">
                <ProBadge />
              </span>
            ) : null}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {canSelect ? (
            <Link
              href="/templates"
              className={cn(buttonVariants({ variant: "default", size: "sm" }))}
            >
              Use this template
            </Link>
          ) : isPremium && !isPro ? (
            <Link
              href={PAYMENT_PATH}
              className={cn(buttonVariants({ variant: "default", size: "sm" }))}
            >
              Upgrade to Pro
            </Link>
          ) : (
            <Link
              href="/signup"
              className={cn(buttonVariants({ variant: "default", size: "sm" }))}
            >
              Get started
            </Link>
          )}
          <Button
            variant="outline"
            size="sm"
            render={<a href="#top" className="gap-1.5" />}
            nativeButton={false}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Top
          </Button>
        </div>
      </div>
    </div>
  );
}
