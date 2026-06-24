"use client";

import { useState } from "react";
import { ProjectImage } from "@/components/projects/project-image";
import { cn } from "@/lib/utils";

interface ProjectImageGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

export function ProjectImageGallery({
  images,
  title,
  className,
}: ProjectImageGalleryProps) {
  const galleryImages = images.filter((image) => image.trim());
  const [activeIndex, setActiveIndex] = useState(0);

  if (galleryImages.length === 0) {
    return (
      <ProjectImage
        src=""
        alt={title}
        title={title}
        className={cn("rounded-2xl border", className)}
        sizes="(max-width: 768px) 100vw, 768px"
      />
    );
  }

  const activeImage = galleryImages[activeIndex] ?? galleryImages[0];

  return (
    <div className={cn("space-y-3", className)}>
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <ProjectImage
          src={activeImage}
          alt={`${title} screenshot ${activeIndex + 1}`}
          imageClassName="max-h-[420px] object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>

      {galleryImages.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {galleryImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition",
                index === activeIndex
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border opacity-80 hover:opacity-100"
              )}
              aria-label={`View image ${index + 1}`}
              aria-pressed={index === activeIndex}
            >
              <ProjectImage
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                className="h-full w-full"
                imageClassName="h-full w-full object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
