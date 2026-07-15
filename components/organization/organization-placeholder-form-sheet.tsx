"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/form-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import type { CompanyDepartment, CompanyPlaceholderCreatePayload } from "@/lib/api/types";

interface OrganizationPlaceholderFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canInviteAdmin?: boolean;
  departments?: CompanyDepartment[];
  onSubmit: (payload: CompanyPlaceholderCreatePayload) => void | Promise<void>;
}

type FormState = {
  email: string;
  display_name: string;
  title: string;
  is_featured: boolean;
  send_invite: boolean;
  invite_role: "admin" | "member";
  department_id: string;
};

const emptyForm: FormState = {
  email: "",
  display_name: "",
  title: "",
  is_featured: false,
  send_invite: true,
  invite_role: "member",
  department_id: "",
};

export function OrganizationPlaceholderFormSheet({
  open,
  onOpenChange,
  canInviteAdmin = false,
  departments = [],
  onSubmit,
}: OrganizationPlaceholderFormSheetProps) {
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setForm(emptyForm);
      setIsSubmitting(false);
      setFormError(null);
    }
  }, [open]);

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.email.trim()) {
      setFormError("Email is required.");
      return;
    }
    if (form.display_name.trim().length < 2) {
      setFormError("Name must be at least 2 characters.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      await onSubmit({
        email: form.email.trim(),
        display_name: form.display_name.trim(),
        title: form.title.trim(),
        is_featured: form.is_featured,
        send_invite: form.send_invite,
        invite_role: canInviteAdmin ? form.invite_role : "member",
        department_id: form.department_id || null,
      });
      onOpenChange(false);
    } catch (err) {
      setFormError(getApiErrorMessage(err, "Could not add placeholder"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-lg">
        <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col">
          <SheetHeader>
            <SheetTitle>Add placeholder</SheetTitle>
            <SheetDescription>
              Reserve a spot on your team page for someone who hasn&apos;t joined yet.
            </SheetDescription>
          </SheetHeader>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-2">
            <FormAlert message={formError} />

            <div className="space-y-2">
              <Label htmlFor="placeholder-name">Name</Label>
              <Input
                id="placeholder-name"
                value={form.display_name}
                onChange={(e) => updateForm("display_name", e.target.value)}
                placeholder="Jordan Lee"
                required
                minLength={2}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="placeholder-email">Email</Label>
              <Input
                id="placeholder-email"
                type="email"
                value={form.email}
                onChange={(e) => updateForm("email", e.target.value)}
                placeholder="jordan@company.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="placeholder-title">Title</Label>
              <Input
                id="placeholder-title"
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
                placeholder="Product Designer"
              />
            </div>

            {departments.length > 0 ? (
              <div className="space-y-2">
                <Label htmlFor="placeholder-department">Department</Label>
                <NativeSelect
                  id="placeholder-department"
                  value={form.department_id}
                  onChange={(e) => updateForm("department_id", e.target.value)}
                >
                  <option value="">No department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </NativeSelect>
              </div>
            ) : null}

            <div className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2.5">
              <div className="min-w-0 flex-1 pr-2">
                <p className="text-sm font-medium">Featured</p>
                <p className="text-xs text-muted-foreground">
                  Show this placeholder first on the public team page
                </p>
              </div>
              <Switch
                checked={form.is_featured}
                onCheckedChange={(checked) => updateForm("is_featured", checked)}
                aria-label="Featured"
                className="shrink-0"
              />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2.5">
              <div className="min-w-0 flex-1 pr-2">
                <p className="text-sm font-medium">Send invite email</p>
                <p className="text-xs text-muted-foreground">
                  Email this address so they can claim the spot and join
                </p>
              </div>
              <Switch
                checked={form.send_invite}
                onCheckedChange={(checked) => updateForm("send_invite", checked)}
                aria-label="Send invite email"
                className="shrink-0"
              />
            </div>

            {form.send_invite && canInviteAdmin ? (
              <div className="space-y-2">
                <Label htmlFor="placeholder-invite-role">Invite role</Label>
                <NativeSelect
                  id="placeholder-invite-role"
                  value={form.invite_role}
                  onChange={(e) =>
                    updateForm("invite_role", e.target.value as "admin" | "member")
                  }
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </NativeSelect>
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
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !form.email.trim() ||
                form.display_name.trim().length < 2
              }
            >
              {isSubmitting ? "Adding…" : "Add placeholder"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
