"use client";

import { Pencil, Trash2, Video, X } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ProUpgradeCard } from "@/components/subscription/pro-upgrade-card";
import { IntroVideoPreview } from "@/components/portfolio/portfolio-intro-video";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError } from "@/components/ui/field-error";
import { FormAlert } from "@/components/ui/form-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useIntroVideo } from "@/hooks/use-intro-video";
import { useSubscription } from "@/hooks/use-subscription";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { useFormErrors } from "@/hooks/use-form-errors";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { INTRO_VIDEO_HELP, hasIntroVideoContent } from "@/lib/intro-video";
import { validateIntroVideo } from "@/lib/intro-video-validation";
import { notifyInfo } from "@/lib/toast";
import { useGenerateIntroScriptMutation } from "@/store/api/portfolioApi";
import { useTargetRole } from "@/store/hooks";
import type { IntroVideo } from "@/types";
import { cn } from "@/lib/utils";

type IntroVideoField = "introVideoUrl";

type IntroVideoFormData = IntroVideo;

function toFormData(introVideo: IntroVideo): IntroVideoFormData {
  return {
    introVideoUrl: introVideo.introVideoUrl,
    introVideoEnabled: introVideo.introVideoEnabled,
    introVideoScript: introVideo.introVideoScript,
  };
}

