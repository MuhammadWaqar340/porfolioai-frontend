"use client";

import { Briefcase, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import type { JobDescriptionTailorResult } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { useTailorJobDescriptionMutation } from "@/store/api/portfolioApi";
import { useTargetRole } from "@/store/hooks";

function priorityVariant(priority: string) {
  if (priority === "high") return "destructive" as const;
  if (priority === "medium") return "secondary" as const;
  return "outline" as const;
}

export function JobDescriptionTailorPanel() {
  const targetRole = useTargetRole();
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<JobDescriptionTailorResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tailor, { isLoading }] = useTailorJobDescriptionMutation();

  async function handleAnalyze() {
    const trimmed = jobDescription.trim();
    if (trimmed.length < 50) {
      setError("Paste at least 50 characters from the job description.");
      return;
    }

    setError(null);
    try {
      const data = await tailor({
        job_description: trimmed,
        target_role: targetRole,
      }).unwrap();
      setResult(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  return (
    <Card className="flex h-full w-full flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Briefcase className="h-4 w-4 text-primary" />
          Job description fit
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Paste a job posting to see fit score, strengths, gaps, and keywords.
          {targetRole ? (
            <>
              {" "}
              Using target role: <span className="font-medium text-foreground">{targetRole}</span>.
            </>
          ) : (
            <>
              {" "}
              <Link href="/settings" className="text-primary hover:underline">
                Set a target role
              </Link>{" "}
              for sharper results.
            </>
          )}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
          placeholder="Paste the job description here (requirements, responsibilities, tech stack)…"
          rows={8}
          className="max-h-52 min-h-32 resize-none overflow-y-auto text-sm [field-sizing:fixed]"
        />
        <p className="text-[11px] text-muted-foreground">
          {jobDescription.length > 0
            ? `${jobDescription.length.toLocaleString()} characters — scroll inside the box for long postings`
            : "Long job postings stay in a fixed box with scroll."}
        </p>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
        <Button
          type="button"
          size="sm"
          onClick={() => void handleAnalyze()}
          disabled={isLoading || jobDescription.trim().length < 50}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Analyze fit
        </Button>

        {result ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            render={<Link href="/applications/apply" />}
            nativeButton={false}
          >
            Turn into application
          </Button>
        ) : null}

        {result ? (
          <div className="space-y-3 rounded-lg border bg-muted/20 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Fit: {result.fit_score}/100</Badge>
              <Badge variant="outline" className="text-[10px]">
                via {result.provider}
              </Badge>
            </div>
            <p className="text-sm leading-relaxed">{result.summary}</p>

            {result.matching_strengths.length > 0 ? (
              <div>
                <p className="mb-1.5 text-xs font-medium text-foreground">Strengths</p>
                <ul className="flex flex-wrap gap-1.5">
                  {result.matching_strengths.map((item) => (
                    <Badge key={item} variant="outline" className="text-[11px]">
                      {item}
                    </Badge>
                  ))}
                </ul>
              </div>
            ) : null}

            {result.keywords_to_add.length > 0 ? (
              <div>
                <p className="mb-1.5 text-xs font-medium text-foreground">
                  Keywords to consider
                </p>
                <ul className="flex flex-wrap gap-1.5">
                  {result.keywords_to_add.map((item) => (
                    <Badge key={item} variant="secondary" className="text-[11px]">
                      {item}
                    </Badge>
                  ))}
                </ul>
              </div>
            ) : null}

            {result.gaps.length > 0 ? (
              <ul className="grid gap-2 sm:grid-cols-2">
                {result.gaps.map((gap, index) => (
                  <li
                    key={`${gap.category}-${index}`}
                    className={cn(
                      "flex flex-col gap-2 rounded-lg border bg-background p-3 text-xs"
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={priorityVariant(gap.priority)}>{gap.priority}</Badge>
                    </div>
                    <span className="min-w-0 flex-1 leading-relaxed">{gap.message}</span>
                    {gap.action_path ? (
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-xs"
                        render={<Link href={gap.action_path} />}
                        nativeButton={false}
                      >
                        Fix
                      </Button>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
