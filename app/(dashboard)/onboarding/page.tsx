"use client";

import { Loader2, Plus, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SKILL_CATEGORIES } from "@/constants/skills";
import { useProfile } from "@/hooks/use-profile";
import { useSkills } from "@/hooks/use-skills";
import { useSubscription } from "@/hooks/use-subscription";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import type { SkillSuggestionItem, UserPreferences } from "@/lib/api/types";
import {
  useGenerateAboutMutation,
  useSuggestSkillsMutation,
  useUpdatePreferencesMutation,
} from "@/store/api/portfolioApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hydratePreferences, selectTargetRole } from "@/store/slices/preferencesSlice";
import { notifySuccess } from "@/lib/toast";

const STEPS = [
  "Set your target role",
  "Draft your about section",
  "Discover skills to add",
  "You're ready!",
];

interface OnboardingSkill {
  id: string;
  name: string;
  category: string;
}

function toOnboardingSkills(suggestions: SkillSuggestionItem[]): OnboardingSkill[] {
  return suggestions.map((item) => ({
    id: crypto.randomUUID(),
    name: item.name,
    category: item.category || SKILL_CATEGORIES[0],
  }));
}

function groupSkillsByCategory(skills: OnboardingSkill[]) {
  const groups = new Map<string, string[]>();

  for (const skill of skills) {
    const category = skill.category.trim() || SKILL_CATEGORIES[0];
    const names = groups.get(category) ?? [];
    if (!names.some((name) => name.toLowerCase() === skill.name.trim().toLowerCase())) {
      names.push(skill.name.trim());
    }
    groups.set(category, names);
  }

  return groups;
}

