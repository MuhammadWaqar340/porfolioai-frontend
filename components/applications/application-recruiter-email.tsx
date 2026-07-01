"use client";

import { Copy, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notifyInfo, notifySuccess } from "@/lib/toast";

interface ApplicationRecruiterEmailProps {
  email: string | null | undefined;
}

export function ApplicationRecruiterEmail({ email }: ApplicationRecruiterEmailProps) {
  const trimmed = email?.trim();
  if (!trimmed) {
    return null;
  }

  const value = trimmed;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      notifySuccess("Recruiter email copied.");
    } catch {
      notifyInfo("Could not copy automatically.");
    }
  }

  return (
    <div className="flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/20 px-2 py-1.5">
      <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
      <span className="min-w-0 flex-1 truncate text-[11px] text-foreground" title={value}>
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="xs"
        className="h-6 shrink-0 px-1.5"
        aria-label="Copy recruiter email"
        onClick={() => void handleCopy()}
      >
        <Copy className="h-3 w-3" />
      </Button>
    </div>
  );
}
