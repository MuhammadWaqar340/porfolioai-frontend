"use client";

import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/use-subscription";
import { useGetAIStatusQuery } from "@/store/api/portfolioApi";

interface GenerateWithAIButtonProps {
  onClick: () => void | Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function GenerateWithAIButton({
  onClick,
  isLoading = false,
  disabled = false,
  className,
}: GenerateWithAIButtonProps) {
  const { canUseAI } = useSubscription();
  const { data: aiStatus } = useGetAIStatusQuery();
  const aiReady = aiStatus?.available ?? false;

  const proLocked = !canUseAI;

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={className}
      onClick={() => void onClick()}
      disabled={disabled || isLoading || !aiReady || proLocked}
      title={
        proLocked
          ? "AI assistance requires Pro — upgrade to continue"
          : aiReady
            ? "Generate a draft with AI — review before saving"
            : (aiStatus?.message ?? "AI is not configured")
      }
    >
      {isLoading ? (
        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
      ) : (
        <Sparkles className="mr-1.5 h-3.5 w-3.5" />
      )}
      {proLocked ? "Pro only" : "Generate with AI"}
    </Button>
  );
}
