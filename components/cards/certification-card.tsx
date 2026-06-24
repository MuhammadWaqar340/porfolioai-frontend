"use client";

import { Award, CalendarRange, ExternalLink } from "lucide-react";
import Link from "next/link";
import { CardOverlayActions } from "@/components/cards/card-overlay-actions";
import { ProjectImage } from "@/components/projects/project-image";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  formatCertificationDate,
  hasCertificationUrl,
} from "@/lib/certification-utils";
import type { Certification } from "@/types";
import { cn } from "@/lib/utils";

interface CertificationCardProps {
  certification: Certification;
  className?: string;
  onEdit?: (certification: Certification) => void;
  onRemove?: (certification: Certification) => void;
  onDragStart?: (event: React.DragEvent) => void;
  onDragEnd?: () => void;
}

export function CertificationCard({
  certification,
  className,
  onEdit,
  onRemove,
  onDragStart,
  onDragEnd,
}: CertificationCardProps) {
  const hasCredential = hasCertificationUrl(certification.credentialUrl);
  const hasMedia = Boolean(certification.mediaUrl?.trim());

  return (
    <Card
      className={cn(
        "group flex h-full flex-col overflow-hidden border-border/80 pb-0 transition-all duration-200",
        "hover:border-primary/20 hover:shadow-md",
        className
      )}
    >
      <div className="relative shrink-0">
        {hasMedia ? (
          <ProjectImage
            src={certification.mediaUrl}
            alt={certification.name}
            title={certification.name}
            imageClassName="transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-amber-500/10 via-muted/80 to-primary/10">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
                backgroundSize: "20px 20px",
              }}
              aria-hidden
            />
            <Award className="relative h-12 w-12 text-primary/40" />
          </div>
        )}

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent opacity-60 transition-opacity group-hover:opacity-80"
          aria-hidden
        />

        <CardOverlayActions
          dragLabel={`Reorder ${certification.name}`}
          editLabel={`Edit ${certification.name}`}
          removeLabel={`Remove ${certification.name}`}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onEdit={onEdit ? () => onEdit(certification) : undefined}
          onRemove={onRemove ? () => onRemove(certification) : undefined}
        />
      </div>

      <CardHeader className="space-y-2 pb-2">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight">
          {certification.name}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {certification.organization}
        </p>
      </CardHeader>

      <CardContent className="flex-1 pt-0">
        <Badge
          variant="secondary"
          className="gap-1.5 font-normal"
        >
          <CalendarRange className="h-3.5 w-3.5 text-primary/80" />
          {formatCertificationDate(certification)}
        </Badge>
      </CardContent>

      <CardFooter className="mt-auto border-t bg-muted/20 px-4 py-3">
        {hasCredential ? (
          <Link
            href={certification.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className:
                "w-full border-primary/40 bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
            })}
          >
            <ExternalLink className="mr-1.5 h-4 w-4 shrink-0" />
            <span className="truncate">View credential</span>
          </Link>
        ) : (
          <Button variant="outline" size="sm" className="w-full" disabled>
            <ExternalLink className="mr-1.5 h-4 w-4 shrink-0" />
            <span className="truncate">View credential</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
