"use client";

import { Code2, Globe, Link2, Mail, MapPin, Pencil, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AITextMenu } from "@/components/ai/ai-text-menu";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError } from "@/components/ui/field-error";
import { FormAlert } from "@/components/ui/form-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/hooks/use-profile";
import { useFormErrors } from "@/hooks/use-form-errors";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { validateProfile } from "@/lib/form-validation";
import { notifyInfo } from "@/lib/toast";
import {
  useDeleteAvatarMutation,
  useGenerateAboutMutation,
  useSuggestTitleMutation,
} from "@/store/api/portfolioApi";
import { useTargetRole } from "@/store/hooks";
import type { Profile } from "@/types";
import { cn } from "@/lib/utils";

const MAX_PHOTO_SIZE_MB = 5;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type ProfileFormData = Pick<
  Profile,
  | "fullName"
  | "title"
  | "about"
  | "email"
  | "phone"
  | "location"
  | "linkedin"
  | "github"
  | "website"
>;

type ProfileField =
  | "fullName"
  | "email"
  | "phone"
  | "linkedin"
  | "github"
  | "website"
  | "avatar";

const profileValidationFieldMap: Partial<
  Record<keyof ProfileFormData, ProfileField>
> = {
  fullName: "fullName",
  email: "email",
  phone: "phone",
  linkedin: "linkedin",
  github: "github",
  website: "website",
};

function toFormData(profile: Profile): ProfileFormData {
  return {
    fullName: profile.fullName,
    title: profile.title,
    about: profile.about,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    linkedin: profile.linkedin,
    github: profile.github,
    website: profile.website,
  };
}

