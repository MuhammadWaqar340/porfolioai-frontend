"use client";

import Link from "next/link";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpdatePreferencesMutation } from "@/store/api/portfolioApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  hydratePreferences,
  selectShouldShowOnboardingBanner,
} from "@/store/slices/preferencesSlice";

export function OnboardingBanner() {
  const dispatch = useAppDispatch();
  const show = useAppSelector(selectShouldShowOnboardingBanner);
  const [updatePreferences] = useUpdatePreferencesMutation();

  if (!show) return null;

  async function handleDismiss() {
    try {
      const result = await updatePreferences({
        onboarding_banner_dismissed: true,
      }).unwrap();
      dispatch(
        hydratePreferences({
          target_role: result.target_role,
          onboarding_complete: result.onboarding_complete,
          onboarding_banner_dismissed: result.onboarding_banner_dismissed,
        })
      );
    } catch {
      // Keep banner visible if save fails
    }
  }

  return (
    <div className="relative flex flex-col gap-3 overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-primary/8 via-primary/5 to-violet-500/8 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl"
        aria-hidden
      />
      <div className="relative flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/20">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-medium">Set up your AI-powered portfolio</p>
          <p className="text-sm text-muted-foreground">
            Complete a quick wizard to set your target role and generate your
            first drafts.
          </p>
        </div>
      </div>
      <div className="relative flex shrink-0 items-center gap-2">
        <Button
          render={<Link href="/onboarding" />}
          nativeButton={false}
          className="shrink-0"
        >
          Start setup
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
          aria-label="Dismiss setup banner"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
