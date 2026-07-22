"use client";

import { BadgeCheck, Building2, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { resolveAssetUrl } from "@/lib/api/asset-url";
import type { PublicCompanyGalleryItem } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface OrganizationGalleryCardProps {
  item: PublicCompanyGalleryItem;
  className?: string;
}

export function OrganizationGalleryCard({
  item,
  className,
}: OrganizationGalleryCardProps) {
  const logoUrl = item.logo_url ? resolveAssetUrl(item.logo_url) : null;

  return (
    <Link
      href={`/companies/${item.slug}`}
      className={cn("group block h-full", className)}
    >
      <Card className="h-full border-border/60 bg-card/75 shadow-[var(--shadow-card)] backdrop-blur-md transition-all duration-300 supports-[backdrop-filter]:bg-card/65 hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)]">
        <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-muted/40">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-1.5">
              <p className="truncate font-semibold group-hover:text-primary">
                {item.name}
              </p>
              {item.is_verified ? (
                <Badge
                  className="shrink-0 gap-1 bg-blue-500/15 px-1.5 py-0 text-[10px] font-medium text-blue-700 dark:text-blue-300"
                  title="Verified organization"
                >
                  <BadgeCheck className="h-3 w-3" aria-hidden />
                  Verified
                </Badge>
              ) : null}
            </div>
            {item.industry ? (
              <p className="truncate text-sm text-muted-foreground">
                {item.industry}
              </p>
            ) : (
              <p className="truncate text-sm text-muted-foreground">
                Organization
              </p>
            )}
            <p className="mt-1 truncate text-xs text-muted-foreground">
              /companies/{item.slug}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {item.about_preview ? (
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {item.about_preview}
            </p>
          ) : (
            <p className="text-sm italic text-muted-foreground">
              No about section yet.
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1 tabular-nums">
              <Users className="h-3 w-3" />
              {item.member_count}{" "}
              {item.member_count === 1 ? "member" : "members"}
            </Badge>
            {item.location ? (
              <Badge variant="outline" className="gap-1 max-w-full">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{item.location}</span>
              </Badge>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
