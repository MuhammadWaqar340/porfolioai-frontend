import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { isApiHostedAsset } from "@/lib/api/asset-url";
import { cn } from "@/lib/utils";

interface ProjectImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
}

export function ProjectImage({
  src,
  alt,
  title,
  className,
  imageClassName,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: ProjectImageProps) {
  const skipOptimization =
    src.startsWith("data:") ||
    src.startsWith("blob:") ||
    isApiHostedAsset(src);

  if (!src) {
    const initial = (title || alt).trim().charAt(0).toUpperCase();

    return (
      <div
        className={cn(
          "relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-primary/12 via-muted/80 to-violet-500/10",
          className
        )}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
          aria-hidden
        />
        {initial ? (
          <span className="relative text-5xl font-bold tracking-tight text-primary/35">
            {initial}
          </span>
        ) : (
          <ImageIcon className="relative h-10 w-10 text-muted-foreground/50" />
        )}
        <span className="sr-only">No project image</span>
      </div>
    );
  }

  return (
    <div className={cn("relative aspect-video overflow-hidden bg-muted", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className={cn("object-cover", imageClassName)}
        sizes={sizes}
        unoptimized={skipOptimization}
      />
    </div>
  );
}
