"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError } from "@/components/ui/field-error";
import { FormAlert } from "@/components/ui/form-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useFormErrors } from "@/hooks/use-form-errors";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { notifyInfo } from "@/lib/toast";
import {
  useChangePasswordMutation,
  useGetMeQuery,
  useGetPortfolioSettingsQuery,
  useLazyCheckUsernameQuery,
  useUpdatePortfolioSettingsMutation,
} from "@/store/api/portfolioApi";

type PasswordField = "currentPassword" | "newPassword" | "confirmPassword";

function validateUsername(value: string) {
  if (value.length < 3) return "Username must be at least 3 characters.";
  if (value.length > 30) return "Username must be 30 characters or fewer.";
  if (!/^[a-z0-9_-]+$/.test(value)) {
    return "Use only lowercase letters, numbers, hyphens, and underscores.";
  }
  return null;
}

export function AccountSettingsPanel() {
  const { data: user } = useGetMeQuery();
  const { data: settings } = useGetPortfolioSettingsQuery();
  const [updateSettings, { isLoading: isSavingUsername }] =
    useUpdatePortfolioSettingsMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();
  const [checkUsername] = useLazyCheckUsernameQuery();

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    formError: passwordFormError,
    clearAll: clearPasswordErrors,
    setValidationErrors,
    applyApiErrorOrFallback,
    getError,
  } = useFormErrors<PasswordField>();

  useEffect(() => {
    if (settings?.username) {
      setUsername(settings.username);
    }
  }, [settings?.username]);

  const isGoogleAccount = user?.auth_provider === "google";

  async function handleSaveUsername() {
    setUsernameError(null);

    const validationError = validateUsername(username.trim().toLowerCase());
    if (validationError) {
      setUsernameError(validationError);
      return;
    }

    const normalized = username.trim().toLowerCase();
    if (normalized === settings?.username) {
      notifyInfo("Username is already up to date.");
      return;
    }

    try {
      const check = await checkUsername(normalized).unwrap();
      if (!check.available) {
        setUsernameError("This username is already taken.");
        return;
      }

      await updateSettings({ username: normalized }).unwrap();
    } catch (error) {
      setUsernameError(
        getApiErrorMessage(error, "Could not update username. Please try again.")
      );
    }
  }

  async function handleChangePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    clearPasswordErrors();

    const validationErrors: Partial<Record<PasswordField, string>> = {};
    if (!currentPassword) validationErrors.currentPassword = "Current password is required.";
    if (!newPassword) validationErrors.newPassword = "New password is required.";
    if (newPassword.length < 8) {
      validationErrors.newPassword = "Password must be at least 8 characters.";
    }
    if (!/[A-Z]/.test(newPassword)) {
      validationErrors.newPassword = "Password must contain an uppercase letter.";
    }
    if (!/\d/.test(newPassword)) {
      validationErrors.newPassword = "Password must contain a number.";
    }
    if (newPassword !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors(validationErrors);
      return;
    }

    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      }).unwrap();
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      applyApiErrorOrFallback(
        error,
        getApiErrorMessage(error, "Could not change password. Please try again.")
      );
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Manage your account settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="settings-username">Portfolio username</Label>
            <Input
              id="settings-username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value.toLowerCase());
                setUsernameError(null);
              }}
              placeholder="your-name"
            />
            {usernameError ? <FieldError message={usernameError} /> : null}
            <p className="text-xs text-muted-foreground">
              Used in your public URL: /{username || "username"}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-email">Email</Label>
            <Input
              id="settings-email"
              type="email"
              value={user?.email ?? ""}
              readOnly
              className="bg-muted"
            />
            {user && !user.is_verified && user.auth_provider === "local" ? (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Email not verified yet. Use the banner above to resend the link.
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            onClick={handleSaveUsername}
            disabled={isSavingUsername}
          >
            {isSavingUsername ? "Saving…" : "Save username"}
          </Button>
        </div>

        {!isGoogleAccount ? (
          <>
            <Separator />
            <form className="space-y-4" onSubmit={handleChangePassword}>
              <div>
                <h3 className="text-sm font-medium">Change password</h3>
                <p className="text-sm text-muted-foreground">
                  Update your sign-in password.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-password">Current password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <FieldError message={getError("currentPassword")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <FieldError message={getError("newPassword")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <FieldError message={getError("confirmPassword")} />
              </div>
              {passwordFormError ? <FormAlert message={passwordFormError} /> : null}
              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? "Updating…" : "Update password"}
              </Button>
            </form>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            This account uses Google sign-in. Password changes are managed by Google.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
