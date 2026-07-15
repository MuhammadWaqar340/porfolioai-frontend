"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/form-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import type { CompanyMemberPortfolioUpdatePayload } from "@/lib/api/types";
import {
  useGetCompanyMemberPortfolioQuery,
  useGetTemplatesQuery,
} from "@/store/api/portfolioApi";

interface OrganizationMemberPortfolioSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  memberUserId: string | null;
  memberName?: string;
  onSubmit: (body: CompanyMemberPortfolioUpdatePayload) => void | Promise<void>;
}

type FormState = {
  full_name: string;
  title: string;
  about: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  avatar_url: string;
  is_public: boolean;
  template_id: string;
};

const emptyForm: FormState = {
  full_name: "",
  title: "",
  about: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  website: "",
  avatar_url: "",
  is_public: false,
  template_id: "",
};

export function OrganizationMemberPortfolioSheet({
  open,
  onOpenChange,
  companyId,
  memberUserId,
  memberName,
  onSubmit,
}: OrganizationMemberPortfolioSheetProps) {
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { data: templates = [] } = useGetTemplatesQuery();
  const {
    data: portfolio,
    isLoading,
    isError,
  } = useGetCompanyMemberPortfolioQuery(
    { companyId, memberUserId: memberUserId ?? "" },
    { skip: !open || !memberUserId }
  );

  const activeTemplates = useMemo(
    () => templates.filter((t) => t.is_active),
    [templates]
  );

  useEffect(() => {
    if (!open) {
      setForm(emptyForm);
      setIsSubmitting(false);
      setFormError(null);
      return;
    }
    if (portfolio) {
      setForm({
        full_name: portfolio.full_name ?? "",
        title: portfolio.title ?? "",
        about: portfolio.about ?? "",
        phone: portfolio.phone ?? "",
        location: portfolio.location ?? "",
        linkedin: portfolio.linkedin ?? "",
        github: portfolio.github ?? "",
        website: portfolio.website ?? "",
        avatar_url: portfolio.avatar_url ?? "",
        is_public: portfolio.is_public,
        template_id: portfolio.template_id ?? "",
      });
    }
  }, [open, portfolio]);

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    try {
      await onSubmit({
        full_name: form.full_name.trim(),
        title: form.title.trim(),
        about: form.about.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
        linkedin: form.linkedin.trim(),
        github: form.github.trim(),
        website: form.website.trim(),
        avatar_url: form.avatar_url.trim(),
        is_public: form.is_public,
        template_id: form.template_id || null,
      });
      onOpenChange(false);
    } catch (err) {
      setFormError(getApiErrorMessage(err, "Could not save portfolio"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-lg">
        <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col">
          <SheetHeader>
            <SheetTitle>Edit {memberName ? memberName + "'s" : "member"} portfolio</SheetTitle>
            <SheetDescription>
              They&apos;ve consented to let organization managers edit their portfolio.
            </SheetDescription>
          </SheetHeader>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-2">
            <FormAlert message={formError} />

            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading portfolio…</p>
            ) : null}
            {isError ? (
              <FormAlert message="Could not load this member's portfolio." />
            ) : null}

            {!isLoading && !isError ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="member-portfolio-name">Full name</Label>
                    <Input
                      id="member-portfolio-name"
                      value={form.full_name}
                      onChange={(e) => updateForm("full_name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="member-portfolio-title">Title</Label>
                    <Input
                      id="member-portfolio-title"
                      value={form.title}
                      onChange={(e) => updateForm("title", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="member-portfolio-about">About</Label>
                  <Textarea
                    id="member-portfolio-about"
                    value={form.about}
                    onChange={(e) => updateForm("about", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="member-portfolio-avatar">Avatar URL</Label>
                  <Input
                    id="member-portfolio-avatar"
                    value={form.avatar_url}
                    onChange={(e) => updateForm("avatar_url", e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="member-portfolio-phone">Phone</Label>
                    <Input
                      id="member-portfolio-phone"
                      value={form.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="member-portfolio-location">Location</Label>
                    <Input
                      id="member-portfolio-location"
                      value={form.location}
                      onChange={(e) => updateForm("location", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="member-portfolio-linkedin">LinkedIn</Label>
                    <Input
                      id="member-portfolio-linkedin"
                      value={form.linkedin}
                      onChange={(e) => updateForm("linkedin", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="member-portfolio-github">GitHub</Label>
                    <Input
                      id="member-portfolio-github"
                      value={form.github}
                      onChange={(e) => updateForm("github", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="member-portfolio-website">Website</Label>
                  <Input
                    id="member-portfolio-website"
                    value={form.website}
                    onChange={(e) => updateForm("website", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="member-portfolio-template">Template</Label>
                  <NativeSelect
                    id="member-portfolio-template"
                    value={form.template_id}
                    onChange={(e) => updateForm("template_id", e.target.value)}
                  >
                    <option value="">No template selected</option>
                    {activeTemplates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </NativeSelect>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2.5">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-sm font-medium">Public portfolio</p>
                    <p className="text-xs text-muted-foreground">
                      Allow anyone to view this member&apos;s portfolio
                    </p>
                  </div>
                  <Switch
                    checked={form.is_public}
                    onCheckedChange={(checked) => updateForm("is_public", checked)}
                    aria-label="Public portfolio"
                    className="shrink-0"
                  />
                </div>
              </>
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
            <Button type="submit" disabled={isSubmitting || isLoading || isError}>
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
