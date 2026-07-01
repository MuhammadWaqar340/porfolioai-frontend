"use client";

import { useState } from "react";
import { GenerateWithAIButton } from "@/components/ai/generate-with-ai-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import type { CoverLetterTone } from "@/lib/api/types";
import { notifySuccess } from "@/lib/toast";
import { useGenerateCoverLetterMutation } from "@/store/api/portfolioApi";
import { useTargetRole } from "@/store/hooks";

const TONE_OPTIONS: { id: CoverLetterTone; label: string }[] = [
  { id: "professional", label: "Professional" },
  { id: "enthusiastic", label: "Enthusiastic" },
  { id: "concise", label: "Concise" },
];

interface ApplicationCoverLetterFieldProps {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  notes: string;
  subject: string;
  content: string;
  onSubjectChange: (value: string) => void;
  onContentChange: (value: string) => void;
}

export function ApplicationCoverLetterField({
  companyName,
  jobTitle,
  jobDescription,
  notes,
  subject,
  content,
  onSubjectChange,
  onContentChange,
}: ApplicationCoverLetterFieldProps) {
  const targetRole = useTargetRole();
  const [tone, setTone] = useState<CoverLetterTone>("professional");
  const [error, setError] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [generate, { isLoading }] = useGenerateCoverLetterMutation();

  const trimmedDescription = jobDescription.trim();
  const canGenerate =
    companyName.trim().length > 0 &&
    jobTitle.trim().length > 0 &&
    trimmedDescription.length >= 50;

  async function handleGenerate() {
    if (!canGenerate) {
      setError(
        "Enter company and job title, then add at least 50 characters in Job description (Notes section)."
      );
      return;
    }

    setError(null);
    try {
      const result = await generate({
        company_name: companyName.trim(),
        job_title: jobTitle.trim(),
        job_description: trimmedDescription,
        tone,
        additional_notes: notes.trim() || undefined,
        target_role: targetRole,
      }).unwrap();

      onSubjectChange(result.subject_line);
      onContentChange(result.content);
      setHighlights(result.highlights);
      notifySuccess("Cover letter generated — review before saving.");
    } catch (err) {
      setError(getApiErrorMessage(err));
      setHighlights([]);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cover_letter_subject">
          Cover letter subject{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="cover_letter_subject"
          value={subject}
          onChange={(event) => onSubjectChange(event.target.value)}
          placeholder="Application for Senior Frontend Engineer"
        />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label htmlFor="cover_letter_content">
            Cover letter{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <GenerateWithAIButton
            onClick={handleGenerate}
            isLoading={isLoading}
            disabled={!canGenerate}
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Tone</p>
          <div className="flex flex-wrap gap-2">
            {TONE_OPTIONS.map((option) => (
              <Button
                key={option.id}
                type="button"
                size="sm"
                variant={tone === option.id ? "default" : "outline"}
                onClick={() => setTone(option.id)}
                disabled={isLoading}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <Textarea
          id="cover_letter_content"
          value={content}
          onChange={(event) => {
            onContentChange(event.target.value);
            if (error) setError(null);
          }}
          rows={6}
          placeholder="Paste or write the cover letter you sent for this role…"
          className="max-h-56 min-h-[140px] resize-none overflow-y-auto leading-relaxed [field-sizing:fixed]"
        />

        {error ? <p className="text-xs text-destructive">{error}</p> : null}

        {!canGenerate ? (
          <p className="text-xs text-muted-foreground">
            Uses company, job title, and job description from this form. Add at least 50
            characters in Job description to enable generation.
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Generates from your portfolio, target role, and the job details above.
          </p>
        )}

        {highlights.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {highlights.map((item) => (
              <Badge key={item} variant="secondary" className="text-[10px]">
                {item}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
