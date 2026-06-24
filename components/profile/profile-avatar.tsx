"use client";

import { User } from "lucide-react";
import Image from "next/image";
import { isApiHostedAsset } from "@/lib/api/asset-url";
import { getProfileInitials, hasProfileAvatar } from "@/lib/profile-avatar";
import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "size-9 text-xs",
  lg: "size-24 text-2xl",
  md: "size-32 text-3xl",
} as const;

interface ProfileAvatarProps {
  src?: string | null;
  alt: string;
  size?: keyof typeof sizeClasses;
  className?: string;
  priority?: boolean;
  isLoading?: boolean;
}

export function ProfileAvatar({
  src,
  alt,
  size = "md",
  className,
  priority = false,
  isLoading = false,
}: ProfileAvatarProps) {
  const showImage = hasProfileAvatar(src);
  const initials = getProfileInitials(alt);
  const isLocalImage =
    src?.startsWith("blob:") || src?.startsWith("data:") || false;
  const skipImageOptimization =
    isLocalImage || (src ? isApiHostedAsset(src) : false);

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full",
        sizeClasses[size],
        className
      )}
    >
      {isLoading ? (
        <div className="size-full animate-pulse bg-muted" aria-hidden />
      ) : showImage && src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={
            size === "sm" ? "36px" : size === "lg" ? "96px" : "128px"
          }
          priority={priority}
          unoptimized={skipImageOptimization}
        />
      ) : (
        <div
          className="flex size-full items-center justify-center bg-gradient-to-br from-primary/25 via-primary/15 to-violet-500/20 text-primary"
          aria-label={alt ? `${alt} avatar` : "Default profile avatar"}
        >
          {initials ? (
            <span className="font-semibold tracking-tight">{initials}</span>
          ) : (
            <User
              className={cn(
                size === "sm" ? "size-4" : size === "lg" ? "size-10" : "size-12"
              )}
              aria-hidden
            />
          )}
        </div>
      )}
    </div>
  );
}
