"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSubscription } from "@/hooks/use-subscription";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import {
  useGetAIStatusQuery,
  useImproveTextMutation,
} from "@/store/api/portfolioApi";
import { useTargetRole } from "@/store/hooks";

interface AITextMenuProps {
  fieldType: string;
  text: string;
  onApply: (content: string) => void;
  onGenerate?: () => void | Promise<void>;
  generateLabel?: string;
  isGenerating?: boolean;
  disabled?: boolean;
  disabledTitle?: string;
  className?: string;
}

export function AITextMenu({
  fieldType,
  text,
  onApply,
  onGenerate,
  generateLabel = "Generate",
  isGenerating = false,
  disabled = false,
  disabledTitle = "Editing is disabled",
  className,
}: AITextMenuProps) {
  const { canUseAI } = useSubscription();
  const { data: aiStatus } = useGetAIStatusQuery();
  const [improveText, { isLoading: isImproving }] = useImproveTextMutation();
  const [error, setError] = useState<string | null>(null);
  const targetRole = useTargetRole();

  const aiReady = aiStatus?.available ?? false;
  const busy = isGenerating || isImproving;
  const proLocked = !canUseAI;

  async function handleImprove(instruction: string) {
    if (!text.trim() || proLocked) return;
    setError(null);
    try {
      const result = await improveText({
        text,
        field_type: fieldType,
        instruction,
        target_role: targetRole,
      }).unwrap();
      onApply(result.content);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || busy || !aiReady || proLocked}
              title={
                disabled && !busy
                  ? disabledTitle
                  : proLocked
                  ? "AI assistance requires Pro — upgrade to continue"
                  : aiReady
                    ? "AI writing assistant"
                    : (aiStatus?.message ?? "AI unavailable")
              }
            >
              {busy ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              )}
              {proLocked ? "Pro" : "AI"}
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          {onGenerate && (
            <DropdownMenuItem
              onClick={() => {
                setError(null);
                void onGenerate();
              }}
              disabled={isGenerating}
            >
              {generateLabel}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => void handleImprove("improve")}
            disabled={!text.trim() || isImproving}
          >
            Improve
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => void handleImprove("shorten")}
            disabled={!text.trim() || isImproving}
          >
            Shorten
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => void handleImprove("professional")}
            disabled={!text.trim() || isImproving}
          >
            More professional
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
