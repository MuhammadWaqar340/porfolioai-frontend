"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscription } from "@/hooks/use-subscription";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import type { SkillCategory } from "@/types";
import { useSuggestSkillsMutation } from "@/store/api/portfolioApi";
import { useTargetRole } from "@/store/hooks";

interface SkillsSuggestionsPanelProps {
  categories: SkillCategory[];
  onAddMany: (names: string[], category: string) => Promise<{ added: string[] }>;
}

export function SkillsSuggestionsPanel({
  categories,
  onAddMany,
}: SkillsSuggestionsPanelProps) {
  const { canUseAI } = useSubscription();
  const [suggestSkills, { isLoading }] = useSuggestSkillsMutation();
  const targetRole = useTargetRole();
  const [suggestions, setSuggestions] = useState<
    { name: string; category: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState<string | null>(null);

  async function handleSuggest() {
    setError(null);
    try {
      const result = await suggestSkills({
        target_role: targetRole,
      }).unwrap();
      setSuggestions(result.suggestions);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  async function handleAdd(name: string, category: string) {
    setAdding(name);
    try {
      const fallbackCategory = categories[0]?.name ?? category;
      await onAddMany([name], category || fallbackCategory);
      setSuggestions((current) => current.filter((s) => s.name !== name));
    } finally {
      setAdding(null);
    }
  }

  async function handleAddAll() {
    for (const item of suggestions) {
      const fallbackCategory = categories[0]?.name ?? item.category;
      await onAddMany([item.name], item.category || fallbackCategory);
    }
    setSuggestions([]);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-lg">AI Skill Suggestions</CardTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={() => void handleSuggest()}
          disabled={isLoading || !canUseAI}
          title={canUseAI ? undefined : "AI skill suggestions require Pro"}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Suggest skills
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {error && <p className="text-sm text-destructive">{error}</p>}
        {suggestions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {canUseAI
              ? "Get AI suggestions based on your profile, projects, and target role."
              : "AI skill suggestions require Pro. Upgrade in Settings to unlock."}
          </p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <Button
                  key={item.name}
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-auto rounded-full px-3 py-1.5 text-sm font-medium"
                  disabled={adding === item.name}
                  onClick={() => void handleAdd(item.name, item.category)}
                  title={`Add to ${item.category}`}
                >
                  {adding === item.name ? (
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  ) : null}
                  {item.name}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Click a skill to add it. Category shown in tooltip where applicable.
            </p>
            <Button size="sm" onClick={() => void handleAddAll()} disabled={Boolean(adding)}>
              Add all suggestions
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
