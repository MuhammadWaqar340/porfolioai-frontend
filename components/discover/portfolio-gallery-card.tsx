"use client";

import { Briefcase, Wrench } from "lucide-react";
import Link from "next/link";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { resolveAssetUrl } from "@/lib/api/asset-url";
import type { PublicPortfolioGalleryItem } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface PortfolioGalleryCardProps {
  item: PublicPortfolioGalleryItem;
  className?: string;
}

export function PortfolioGalleryCard({ item, className }: PortfolioGalleryCardProps) {
  const avatarUrl = item.avatar_url ? resolveAssetUrl(item.avatar_url) : null;

  return (
    <Link href={`/${item.username}`} className={cn("group block h-full", className)}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3">
          <ProfileAvatar
            src={avatarUrl}
            alt={item.full_name}
            className="h-14 w-14 shrink-0 text-base"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold group-hover:text-primary">{item.full_name}</p>
            <p className="truncate text-sm text-muted-foreground">{item.title}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">/{item.username}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {item.about_preview ? (
            <p className="line-clamp-3 text-sm text-muted-foreground">{item.about_preview}</p>
          ) : (
            <p className="text-sm italic text-muted-foreground">No about section yet.</p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1 tabular-nums">
              <Briefcase className="h-3 w-3" />
              {item.projects_count}
            </Badge>
            <Badge variant="secondary" className="gap-1 tabular-nums">
              <Wrench className="h-3 w-3" />
              {item.skills_count}
            </Badge>
            {item.template_slug ? (
              <Badge variant="outline" className="capitalize">
                {item.template_slug}
              </Badge>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
