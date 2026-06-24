"use client";

import { Check, ExternalLink, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProBadge } from "@/components/subscription/pro-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
}: TemplateCardProps) {
  const previewHref = getTemplateDemoPath(resolveTemplateSlug(template.slug), {
    from: previewFrom,
  });

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
      : (actionLabel ?? "Select Template");

  return (
    <Card
      className={cn(
        "group h-full overflow-hidden pb-0 transition-all hover:shadow-lg",
        isSelected && "ring-2 ring-primary shadow-md",
        isLocked && "opacity-95",
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
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
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {isSelected ? (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground shadow">
            <Check className="h-3.5 w-3.5" />
            Active
          </div>
        ) : template.isPremium ? (
          <div className="absolute right-3 top-3">
            <ProBadge />
          </div>
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        {showPreview ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex justify-center p-4 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow">
              <ExternalLink className="h-3.5 w-3.5" />
              Live preview
            </span>
          </div>
        ) : null}
      </div>
      <CardContent className="flex flex-1 flex-col p-4 pb-0">
        <h3 className="text-lg font-semibold">{template.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {template.description}
        </p>
      </CardContent>
      <div className="flex flex-col gap-2 px-4 pb-4 pt-4">
        {showPreview ? (
          <Button
            className="w-full"
            variant="outline"
            render={<Link href={previewHref} />}
            nativeButton={false}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Preview demo
          </Button>
        ) : null}
        <Button
          className={cn("w-full", isLocked && "cursor-not-allowed")}
          variant={isLocked ? "secondary" : isSelected ? "default" : "outline"}
          disabled={isSelected || isSelecting || isLocked || (!onSelect && !onAction)}
          onClick={isLocked ? undefined : handleClick}
        >
          {isSelecting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : isSelected ? (
            <Check className="mr-2 h-4 w-4" />
          ) : null}
          {label}
        </Button>
      </div>
    </Card>
  );
}
