"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { AITextMenu } from "@/components/ai/ai-text-menu";
import { SkillBadge } from "@/components/cards/skill-badge";
import {
  createProjectImageDraftsFromUrls,
  ProjectImagesField,
  resolveProjectImageDrafts,
  type ProjectImageDraft,
} from "@/components/projects/project-images-field";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { FormAlert } from "@/components/ui/form-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { NewProject } from "@/hooks/use-projects";
import { useFormErrors } from "@/hooks/use-form-errors";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { resolveAssetUrl } from "@/lib/api/asset-url";
import { validateProject } from "@/lib/form-validation";
import {
  useGenerateProjectDescriptionMutation,
  useSuggestTechnologiesMutation,
  useUploadProjectImageMutation,
} from "@/store/api/portfolioApi";
import type { Project } from "@/types";

interface ProjectFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
  onSubmit: (project: NewProject) => void | Promise<void>;
}

const emptyForm = {
  title: "",
  description: "",
  githubUrl: "",
  liveUrl: "",
};

type ProjectField =
  | "title"
  | "description"
  | "imageUrl"
  | "githubUrl"
  | "liveUrl"
  | "technologies";

export function ProjectFormSheet({
  open,
  onOpenChange,
  project,
  onSubmit,
}: ProjectFormSheetProps) {
  const isEditing = Boolean(project);
  const [uploadProjectImage, { isLoading: isUploading }] =
    useUploadProjectImageMutation();
  const [generateProjectDescription, { isLoading: isGeneratingDescription }] =
    useGenerateProjectDescriptionMutation();
  const [suggestTechnologies, { isLoading: isSuggestingTech }] =
    useSuggestTechnologiesMutation();

  const [form, setForm] = useState(emptyForm);
  const [imageDrafts, setImageDrafts] = useState<ProjectImageDraft[]>([]);
  const [techInput, setTechInput] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [descriptionAiError, setDescriptionAiError] = useState<string | null>(
    null
  );
  const [techAiError, setTechAiError] = useState<string | null>(null);
  const {
    formError,
    clearAll,
    clearField,
    setValidationErrors,
    applyApiErrorOrFallback,
    getError,
  } = useFormErrors<ProjectField>();

  useEffect(() => {
    if (!open) {
      setForm(emptyForm);
      setImageDrafts([]);
      setTechInput("");
      setTechnologies([]);
      clearAll();
      setIsSubmitting(false);
      return;
    }

    if (project) {
      setForm({
        title: project.title,
        description: project.description,
        githubUrl: project.githubUrl,
        liveUrl: project.liveUrl,
      });
      setImageDrafts(
        createProjectImageDraftsFromUrls(
          project.imageUrls.length > 0 ? project.imageUrls : [project.imageUrl]
        )
      );
      setTechnologies(project.technologies);
    } else {
      setForm(emptyForm);
      setImageDrafts([]);
      setTechnologies([]);
    }

    setTechInput("");
    setDescriptionAiError(null);
    clearAll();
  }, [open, project, clearAll]);

  function updateForm<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    clearField(key as ProjectField);
  }

  function addTechnology() {
    const trimmed = techInput.trim();

    if (!trimmed) {
      setValidationErrors({ technologies: "Please enter a technology name." });
      return;
    }

    const isDuplicate = technologies.some(
      (tech) => tech.toLowerCase() === trimmed.toLowerCase()
    );

    if (isDuplicate) {
      setValidationErrors({
        technologies: `"${trimmed}" is already in your list.`,
      });
      return;
    }

    setTechnologies((current) => [...current, trimmed]);
    setTechInput("");
    clearField("technologies");
  }

  function removeTechnology(name: string) {
    setTechnologies((current) => current.filter((tech) => tech !== name));
    clearField("technologies");
  }

  function handleTechInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTechnology();
    }
  }

  async function handleGenerateDescription() {
    setDescriptionAiError(null);

    const noteParts = [
      form.description.trim(),
      form.githubUrl.trim() && `GitHub: ${form.githubUrl.trim()}`,
      form.liveUrl.trim() && `Live demo: ${form.liveUrl.trim()}`,
    ].filter(Boolean);

    try {
      const result = await generateProjectDescription({
        title: form.title.trim(),
        notes: noteParts.join("\n") || "No extra notes yet.",
        technologies,
      }).unwrap();
      updateForm("description", result.content);
    } catch (error) {
      setDescriptionAiError(getApiErrorMessage(error));
    }
  }

  async function handleSuggestTechnologies() {
    setTechAiError(null);
    try {
      const result = await suggestTechnologies({
        title: form.title.trim(),
        notes: form.description.trim(),
      }).unwrap();
      const merged = [...technologies];
      for (const tech of result.technologies) {
        if (!merged.some((t) => t.toLowerCase() === tech.toLowerCase())) {
          merged.push(tech);
        }
      }
      setTechnologies(merged);
    } catch (error) {
      setTechAiError(getApiErrorMessage(error));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearAll();

    const persistedUrls = imageDrafts
      .filter((image) => !image.file)
      .map((image) => image.persistedUrl ?? image.previewUrl)
      .filter(Boolean);

    const validationErrors = validateProject({
      title: form.title,
      description: form.description,
      imageUrl: persistedUrls[0] ?? "",
      imageUrls: persistedUrls,
      pendingImageCount: imageDrafts.filter((image) => image.file).length,
      githubUrl: form.githubUrl,
      liveUrl: form.liveUrl,
    });

    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const imageUrls = await resolveProjectImageDrafts(
        imageDrafts,
        async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          const result = await uploadProjectImage(formData).unwrap();
          return resolveAssetUrl(result.image_url);
        }
      );

      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        imageUrl: imageUrls[0] ?? "",
        imageUrls,
        technologies,
        githubUrl: form.githubUrl.trim(),
        liveUrl: form.liveUrl.trim(),
      });

      onOpenChange(false);
    } catch (error) {
      if (error instanceof Error && error.message === "INVALID_PROJECT_IMAGE") {
        setValidationErrors({
          imageUrl: "Please re-upload one or more project images.",
        });
        return;
      }

      applyApiErrorOrFallback(
        error,
        "Failed to save project. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const isBusy = isSubmitting || isUploading;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Project" : "Add Project"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update your project details and save your changes."
              : "Add a new project to your portfolio. Fill in the details below."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-4 pb-10">
          <FormAlert message={formError} />

          <div className="space-y-2">
            <Label htmlFor="projectTitle">Project title</Label>
            <Input
              id="projectTitle"
              placeholder="e.g. E-Commerce Platform"
              value={form.title}
              onChange={(e) => updateForm("title", e.target.value)}
              aria-invalid={Boolean(getError("title"))}
              autoFocus
            />
            <FieldError message={getError("title")} />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label htmlFor="projectDescription">Description</Label>
              <AITextMenu
                fieldType="project_description"
                text={form.description}
                onApply={(content) => updateForm("description", content)}
                onGenerate={handleGenerateDescription}
                generateLabel="Generate description"
                isGenerating={isGeneratingDescription}
              />
            </div>
            <Textarea
              id="projectDescription"
              placeholder="Describe what the project does and your role..."
              value={form.description}
              onChange={(e) => {
                updateForm("description", e.target.value);
                setDescriptionAiError(null);
              }}
              aria-invalid={Boolean(getError("description"))}
              rows={4}
              className="max-h-52 min-h-[140px] resize-none overflow-y-auto overflow-x-auto leading-relaxed [field-sizing:fixed]"
            />
            {descriptionAiError && (
              <p className="text-sm text-destructive">{descriptionAiError}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Uses your title, technologies, and any notes already in the
              description field.
            </p>
            <FieldError message={getError("description")} />
          </div>

          <div className="space-y-2">
            <Label>Project images</Label>
            <ProjectImagesField
              images={imageDrafts}
              onChange={setImageDrafts}
              onClearError={() => clearField("imageUrl")}
              onValidationError={(message) =>
                setValidationErrors({ imageUrl: message })
              }
              error={getError("imageUrl")}
              disabled={isBusy}
            />
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label htmlFor="technology">Technologies</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isSuggestingTech}
                onClick={() => void handleSuggestTechnologies()}
              >
                {isSuggestingTech ? "Suggesting…" : "Suggest with AI"}
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                id="technology"
                className="min-w-0 flex-1"
                placeholder="e.g. Next.js"
                value={techInput}
                onChange={(e) => {
                  setTechInput(e.target.value);
                  clearField("technologies");
                }}
                aria-invalid={Boolean(getError("technologies"))}
                onKeyDown={handleTechInputKeyDown}
              />
              <Button
                type="button"
                size="icon"
                onClick={addTechnology}
                aria-label="Add technology"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="min-h-16 rounded-lg border bg-muted/30 p-3">
              {technologies.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No technologies added yet.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <SkillBadge
                      key={tech}
                      name={tech}
                      onRemove={() => removeTechnology(tech)}
                    />
                  ))}
                </div>
              )}
            </div>
            {techAiError && (
              <p className="text-sm text-destructive">{techAiError}</p>
            )}
            <FieldError message={getError("technologies")} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="githubUrl" className="min-h-11 flex-col items-start leading-snug">
                GitHub URL{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="githubUrl"
                placeholder="https://github.com/..."
                value={form.githubUrl}
                onChange={(e) => updateForm("githubUrl", e.target.value)}
                aria-invalid={Boolean(getError("githubUrl"))}
              />
              <FieldError message={getError("githubUrl")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="liveUrl" className="min-h-11 flex-col items-start leading-snug">
                Live demo URL{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="liveUrl"
                placeholder="https://..."
                value={form.liveUrl}
                onChange={(e) => updateForm("liveUrl", e.target.value)}
                aria-invalid={Boolean(getError("liveUrl"))}
              />
              <FieldError message={getError("liveUrl")} />
            </div>
          </div>

          <SheetFooter className="px-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isBusy}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isBusy}>
              {isBusy
                ? isUploading
                  ? "Uploading images..."
                  : "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Add Project"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
