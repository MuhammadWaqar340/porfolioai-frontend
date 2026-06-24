"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormAlert } from "@/components/ui/form-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdatePreferencesMutation } from "@/store/api/portfolioApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  hydratePreferences,
  resetOnboardingBanner,
  selectTargetRole,
} from "@/store/slices/preferencesSlice";

export function TargetRoleSettings() {
  const dispatch = useAppDispatch();
  const savedTargetRole = useAppSelector(selectTargetRole);
  const [role, setRole] = useState(savedTargetRole);
  const [error, setError] = useState<string | null>(null);
  const [updatePreferences, { isLoading }] = useUpdatePreferencesMutation();

  useEffect(() => {
    setRole(savedTargetRole);
  }, [savedTargetRole]);

  async function handleSave() {
    setError(null);
    try {
      const result = await updatePreferences({ target_role: role }).unwrap();
      dispatch(
        hydratePreferences({
          target_role: result.target_role,
          onboarding_complete: result.onboarding_complete,
          onboarding_banner_dismissed: result.onboarding_banner_dismissed,
        })
      );
    } catch {
      setError("Could not save target role. Please try again.");
    }
  }

  async function handleResetOnboarding() {
    setError(null);
    try {
      const result = await updatePreferences({
        onboarding_complete: false,
        onboarding_banner_dismissed: false,
      }).unwrap();
      dispatch(
        hydratePreferences({
          target_role: result.target_role,
          onboarding_complete: result.onboarding_complete,
          onboarding_banner_dismissed: result.onboarding_banner_dismissed,
        })
      );
    } catch {
      setError("Could not reset onboarding progress.");
    }
  }

  async function handleShowBanner() {
    setError(null);
    try {
      const result = await updatePreferences({
        onboarding_banner_dismissed: false,
      }).unwrap();
      dispatch(
        hydratePreferences({
          target_role: result.target_role,
          onboarding_complete: result.onboarding_complete,
          onboarding_banner_dismissed: result.onboarding_banner_dismissed,
        })
      );
      dispatch(resetOnboardingBanner());
    } catch {
      setError("Could not update onboarding banner.");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Target Role</CardTitle>
        <CardDescription>
          Tell AI what job or role you are targeting. All AI suggestions will be
          tuned to this goal.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="targetRole">Target role</Label>
          <Input
            id="targetRole"
            placeholder="e.g. Senior Full Stack Developer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
        {error ? <FormAlert message={error} /> : null}
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving…" : "Save target role"}
          </Button>
          <Button
            type="button"
            variant="outline"
            render={<Link href="/onboarding" />}
            nativeButton={false}
          >
            Open setup wizard
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 border-t pt-4">
          <Button type="button" variant="outline" onClick={handleShowBanner}>
            Show dashboard setup banner
          </Button>
          <Button type="button" variant="ghost" onClick={handleResetOnboarding}>
            Reset onboarding progress
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
