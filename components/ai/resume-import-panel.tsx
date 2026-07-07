"use client";

import { FileText, Loader2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SKILL_CATEGORIES } from "@/constants/skills";
import { useProfile } from "@/hooks/use-profile";
import { useResumeImport } from "@/hooks/use-resume-import";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { notifyInfo, notifySuccess } from "@/lib/toast";
import {
  getDefaultApplySections,
  summarizeResumeDraft,
  type ResumeApplySection,
} from "@/lib/resume-import";
import {
  isPlainTextResumeFile,
  RESUME_FILE_ACCEPT,
  RESUME_FILE_LABEL,
} from "@/lib/resume-file-types";
import { useGetAIStatusQuery } from "@/store/api/portfolioApi";

const SECTION_LABELS: Record<ResumeApplySection, string> = {
  profile: "Profile (name, title, about)",
  skills: "Skills",
  experiences: "Work experience",
  projects: "Projects",
  education: "Education",
};

export function ResumeImportPanel() {
  const { data: aiStatus } = useGetAIStatusQuery();
  const { profile } = useProfile();
  const {
    draft,
    provider,
    isExtracting,
    isParsingFile,
    isApplying,
    extractFromText,
    loadFromFile,
    applyDraft,
    clearDraft,
  } = useResumeImport();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadedResumeTextRef = useRef("");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSections, setSelectedSections] = useState<ResumeApplySection[]>(
    []
  );
  const [overwriteProfile, setOverwriteProfile] = useState(false);

  const aiReady = aiStatus?.available ?? false;
  const isBusy = isExtracting || isParsingFile;
  const canExtract =
    aiReady && Boolean(uploadedFileName) && uploadedResumeTextRef.current.trim().length >= 50;

  function clearUploadedFile() {
    uploadedResumeTextRef.current = "";
    setUploadedFileName(null);
  }

  useEffect(() => {
    if (draft) {
      setSelectedSections(getDefaultApplySections(draft));
    }
  }, [draft]);

  async function handleExtract() {
    setError(null);
    clearDraft();
    try {
      await extractFromText(uploadedResumeTextRef.current);
      if (uploadedFileName) {
        notifySuccess(`Draft extracted from "${uploadedFileName}". Review below.`);
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    clearDraft();
    clearUploadedFile();

    try {
      let text: string;
      let filename: string;

      if (isPlainTextResumeFile(file.name)) {
        text = await file.text();
        filename = file.name;
      } else {
        const result = await loadFromFile(file);
        text = result.text;
        filename = result.filename;
      }

      if (text.trim().length < 50) {
        setError("The file does not contain enough text (minimum 50 characters).");
        return;
      }

      uploadedResumeTextRef.current = text;
      setUploadedFileName(filename);

      if (!aiReady) {
        notifyInfo(
          `"${filename}" uploaded. Start your AI provider, then click Extract draft.`
        );
        return;
      }

      await extractFromText(text);
      notifySuccess(`Draft extracted from "${filename}". Review below.`);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      event.target.value = "";
    }
  }

  function toggleSection(section: ResumeApplySection) {
    setSelectedSections((current) =>
      current.includes(section)
        ? current.filter((item) => item !== section)
        : [...current, section]
    );
  }

  async function handleApply() {
    if (!draft || selectedSections.length === 0) return;

    setError(null);

    try {
      const result = await applyDraft(profile, {
        sections: selectedSections,
        overwriteProfile,
        skillsCategory: SKILL_CATEGORIES[3],
      });

      const parts: string[] = [];
      if (result.profileUpdated) parts.push("profile updated");
      if (result.skillsAdded > 0) {
        parts.push(`${result.skillsAdded} skill${result.skillsAdded === 1 ? "" : "s"} added`);
      }
      if (result.experiencesAdded > 0) {
        parts.push(
          `${result.experiencesAdded} experience${result.experiencesAdded === 1 ? "" : "s"} added`
        );
      }
      if (result.projectsAdded > 0) {
        parts.push(
          `${result.projectsAdded} project${result.projectsAdded === 1 ? "" : "s"} added`
        );
      }
      if (result.educationAdded > 0) {
        parts.push(
          `${result.educationAdded} education record${result.educationAdded === 1 ? "" : "s"} added`
        );
      }

      if (parts.length === 0) {
        notifyInfo(
          "Nothing new was applied — existing profile fields may already be filled. Try enabling overwrite for profile."
        );
      } else {
        notifySuccess(`Applied to your portfolio: ${parts.join(", ")}.`);
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  const summary = draft ? summarizeResumeDraft(draft) : null;

  return (
    <Card id="resume" className="h-full min-w-0">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Upload className="h-4 w-4 text-primary" />
          Resume import
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload a {RESUME_FILE_LABEL} file. AI extracts a draft you review before applying.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Supported formats: PDF, DOCX, or plain text. Minimum 50 characters of content.
        </p>

        {!aiReady && aiStatus && (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            AI is unavailable — add a Gemini API key in backend .env to extract
            resume data.
          </p>
        )}

        {uploadedFileName ? (
          <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5">
            <FileText className="h-4 w-4 shrink-0 text-primary" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {uploadedFileName}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              aria-label="Remove uploaded resume"
              disabled={isBusy}
              onClick={() => {
                clearUploadedFile();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed bg-muted/20 px-3 py-6 text-center text-xs text-muted-foreground">
            No resume uploaded yet
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={RESUME_FILE_ACCEPT}
            className="hidden"
            onChange={(e) => void handleFileChange(e)}
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isBusy}
            onClick={() => fileInputRef.current?.click()}
          >
            {isParsingFile ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            Upload resume
          </Button>
          <Button
            type="button"
            size="sm"
            className="flex-1 sm:flex-none"
            disabled={!canExtract || isBusy}
            onClick={() => void handleExtract()}
          >
            {isExtracting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {draft ? "Re-extract draft" : "Extract draft"}
          </Button>
        </div>

        {isParsingFile && (
          <p className="text-xs text-muted-foreground">Reading resume file…</p>
        )}
        {isExtracting && (
          <p className="text-xs text-muted-foreground">
            Extracting draft with AI… This may take 30–90 seconds on local
            models.
          </p>
        )}

        {error && <p className="text-xs text-destructive">{error}</p>}

        {draft && summary && (
          <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium">Extracted draft</p>
              {provider && (
                <Badge variant="outline" className="text-[10px]">
                  via {provider}
                </Badge>
              )}
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              {draft.full_name && (
                <p>
                  <span className="font-medium text-foreground">Name:</span>{" "}
                  {draft.full_name}
                </p>
              )}
              {draft.title && (
                <p>
                  <span className="font-medium text-foreground">Title:</span>{" "}
                  {draft.title}
                </p>
              )}
              {draft.about && (
                <p className="line-clamp-3 whitespace-pre-wrap">
                  <span className="font-medium text-foreground">About:</span>{" "}
                  {draft.about}
                </p>
              )}
              {summary.skillsCount > 0 && (
                <p>
                  <span className="font-medium text-foreground">Skills:</span>{" "}
                  {draft.skills.slice(0, 8).join(", ")}
                  {summary.skillsCount > 8 ? "…" : ""}
                </p>
              )}
              {summary.experiencesCount > 0 && (
                <p>
                  <span className="font-medium text-foreground">Experience:</span>{" "}
                  {summary.experiencesCount} role
                  {summary.experiencesCount === 1 ? "" : "s"}
                </p>
              )}
              {summary.projectsCount > 0 && (
                <p>
                  <span className="font-medium text-foreground">Projects:</span>{" "}
                  {summary.projectsCount}
                </p>
              )}
              {summary.educationCount > 0 && (
                <p>
                  <span className="font-medium text-foreground">Education:</span>{" "}
                  {summary.educationCount}
                </p>
              )}
            </div>

            <div className="space-y-3 border-t pt-4">
              <p className="text-sm font-medium">Apply to portfolio</p>
              <div className="space-y-2">
                {(Object.keys(SECTION_LABELS) as ResumeApplySection[]).map(
                  (section) => {
                    const count =
                      section === "profile"
                        ? summary.hasProfile
                        : section === "skills"
                          ? summary.skillsCount
                          : section === "experiences"
                            ? summary.experiencesCount
                            : section === "projects"
                              ? summary.projectsCount
                              : summary.educationCount;

                    if (count === 0) return null;

                    return (
                      <label
                        key={section}
                        className="flex cursor-pointer items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          className="size-4 rounded border-input"
                          checked={selectedSections.includes(section)}
                          onChange={() => toggleSection(section)}
                        />
                        {SECTION_LABELS[section]}
                      </label>
                    );
                  }
                )}
              </div>

              {selectedSections.includes("profile") && (
                <div className="flex items-center justify-between gap-3 rounded-lg border bg-background/60 px-3 py-2">
                  <Label htmlFor="overwrite-profile" className="text-xs">
                    Overwrite existing profile fields
                  </Label>
                  <Switch
                    id="overwrite-profile"
                    checked={overwriteProfile}
                    onCheckedChange={setOverwriteProfile}
                  />
                </div>
              )}

              <Button
                type="button"
                size="sm"
                className="w-full"
                disabled={isApplying || selectedSections.length === 0}
                onClick={() => void handleApply()}
              >
                {isApplying ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Apply selected to portfolio
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
