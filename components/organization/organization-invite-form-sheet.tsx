"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/form-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getApiErrorMessage } from "@/lib/api/form-errors";

type InviteRole = "admin" | "member";

interface OrganizationInviteFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canInviteAdmin?: boolean;
  onSubmit: (
    email: string,
    role: InviteRole
  ) => void | Promise<{ invite_url?: string | null } | void>;
}

export function OrganizationInviteFormSheet({
  open,
  onOpenChange,
  canInviteAdmin = false,
  onSubmit,
}: OrganizationInviteFormSheetProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InviteRole>("member");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setRole("member");
      setIsSubmitting(false);
      setFormError(null);
    }
  }, [open]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim()) {
      setFormError("Email is required.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      await onSubmit(email.trim(), canInviteAdmin ? role : "member");
      onOpenChange(false);
    } catch (err) {
      setFormError(getApiErrorMessage(err, "Could not send invite"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <SheetHeader>
            <SheetTitle>Invite member</SheetTitle>
            <SheetDescription>
              Send an invite by email. They must sign in with the same address to
              accept.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-4 px-4">
            <FormAlert message={formError} />
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teammate@company.com"
                autoFocus
              />
            </div>
            {canInviteAdmin ? (
              <div className="space-y-2">
                <Label htmlFor="invite-role">Role</Label>
                <NativeSelect
                  id="invite-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as InviteRole)}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </NativeSelect>
                <p className="text-xs text-muted-foreground">
                  Admins can manage members, invites, and organization settings.
                </p>
              </div>
            ) : null}
          </div>

          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !email.trim()}>
              {isSubmitting ? "Sending…" : "Send invite"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
