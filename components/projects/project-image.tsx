import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { isApiHostedAsset } from "@/lib/api/asset-url";
import { projectPlaceholderHue } from "@/lib/project-utils";
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
    const label = (title || alt).trim();
    const initial = label.charAt(0).toUpperCase();
    const hue = projectPlaceholderHue(label);

    return (
      <div
        className={cn(
          "relative flex aspect-video items-center justify-center overflow-hidden bg-muted/60",
          className
        )}
        style={{
          backgroundImage: `linear-gradient(135deg, hsl(${hue} 62% 48% / 0.22) 0%, hsl(${(hue + 48) % 360} 55% 38% / 0.12) 45%, hsl(${(hue + 96) % 360} 50% 32% / 0.08) 100%)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "18px 18px",
          }}
          aria-hidden
        />
        <div
          className="absolute -right-6 -top-6 h-28 w-28 rounded-full blur-2xl"
          style={{ backgroundColor: `hsl(${hue} 70% 55% / 0.25)` }}
          aria-hidden
        />
        {initial ? (
          <span
            className="relative text-5xl font-bold tracking-tight"
            style={{ color: `hsl(${hue} 55% 72% / 0.55)` }}
          >
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
