"use client";

import { ChevronLeft, ChevronRight, Star, Upload, X } from "lucide-react";
import { useRef } from "react";
import { ProjectImage } from "@/components/projects/project-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ACCEPTED_PROJECT_IMAGE_TYPES,
  MAX_PROJECT_IMAGES,
  MAX_PROJECT_IMAGE_SIZE_MB,
} from "@/constants/projects";

export type ProjectImageDraft = {
  id: string;
  previewUrl: string;
  persistedUrl?: string;
  file?: File;
};

interface ProjectImagesFieldProps {
  images: ProjectImageDraft[];
  onChange: (images: ProjectImageDraft[]) => void;
  onClearError?: () => void;
  onValidationError?: (message: string) => void;
  error?: string | null;
  disabled?: boolean;
}

function createDraftId() {
  return `project-image-${crypto.randomUUID()}`;
}

export function createProjectImageDraftsFromUrls(urls: string[]): ProjectImageDraft[] {
  return urls
    .filter((url) => url.trim())
    .map((url) => ({
      id: createDraftId(),
      previewUrl: url,
      persistedUrl: url,
    }));
}

export function ProjectImagesField({
  images,
  onChange,
  onClearError,
  onValidationError,
  error,
  disabled = false,
}: ProjectImagesFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function updateImages(nextImages: ProjectImageDraft[]) {
    onChange(nextImages);
    onClearError?.();
  }

  function handleFilesSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) return;

    const remainingSlots = MAX_PROJECT_IMAGES - images.length;
    if (remainingSlots <= 0) {
      return;
    }

    const acceptedFiles = files.slice(0, remainingSlots);
    const nextImages = [...images];
    let validationError: string | null = null;

    for (const file of acceptedFiles) {
      if (
        !ACCEPTED_PROJECT_IMAGE_TYPES.includes(
          file.type as (typeof ACCEPTED_PROJECT_IMAGE_TYPES)[number]
        )
      ) {
        validationError = "Please upload JPG, PNG, WebP, or GIF images only.";
        continue;
      }

      if (file.size > MAX_PROJECT_IMAGE_SIZE_MB * 1024 * 1024) {
        validationError = `Each image must be smaller than ${MAX_PROJECT_IMAGE_SIZE_MB}MB.`;
        continue;
      }

      nextImages.push({
        id: createDraftId(),
        previewUrl: URL.createObjectURL(file),
        file,
      });
    }

    updateImages(nextImages);

    if (validationError) {
      onValidationError?.(validationError);
    }
  }

  function removeImage(id: string) {
    const target = images.find((image) => image.id === id);
    if (target?.file && target.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(target.previewUrl);
    }
    updateImages(images.filter((image) => image.id !== id));
  }

  function moveImage(id: string, direction: -1 | 1) {
    const index = images.findIndex((image) => image.id === id);
    const targetIndex = index + direction;
    if (index === -1 || targetIndex < 0 || targetIndex >= images.length) {
      return;
    }

    const nextImages = [...images];
    const [moved] = nextImages.splice(index, 1);
    nextImages.splice(targetIndex, 0, moved);
    updateImages(nextImages);
  }

  const canAddMore = images.length < MAX_PROJECT_IMAGES;

  return (
    <div className="space-y-3">
      {images.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg border bg-muted/20"
            >
              <ProjectImage
                src={image.previewUrl}
                alt={`Project image ${index + 1}`}
                className="rounded-lg"
                sizes="(max-width: 512px) 100vw, 256px"
              />

              {index === 0 ? (
                <Badge className="absolute left-2 top-2 gap-1 shadow-sm">
                  <Star className="h-3 w-3 fill-current" />
                  Cover
                </Badge>
              ) : null}

              <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                <div className="flex gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 bg-background/90"
                    disabled={disabled || index === 0}
                    onClick={() => moveImage(image.id, -1)}
                    aria-label="Move image earlier"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 bg-background/90"
                    disabled={disabled || index === images.length - 1}
                    onClick={() => moveImage(image.id, 1)}
                    aria-label="Move image later"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  disabled={disabled}
                  onClick={() => removeImage(image.id)}
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed bg-muted/20 px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Upload one or more images for this project.
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_PROJECT_IMAGE_TYPES.join(",")}
        className="hidden"
        multiple
        onChange={handleFilesSelected}
      />

      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={disabled || !canAddMore}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        {images.length === 0 ? "Upload images" : "Add more images"}
      </Button>

      <p className="text-xs text-muted-foreground">
        {images.length}/{MAX_PROJECT_IMAGES} images. The first image is used as
        the cover on project cards.
      </p>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

export async function resolveProjectImageDrafts(
  images: ProjectImageDraft[],
  uploadFile: (file: File) => Promise<string>
): Promise<string[]> {
  const resolved: string[] = [];

  for (const image of images) {
    if (image.file) {
      resolved.push(await uploadFile(image.file));
      continue;
    }

    const storedUrl = image.persistedUrl ?? image.previewUrl;
    if (
      storedUrl.startsWith("blob:") ||
      storedUrl.startsWith("data:")
    ) {
      throw new Error("INVALID_PROJECT_IMAGE");
    }

    resolved.push(storedUrl);
  }

  return resolved;
}
