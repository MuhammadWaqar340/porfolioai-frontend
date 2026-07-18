"use client";

import { Check, ExternalLink, Loader2, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProBadge } from "@/components/subscription/pro-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTemplateDemoPath, resolveTemplateSlug } from "@/constants/templates";
import type { Template } from "@/types";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  template: Template;
  className?: string;
  isSelected?: boolean;
  isSelecting?: boolean;
  isLocked?: boolean;
  onSelect?: (template: Template) => void;
  actionLabel?: string;
  onAction?: (template: Template) => void;
  showPreview?: boolean;
  previewFrom?: "templates";
  /** Landing/marketing layout — fewer buttons, cleaner on small screens */
  layout?: "select" | "browse";
}

export function TemplateCard({
  template,
  className,
  isSelected = false,
  isSelecting = false,
  isLocked = false,
  onSelect,
  actionLabel,
  onAction,
  showPreview = true,
  previewFrom,
  layout = "select",
}: TemplateCardProps) {
  const previewHref = getTemplateDemoPath(resolveTemplateSlug(template.slug), {
    from: previewFrom,
  });
  const isBrowse = layout === "browse";

  const handleClick = () => {
    if (isSelected || isSelecting || isLocked) return;
    if (onSelect) {
      onSelect(template);
      return;
    }
    onAction?.(template);
  };

  const label = isLocked
    ? "Pro only"
    : isSelected
      ? "Selected"
      : isSelecting
        ? "Applying…"
        : (actionLabel ?? "Select template");

  return (
    <Card
      className={cn(
        "group/card h-full overflow-hidden pb-0",
        isSelected && "border-primary/50 ring-2 ring-primary/30 shadow-md",
        isLocked && "border-dashed",
        className
      )}
    >
      <div className="relative aspect-[5/4] overflow-hidden sm:aspect-[4/3]">
        {showPreview ? (
          <Link
            href={previewHref}
            className="absolute inset-0 z-[1]"
            aria-label={`Preview ${template.name} template`}
          />
        ) : null}

        <Image
          src={template.previewUrl}
          alt={`${template.name} template preview`}
          fill
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.08] motion-reduce:transform-none"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
          priority={false}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 transition-opacity duration-300 group-hover/card:opacity-100 supports-[hover:hover]:opacity-0 supports-[hover:hover]:group-hover/card:opacity-100" />

        {isSelected ? (
          <div className="absolute right-2.5 top-2.5 z-[2] flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground shadow-md sm:right-3 sm:top-3">
            <Check className="h-3.5 w-3.5" aria-hidden />
            Active
          </div>
        ) : template.isPremium ? (
          <div className="absolute right-2.5 top-2.5 z-[2] sm:right-3 sm:top-3">
            <ProBadge />
          </div>
        ) : null}

        {isLocked ? (
          <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center gap-2 bg-background/55 px-4 text-center backdrop-blur-[2px]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted shadow-sm">
              <Lock className="h-4 w-4 text-muted-foreground" aria-hidden />
            </div>
            <p className="text-xs font-medium text-foreground">Pro template</p>
          </div>
        ) : null}

        {showPreview ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex justify-center p-3 sm:p-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background/95 px-3 py-1.5 text-xs font-medium text-foreground shadow-md backdrop-blur-sm">
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              Live preview
            </span>
          </div>
        ) : null}
      </div>

      <CardHeader className="gap-1.5 pb-0">
        <CardTitle className="text-base sm:text-lg">{template.name}</CardTitle>
        <CardDescription className="line-clamp-2 text-sm leading-relaxed">
          {template.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {template.slug}
          </span>
          {template.isPremium ? (
            <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-300">
              Pro
            </span>
          ) : (
            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
              Free
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="mt-auto flex-col gap-2 border-0 bg-transparent p-4 pt-2 sm:flex-row">
        {showPreview && !isBrowse ? (
          <Button
            className="w-full sm:flex-1"
            variant="outline"
            size="sm"
            render={<Link href={previewHref} />}
            nativeButton={false}
          >
            <ExternalLink className="mr-2 h-4 w-4" aria-hidden />
            Preview
          </Button>
        ) : null}

        <Button
          className={cn(
            "w-full",
            showPreview && !isBrowse ? "sm:flex-1" : "",
            isLocked && "cursor-not-allowed"
          )}
          variant={isLocked ? "secondary" : isSelected ? "default" : isBrowse ? "default" : "outline"}
          size="sm"
          disabled={isSelected || isSelecting || isLocked || (!onSelect && !onAction)}
          onClick={isLocked ? undefined : handleClick}
        >
          {isSelecting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
          ) : isSelected ? (
            <Check className="mr-2 h-4 w-4" aria-hidden />
          ) : null}
          {label}
        </Button>
      </CardFooter>
    </Card>
  );
}