export default function OnboardingPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const savedTargetRole = useAppSelector(selectTargetRole);
  const { profile, updateProfile } = useProfile();
  const { addSkills } = useSkills();
  const { canUseAI } = useSubscription();

  const [step, setStep] = useState(0);
  const [targetRole, setTargetRoleLocal] = useState("");
  const [aboutDraft, setAboutDraft] = useState("");
  const [aboutSaved, setAboutSaved] = useState(false);
  const [skillItems, setSkillItems] = useState<OnboardingSkill[]>([]);
  const [skillsSaved, setSkillsSaved] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<string>(SKILL_CATEGORIES[0]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [generateAbout, { isLoading: aboutLoading }] = useGenerateAboutMutation();
  const [suggestSkills, { isLoading: skillsLoading }] = useSuggestSkillsMutation();
  const [updatePreferences] = useUpdatePreferencesMutation();

  useEffect(() => {
    if (savedTargetRole) {
      setTargetRoleLocal(savedTargetRole);
    }
  }, [savedTargetRole]);

  function applyPreferences(result: UserPreferences) {
    dispatch(
      hydratePreferences({
        target_role: result.target_role,
        onboarding_complete: result.onboarding_complete,
        onboarding_banner_dismissed: result.onboarding_banner_dismissed,
      })
    );
  }

  useEffect(() => {
    setStep(0);
    setTargetRoleLocal("");
    setAboutDraft("");
    setAboutSaved(false);
    setSkillItems([]);
    setSkillsSaved(false);
    setNewSkillName("");
    setNewSkillCategory(SKILL_CATEGORIES[0]);
    setStatusMessage(null);
    setErrorMessage(null);
  }, [userId]);

  async function handleGenerateAbout() {
    setErrorMessage(null);

    try {
      const result = await generateAbout({
        prompt: `Write an about section for someone targeting: ${targetRole}`,
      }).unwrap();
      setAboutDraft(result.content);
      setAboutSaved(false);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    }
  }

  async function saveAboutDraft() {
    if (!aboutDraft.trim()) return true;

    setIsSaving(true);
    setErrorMessage(null);

    try {
      await updateProfile({
        about: aboutDraft.trim(),
        title: targetRole.trim() || profile.title,
      });
      setAboutSaved(true);
      return true;
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleContinueFromAbout() {
    if (aboutDraft.trim() && !aboutSaved) {
      const saved = await saveAboutDraft();
      if (!saved) return;
    }
    setStep(2);
  }

  async function handleSuggestSkills() {
    setErrorMessage(null);

    try {
      const result = await suggestSkills({ target_role: targetRole }).unwrap();
      setSkillItems(toOnboardingSkills(result.suggestions.slice(0, 10)));
      setSkillsSaved(false);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    }
  }

  function addSkillItem() {
    const name = newSkillName.trim();
    if (!name) return;

    if (
      skillItems.some((skill) => skill.name.toLowerCase() === name.toLowerCase())
    ) {
      setNewSkillName("");
      return;
    }

    setSkillItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name,
        category: newSkillCategory,
      },
    ]);
    setNewSkillName("");
    setSkillsSaved(false);
  }

  function removeSkillItem(id: string) {
    setSkillItems((current) => current.filter((skill) => skill.id !== id));
    setSkillsSaved(false);
  }

  function updateSkillName(id: string, name: string) {
    setSkillItems((current) =>
      current.map((skill) => (skill.id === id ? { ...skill, name } : skill))
    );
    setSkillsSaved(false);
  }

  async function saveSkillsDraft() {
    if (skillItems.length === 0) return true;

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const groups = groupSkillsByCategory(skillItems);
      let totalAdded = 0;

      for (const [category, names] of groups) {
        if (names.length === 0) continue;
        const result = await addSkills(names, category);
        totalAdded += result.added.length;
      }

      setSkillsSaved(true);
      setStatusMessage(
        totalAdded > 0
          ? `Added ${totalAdded} skill${totalAdded === 1 ? "" : "s"} to your portfolio.`
          : "Skills were already on your portfolio or could not be added."
      );
      return true;
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleContinueFromSkills() {
    if (skillItems.length > 0 && !skillsSaved) {
      const saved = await saveSkillsDraft();
      if (!saved) return;
    }
    setStep(3);
  }

  async function finish() {
    setIsSaving(true);
    setErrorMessage(null);

    try {
      if (targetRole.trim()) {
        const prefs = await updatePreferences({
          target_role: targetRole.trim(),
        }).unwrap();
        applyPreferences(prefs);
      }

      if (aboutDraft.trim() && !aboutSaved) {
        const savedAbout = await saveAboutDraft();
        if (!savedAbout) return;
      }

      if (skillItems.length > 0 && !skillsSaved) {
        const savedSkills = await saveSkillsDraft();
        if (!savedSkills) return;
      }

      const prefs = await updatePreferences({
        target_role: targetRole.trim(),
        onboarding_complete: true,
        onboarding_banner_dismissed: true,
      }).unwrap();
      applyPreferences(prefs);
      notifySuccess("Portfolio setup complete!");
      router.push("/dashboard");
    } finally {
      setIsSaving(false);
    }
  }

  const busy = isSaving || aboutLoading || skillsLoading;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader
        title="AI Portfolio Setup"
        description={`Step ${step + 1} of ${STEPS.length}: ${STEPS[step]}`}
      />

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[step]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}
          {statusMessage && (
            <p className="text-sm text-primary">{statusMessage}</p>
          )}

          {step === 0 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="onboardRole">What role are you targeting?</Label>
                <Input
                  id="onboardRole"
                  placeholder="e.g. Frontend Developer"
                  value={targetRole}
                  onChange={(e) => setTargetRoleLocal(e.target.value)}
                />
              </div>
              <Button
                type="button"
                onClick={async () => {
                  if (!targetRole.trim()) return;
                  setErrorMessage(null);
                  try {
                    const prefs = await updatePreferences({
                      target_role: targetRole.trim(),
                    }).unwrap();
                    applyPreferences(prefs);
                    setStep(1);
                  } catch (error) {
                    setErrorMessage(getApiErrorMessage(error));
                  }
                }}
                disabled={!targetRole.trim()}
              >
                Continue
              </Button>
            </>
          )}

          {step === 1 && (
            <>
              <p className="text-sm text-muted-foreground">
                Generate a draft, edit it below, then save it straight to your
                profile.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => void handleGenerateAbout()}
                disabled={busy || !canUseAI}
                title={canUseAI ? undefined : "AI draft generation requires Pro"}
              >
                {aboutLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {aboutLoading ? "Generating…" : canUseAI ? "Generate about draft" : "Pro only — generate about"}
              </Button>

              <div className="space-y-2">
                <Label htmlFor="aboutDraft">About me</Label>
                <Textarea
                  id="aboutDraft"
                  placeholder="Generate a draft or write your own about section…"
                  value={aboutDraft}
                  onChange={(e) => {
                    setAboutDraft(e.target.value);
                    setAboutSaved(false);
                  }}
                  rows={8}
                />
                <p className="text-xs text-muted-foreground">
                  Your target role will also be saved as your professional title.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(0)}
                  disabled={busy}
                >
                  Back
                </Button>
                {aboutDraft.trim() && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => void saveAboutDraft()}
                    disabled={busy || aboutSaved}
                  >
                    {aboutSaved ? "Saved to profile" : "Save to profile"}
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={() => void handleContinueFromAbout()}
                  disabled={busy}
                >
                  Continue
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-sm text-muted-foreground">
                Suggest skills, edit the list, then save them to your portfolio.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => void handleSuggestSkills()}
                disabled={busy || !canUseAI}
                title={canUseAI ? undefined : "AI skill suggestions require Pro"}
              >
                {skillsLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {skillsLoading ? "Suggesting…" : canUseAI ? "Suggest skills" : "Pro only — suggest skills"}
              </Button>

              {skillItems.length > 0 && (
                <div className="space-y-3 rounded-lg border p-4">
                  <Label>Edit skills before saving</Label>
                  <ul className="space-y-2">
                    {skillItems.map((skill) => (
                      <li key={skill.id} className="flex flex-wrap gap-2">
                        <Input
                          value={skill.name}
                          onChange={(e) =>
                            updateSkillName(skill.id, e.target.value)
                          }
                          className="min-w-0 flex-1"
                        />
                        <Badge variant="secondary" className="shrink-0 self-center">
                          {skill.category}
                        </Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          aria-label={`Remove ${skill.name}`}
                          onClick={() => removeSkillItem(skill.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-3 rounded-lg border border-dashed p-4">
                <Label>Add a skill manually</Label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    placeholder="e.g. React"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkillItem();
                      }
                    }}
                  />
                  <select
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value)}
                    className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                  >
                    {SKILL_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSkillItem}
                    disabled={!newSkillName.trim()}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={busy}
                >
                  Back
                </Button>
                {skillItems.length > 0 && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => void saveSkillsDraft()}
                    disabled={busy || skillsSaved}
                  >
                    {skillsSaved ? "Saved to portfolio" : "Save skills"}
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={() => void handleContinueFromSkills()}
                  disabled={busy}
                >
                  Continue
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-sm text-muted-foreground">
                Review what will be saved, then finish to start using your
                portfolio.
              </p>

              <div className="space-y-4 rounded-lg border p-4 text-sm">
                <div>
                  <p className="font-medium">Target role</p>
                  <p className="text-muted-foreground">{targetRole || "—"}</p>
                </div>
                <div>
                  <p className="font-medium">About section</p>
                  {aboutDraft.trim() ? (
                    <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                      {aboutDraft}
                    </p>
                  ) : (
                    <p className="text-muted-foreground">Not added yet</p>
                  )}
                  {aboutSaved && (
                    <p className="mt-1 text-xs text-primary">Saved to profile</p>
                  )}
                </div>
                <div>
                  <p className="font-medium">Skills</p>
                  {skillItems.length > 0 ? (
                    <p className="text-muted-foreground">
                      {skillItems.map((skill) => skill.name).join(", ")}
                    </p>
                  ) : (
                    <p className="text-muted-foreground">Not added yet</p>
                  )}
                  {skillsSaved && (
                    <p className="mt-1 text-xs text-primary">Saved to portfolio</p>
                  )}
                </div>
              </div>

              <Button type="button" onClick={() => void finish()} disabled={busy}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finishing…
                  </>
                ) : (
                  "Finish & go to dashboard"
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
