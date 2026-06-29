"use client";

import { Check, Copy, FileText, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import type { CoverLetterResult, CoverLetterTone } from "@/lib/api/types";
import { notifySuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useGenerateCoverLetterMutation } from "@/store/api/portfolioApi";
import { useTargetRole } from "@/store/hooks";

const TONE_OPTIONS: { id: CoverLetterTone; label: string }[] = [
  { id: "professional", label: "Professional" },
  { id: "enthusiastic", label: "Enthusiastic" },
  { id: "concise", label: "Concise" },
];

async function copyText(text: string, label: string) {
  await navigator.clipboard.writeText(text);
  notifySuccess(`${label} copied to clipboard.`);
}

export function CoverLetterGeneratorPanel() {
  const targetRole = useTargetRole();
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [tone, setTone] = useState<CoverLetterTone>("professional");
  const [result, setResult] = useState<CoverLetterResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<"subject" | "letter" | null>(null);
  const [generate, { isLoading }] = useGenerateCoverLetterMutation();

  const canGenerate =
    companyName.trim().length > 0 &&
    jobTitle.trim().length > 0 &&
    jobDescription.trim().length >= 50;

  async function handleGenerate() {
    if (!canGenerate) {
      setError(
        "Enter company name, job title, and at least 50 characters from the job description."
      );
      return;
    }

    setError(null);
    try {
      const data = await generate({
        company_name: companyName.trim(),
        job_title: jobTitle.trim(),
        job_description: jobDescription.trim(),
        tone,
        additional_notes: additionalNotes.trim() || undefined,
        target_role: targetRole,
      }).unwrap();
      setResult(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  async function handleCopy(field: "subject" | "letter", text: string, label: string) {
    await copyText(text, label);
    setCopiedField(field);
    window.setTimeout(() => setCopiedField(null), 2000);
  }

  return (
    <Card className="flex h-full w-full flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4 text-primary" />
          AI cover letter generator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Generate a tailored cover letter from your portfolio and a job posting.
          {targetRole ? (
            <>
              {" "}
              Using target role:{" "}
              <span className="font-medium text-foreground">{targetRole}</span>.
            </>
          ) : (
            <>
              {" "}
              <Link href="/settings" className="text-primary hover:underline">
                Set a target role
              </Link>{" "}
              for sharper tailoring.
            </>
          )}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cover-company">Company name</Label>
            <Input
              id="cover-company"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              placeholder="e.g. Acme Corp"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cover-title">Job title</Label>
            <Input
              id="cover-title"
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cover-jd">Job description</Label>
          <Textarea
            id="cover-jd"
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder="Paste the job posting (requirements, responsibilities, tech stack)…"
            rows={7}
            className="max-h-48 min-h-28 resize-none overflow-y-auto text-sm [field-sizing:fixed]"
          />
          <p className="text-[11px] text-muted-foreground">
            {jobDescription.length > 0
              ? `${jobDescription.length.toLocaleString()} characters`
              : "Minimum 50 characters"}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cover-notes">Additional notes (optional)</Label>
          <Textarea
            id="cover-notes"
            value={additionalNotes}
            onChange={(event) => setAdditionalNotes(event.target.value)}
            placeholder="Referral name, why you want this role, relocation, etc."
            rows={2}
            className="resize-none text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label>Tone</Label>
          <div className="flex flex-wrap gap-2">
            {TONE_OPTIONS.map((option) => (
              <Button
                key={option.id}
                type="button"
                size="sm"
                variant={tone === option.id ? "default" : "outline"}
                onClick={() => setTone(option.id)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {error ? <p className="text-xs text-destructive">{error}</p> : null}

        <Button
          type="button"
          size="sm"
          onClick={() => void handleGenerate()}
          disabled={isLoading || !canGenerate}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate cover letter
        </Button>

        {result ? (
          <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-[10px]">
                via {result.provider}
              </Badge>
              {result.highlights.length > 0 ? (
                result.highlights.map((item) => (
                  <Badge key={item} variant="secondary" className="text-[10px]">
                    {item}
                  </Badge>
                ))
              ) : null}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-foreground">Email subject</p>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs"
                  onClick={() =>
                    void handleCopy("subject", result.subject_line, "Subject line")
                  }
                >
                  {copiedField === "subject" ? (
                    <Check className="mr-1 h-3.5 w-3.5" />
                  ) : (
                    <Copy className="mr-1 h-3.5 w-3.5" />
                  )}
                  Copy
                </Button>
              </div>
              <p className="rounded-md border bg-background px-3 py-2 text-sm">
                {result.subject_line}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-foreground">Cover letter</p>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs"
                  onClick={() =>
                    void handleCopy("letter", result.content, "Cover letter")
                  }
                >
                  {copiedField === "letter" ? (
                    <Check className="mr-1 h-3.5 w-3.5" />
                  ) : (
                    <Copy className="mr-1 h-3.5 w-3.5" />
                  )}
                  Copy
                </Button>
              </div>
              <div
                className={cn(
                  "max-h-80 overflow-y-auto rounded-md border bg-background px-4 py-3",
                  "text-sm leading-relaxed whitespace-pre-wrap"
                )}
              >
                {result.content}
              </div>
            </div>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => void handleGenerate()}
              disabled={isLoading}
            >
              Regenerate
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