export function ProfileEditor() {
  const { profile, isLoaded, replaceProfile, uploadAvatar } = useProfile();
  const [generateAbout, { isLoading: isGeneratingAbout }] =
    useGenerateAboutMutation();
  const [suggestTitle, { isLoading: isSuggestingTitle }] =
    useSuggestTitleMutation();
  const [deleteAvatar, { isLoading: isDeletingAvatar }] =
    useDeleteAvatarMutation();
  const targetRole = useTargetRole();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingAvatarFileRef = useRef<File | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>(() =>
    toFormData(profile)
  );
  const [avatarPreview, setAvatarPreview] = useState(profile.avatarUrl);
  const [aboutAiError, setAboutAiError] = useState<string | null>(null);
  const [titleAiError, setTitleAiError] = useState<string | null>(null);
  const {
    formError,
    clearAll,
    clearField,
    setValidationErrors,
    applyApiErrorOrFallback,
    getError,
  } = useFormErrors<ProfileField>();

  useEffect(() => {
    if (!isLoaded || isEditing) return;
    setFormData(toFormData(profile));
    setAvatarPreview(profile.avatarUrl);
  }, [isLoaded, isEditing, profile.id, profile.avatarUrl, profile.fullName, profile.title, profile.about, profile.email, profile.phone, profile.location, profile.linkedin, profile.github, profile.website]);

  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  async function handleRemovePhoto() {
    clearField("avatar");
    pendingAvatarFileRef.current = null;

    if (avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }

    try {
      await deleteAvatar().unwrap();
      setAvatarPreview("");
    } catch (error) {
      applyApiErrorOrFallback(
        error,
        getApiErrorMessage(error, "Could not remove profile photo.")
      );
      setAvatarPreview(profile.avatarUrl);
    }
  }

  async function applyPhotoPreview(file: File, previewUrl: string) {
    setAvatarPreview(previewUrl);
    clearField("avatar");

    if (!isEditing) {
      try {
        const avatarUrl = await uploadAvatar(file);
        setAvatarPreview(avatarUrl);
      } catch (error) {
        applyApiErrorOrFallback(
          error,
          "Failed to upload profile photo. Please try again."
        );
      }
      return;
    }

    pendingAvatarFileRef.current = file;
  }

  function handleEdit() {
    setFormData(toFormData(profile));
    setAvatarPreview(profile.avatarUrl);
    clearAll();
    setIsEditing(true);
  }

  function handleCancel() {
    if (avatarPreview.startsWith("blob:") && avatarPreview !== profile.avatarUrl) {
      URL.revokeObjectURL(avatarPreview);
    }
    pendingAvatarFileRef.current = null;
    setFormData(toFormData(profile));
    setAvatarPreview(profile.avatarUrl);
    clearAll();
    setIsEditing(false);
  }

  async function handleSave() {
    clearAll();

    const validationErrors = validateProfile(formData);
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors(validationErrors);
      return;
    }

    try {
      let avatarUrl = profile.avatarUrl;

      if (pendingAvatarFileRef.current) {
        avatarUrl = await uploadAvatar(pendingAvatarFileRef.current);
        pendingAvatarFileRef.current = null;
      }

      const updated: Profile = {
        ...profile,
        ...formData,
        avatarUrl,
      };

      await replaceProfile(updated);
      setAvatarPreview(avatarUrl);
      setIsEditing(false);
      clearAll();
    } catch (error) {
      applyApiErrorOrFallback(
        error,
        "Failed to save profile. Please try again."
      );
    }
  }

  function handleFieldChange(
    field: keyof ProfileFormData,
    value: string
  ) {
    setFormData((current) => ({ ...current, [field]: value }));
    const mappedField = profileValidationFieldMap[field];
    if (mappedField) {
      clearField(mappedField);
    }
  }

  function handlePhotoClick() {
    fileInputRef.current?.click();
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setValidationErrors({
        avatar: "Please upload a JPG, PNG, WebP, or GIF image.",
      });
      return;
    }

    if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
      setValidationErrors({
        avatar: `Image must be smaller than ${MAX_PHOTO_SIZE_MB}MB.`,
      });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    void applyPhotoPreview(file, previewUrl);
  }

  async function handleGenerateAbout() {
    setAboutAiError(null);

    const promptParts = [
      formData.title.trim() &&
        `Professional title: ${formData.title.trim()}`,
      formData.about.trim()
        ? "Improve and expand the existing about section while keeping my voice."
        : "Write a new about section for my portfolio.",
    ].filter(Boolean);

    try {
      const result = await generateAbout({
        prompt: promptParts.join(" "),
      }).unwrap();
      setFormData((current) => ({ ...current, about: result.content }));
      notifyInfo("AI draft added to About — review and save when ready.");
    } catch (error) {
      setAboutAiError(getApiErrorMessage(error));
    }
  }

  async function handleSuggestTitle() {
    setTitleAiError(null);
    try {
      const result = await suggestTitle({
        target_role: targetRole,
      }).unwrap();
      if (result.titles[0]) {
        setFormData((current) => ({ ...current, title: result.titles[0] }));
        notifyInfo("AI title suggestion applied — review and save.");
      }
    } catch (error) {
      setTitleAiError(getApiErrorMessage(error));
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Profile"
        description="Manage your personal information and social links."
      >
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        ) : (
          <Button onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </PageHeader>

      <FormAlert message={formError} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile Image</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <ProfileAvatar
              src={avatarPreview}
              alt={formData.fullName || profile.fullName}
              size="lg"
              className="border-4 border-muted"
              isLoading={!isLoaded}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
              className="hidden"
              onChange={handlePhotoChange}
            />
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={handlePhotoClick}
            >
              Change Photo
            </Button>
            {avatarPreview ? (
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={handleRemovePhoto}
                disabled={isDeletingAvatar}
              >
                Remove Photo
              </Button>
            ) : null}
            <FieldError message={getError("avatar")} />
            {isEditing && (
              <p className="text-center text-xs text-muted-foreground">
                Photo changes are saved when you click Save Changes.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex min-h-8 items-center">
                  <Label htmlFor="fullName">Full Name</Label>
                </div>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleFieldChange("fullName", e.target.value)}
                  readOnly={!isEditing}
                  aria-invalid={Boolean(getError("fullName"))}
                  className={cn(!isEditing && "bg-muted/50")}
                />
                <FieldError message={getError("fullName")} />
              </div>
              <div className="space-y-2">
                <div className="flex min-h-8 flex-wrap items-center justify-between gap-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <AITextMenu
                    fieldType="title"
                    text={formData.title}
                    onApply={(content) => {
                      handleFieldChange("title", content);
                      notifyInfo("AI draft applied — review and save.");
                    }}
                    onGenerate={handleSuggestTitle}
                    generateLabel="Suggest title"
                    isGenerating={isSuggestingTitle}
                    disabled={!isEditing}
                    disabledTitle="Click Edit to use AI"
                  />
                </div>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  readOnly={!isEditing}
                  className={cn(!isEditing && "bg-muted/50")}
                />
                {titleAiError && (
                  <p className="text-sm text-destructive">{titleAiError}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label htmlFor="about">About Me</Label>
                <AITextMenu
                  fieldType="about"
                  text={formData.about}
                  onApply={(content) => {
                    handleFieldChange("about", content);
                    notifyInfo("AI draft applied — review and save.");
                  }}
                  onGenerate={handleGenerateAbout}
                  generateLabel="Generate about"
                  isGenerating={isGeneratingAbout}
                  disabled={!isEditing}
                  disabledTitle="Click Edit to use AI"
                />
              </div>
              <Textarea
                id="about"
                value={formData.about}
                onChange={(e) => {
                  handleFieldChange("about", e.target.value);
                  setAboutAiError(null);
                }}
                rows={4}
                readOnly={!isEditing}
                className={cn(!isEditing && "bg-muted/50")}
              />
              {aboutAiError && (
                <p className="text-sm text-destructive">{aboutAiError}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="mr-1.5 inline h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  readOnly={!isEditing}
                  aria-invalid={Boolean(getError("email"))}
                  className={cn(!isEditing && "bg-muted/50")}
                />
                <FieldError message={getError("email")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="mr-1.5 inline h-4 w-4" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                  readOnly={!isEditing}
                  aria-invalid={Boolean(getError("phone"))}
                  className={cn(!isEditing && "bg-muted/50")}
                />
                <FieldError message={getError("phone")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                <MapPin className="mr-1.5 inline h-4 w-4" />
                Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleFieldChange("location", e.target.value)}
                readOnly={!isEditing}
                className={cn(!isEditing && "bg-muted/50")}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="linkedin">
                  <Link2 className="mr-1.5 inline h-4 w-4" />
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) => handleFieldChange("linkedin", e.target.value)}
                  readOnly={!isEditing}
                  aria-invalid={Boolean(getError("linkedin"))}
                  className={cn(!isEditing && "bg-muted/50")}
                />
                <FieldError message={getError("linkedin")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">
                  <Code2 className="mr-1.5 inline h-4 w-4" />
                  GitHub
                </Label>
                <Input
                  id="github"
                  value={formData.github}
                  onChange={(e) => handleFieldChange("github", e.target.value)}
                  readOnly={!isEditing}
                  aria-invalid={Boolean(getError("github"))}
                  className={cn(!isEditing && "bg-muted/50")}
                />
                <FieldError message={getError("github")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">
                <Globe className="mr-1.5 inline h-4 w-4" />
                Website
              </Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleFieldChange("website", e.target.value)}
                readOnly={!isEditing}
                aria-invalid={Boolean(getError("website"))}
                className={cn(!isEditing && "bg-muted/50")}
              />
              <FieldError message={getError("website")} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