export function IntroVideoManager() {
  const { isPro } = useSubscription();
  const { introVideo, isLoaded, updateIntroVideo, deleteIntroVideo } = useIntroVideo();
  const [generateIntroScript, { isLoading: isGeneratingIntroScript }] =
    useGenerateIntroScriptMutation();
  const targetRole = useTargetRole();
  const { confirm, confirmDialog } = useConfirmDialog();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<IntroVideoFormData>(() =>
    toFormData(introVideo)
  );
  const [introScriptAiError, setIntroScriptAiError] = useState<string | null>(null);
  const {
    formError,
    clearAll,
    clearField,
    setValidationErrors,
    applyApiErrorOrFallback,
    getError,
  } = useFormErrors<IntroVideoField>();

  useEffect(() => {
    if (!isLoaded || isEditing) return;
    setFormData(toFormData(introVideo));
  }, [
    isLoaded,
    isEditing,
    introVideo.introVideoUrl,
    introVideo.introVideoEnabled,
    introVideo.introVideoScript,
  ]);

  function handleEdit() {
    setFormData(toFormData(introVideo));
    clearAll();
    setIntroScriptAiError(null);
    setIsEditing(true);
  }

  function handleCancel() {
    setFormData(toFormData(introVideo));
    clearAll();
    setIntroScriptAiError(null);
    setIsEditing(false);
  }

  async function handleSave() {
    clearAll();

    const validationErrors = validateIntroVideo(formData);
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors(validationErrors);
      return;
    }

    try {
      await updateIntroVideo({
        introVideoUrl: formData.introVideoUrl.trim(),
        introVideoEnabled: formData.introVideoEnabled,
        introVideoScript: formData.introVideoScript,
      });
      setIsEditing(false);
      clearAll();
    } catch (error) {
      applyApiErrorOrFallback(
        error,
        "Failed to save video introduction. Please try again."
      );
    }
  }

  function handleFieldChange<K extends keyof IntroVideoFormData>(
    field: K,
    value: IntroVideoFormData[K]
  ) {
    setFormData((current) => {
      const next = { ...current, [field]: value };
      if (field === "introVideoUrl" && typeof value === "string" && !value.trim()) {
        next.introVideoEnabled = false;
      }
      return next;
    });
    if (field === "introVideoUrl") {
      clearField("introVideoUrl");
    }
  }

  async function handleGenerateIntroScript() {
    setIntroScriptAiError(null);
    if (!isEditing) {
      setFormData(toFormData(introVideo));
      clearAll();
      setIsEditing(true);
    }

    try {
      const result = await generateIntroScript({
        target_role: targetRole,
      }).unwrap();
      setFormData((current) => ({ ...current, introVideoScript: result.content }));
      notifyInfo("AI teleprompter script added — record your video, then paste the link.");
    } catch (error) {
      setIntroScriptAiError(getApiErrorMessage(error));
    }
  }

  function requestDelete() {
    if (!hasIntroVideoContent(introVideo)) return;

    confirm({
      title: "Remove video introduction?",
      description:
        "This clears the URL, teleprompter script, and hides the video from your public portfolio.",
      confirmLabel: "Remove",
      variant: "destructive",
      onConfirm: async () => {
        clearAll();
        setIntroScriptAiError(null);

        try {
          const cleared = await deleteIntroVideo();
          setFormData(toFormData(cleared));
          setIsEditing(false);
          clearAll();
        } catch (error) {
          applyApiErrorOrFallback(
            error,
            "Failed to remove video introduction. Please try again."
          );
          throw error;
        }
      },
    });
  }

  const showDelete = hasIntroVideoContent(introVideo);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Video Introduction"
        description="Record a short intro, paste the link, and show it in its own section on your public portfolio."
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
          <div className="flex flex-wrap gap-2">
            {showDelete ? (
              <Button
                variant="outline"
                onClick={requestDelete}
                disabled={!isLoaded}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            ) : null}
            <Button onClick={handleEdit} disabled={!isLoaded}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        )}
      </PageHeader>

      <FormAlert message={formError} />

      {!isPro ? (
        <ProUpgradeCard
          title="Video introduction is a Pro feature"
          description="Embed a welcome video on your public portfolio with an optional AI teleprompter script."
          compact
        />
      ) : null}

      <Card className={cn(!isPro && "pointer-events-none opacity-60")}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Your intro video
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Record on Loom (fastest), or upload to YouTube or Vimeo. Use the AI
            script below as a teleprompter while recording.
          </p>

          <div className="flex items-center justify-between gap-4 rounded-lg border bg-muted/20 px-4 py-3">
            <div className="space-y-1">
              <Label htmlFor="introVideoEnabled">Show on public portfolio</Label>
              <p className="text-xs text-muted-foreground">
                Appears as a dedicated section below your hero.
              </p>
            </div>
            <Switch
              id="introVideoEnabled"
              checked={formData.introVideoEnabled}
              onCheckedChange={(checked) =>
                handleFieldChange("introVideoEnabled", checked)
              }
              disabled={!isEditing || !formData.introVideoUrl.trim()}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="introVideoUrl">Video URL</Label>
            <Input
              id="introVideoUrl"
              value={formData.introVideoUrl}
              onChange={(e) => {
                handleFieldChange("introVideoUrl", e.target.value);
                setIntroScriptAiError(null);
              }}
              placeholder="https://www.loom.com/share/..."
              readOnly={!isEditing}
              aria-invalid={Boolean(getError("introVideoUrl"))}
              className={cn(!isEditing && "bg-muted/50")}
            />
            <FieldError message={getError("introVideoUrl")} />
            <p className="text-xs text-muted-foreground">{INTRO_VIDEO_HELP}</p>
          </div>

          {formData.introVideoUrl.trim() ? (
            <IntroVideoPreview url={formData.introVideoUrl} />
          ) : null}

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label htmlFor="introVideoScript">Teleprompter script</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateIntroScript}
                disabled={isGeneratingIntroScript}
              >
                {isGeneratingIntroScript ? "Generating..." : "Generate script with AI"}
              </Button>
            </div>
            <Textarea
              id="introVideoScript"
              value={formData.introVideoScript}
              onChange={(e) => {
                handleFieldChange("introVideoScript", e.target.value);
                setIntroScriptAiError(null);
              }}
              rows={8}
              readOnly={!isEditing}
              placeholder="Optional ~60 second script to read while recording."
              className={cn(!isEditing && "bg-muted/50")}
            />
            {introScriptAiError ? (
              <p className="text-sm text-destructive">{introScriptAiError}</p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {confirmDialog}
    </div>
  );
}
