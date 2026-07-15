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
import type { Company, CompanyCreatePayload } from "@/lib/api/types";
import { useGetTemplatesQuery } from "@/store/api/portfolioApi";

interface OrganizationFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company?: Company | null;
  /** Whether the organization owner is on the Pro plan (required to enable the verified badge). */
  isOwnerPro?: boolean;
  onSubmit: (payload: CompanyCreatePayload) => void | Promise<void>;
}

type FormState = {
  name: string;
  slug: string;
  website: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url: string;
  industry: string;
  about: string;
  logo_url: string;
  accent_color: string;
  cover_image_url: string;
  is_public: boolean;
  featured_only_on_public: boolean;
  default_template_id: string;
  seo_title: string;
  seo_description: string;
  is_verified: boolean;
};

const emptyForm: FormState = {
  name: "",
  slug: "",
  website: "",
  email: "",
  phone: "",
  location: "",
  linkedin_url: "",
  industry: "",
  about: "",
  logo_url: "",
  accent_color: "",
  cover_image_url: "",
  is_public: true,
  featured_only_on_public: false,
  default_template_id: "",
  seo_title: "",
  seo_description: "",
  is_verified: false,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function OrganizationFormSheet({
  open,
  onOpenChange,
  company,
  isOwnerPro = false,
  onSubmit,
}: OrganizationFormSheetProps) {
  const isEditing = Boolean(company);
  const [form, setForm] = useState(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { data: templates = [] } = useGetTemplatesQuery();
  const activeTemplates = useMemo(
    () => templates.filter((t) => t.is_active),
    [templates]
  );

  useEffect(() => {
    if (!open) {
      setForm(emptyForm);
      setSlugTouched(false);
      setIsSubmitting(false);
      setFormError(null);
      return;
    }

    if (company) {
      setForm({
        name: company.name,
        slug: company.slug,
        website: company.website,
        email: company.email ?? "",
        phone: company.phone ?? "",
        location: company.location ?? "",
        linkedin_url: company.linkedin_url ?? "",
        industry: company.industry,
        about: company.about,
        logo_url: company.logo_url,
        accent_color: company.accent_color ?? "",
        cover_image_url: company.cover_image_url ?? "",
        is_public: company.is_public,
        featured_only_on_public: company.featured_only_on_public ?? false,
        default_template_id: company.default_template_id ?? "",
        seo_title: company.seo_title ?? "",
        seo_description: company.seo_description ?? "",
        is_verified: company.is_verified ?? false,
      });
      setSlugTouched(true);
    } else {
      setForm(emptyForm);
      setSlugTouched(false);
    }
    setFormError(null);
  }, [open, company]);

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (form.name.trim().length < 2) {
      setFormError("Organization name must be at least 2 characters.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      await onSubmit({
        name: form.name.trim(),
        slug: form.slug.trim() || undefined,
        website: form.website.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
        linkedin_url: form.linkedin_url.trim(),
        industry: form.industry.trim(),
        about: form.about.trim(),
        logo_url: form.logo_url.trim(),
        accent_color: form.accent_color.trim(),
        cover_image_url: form.cover_image_url.trim(),
        is_public: form.is_public,
        featured_only_on_public: form.featured_only_on_public,
        default_template_id: form.default_template_id || null,
        seo_title: form.seo_title.trim(),
        seo_description: form.seo_description.trim(),
        is_verified: form.is_verified,
      });
      onOpenChange(false);
    } catch (err) {
      setFormError(getApiErrorMessage(err, "Could not save organization"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-lg">
        <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col">
          <SheetHeader>
            <SheetTitle>
              {isEditing ? "Edit organization" : "Add organization"}
            </SheetTitle>
            <SheetDescription>
              {isEditing
                ? "Update your organization profile and team page settings."
                : "Create a company hub for your team’s portfolios."}
            </SheetDescription>
          </SheetHeader>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-2">
            <FormAlert message={formError} />

            <div className="space-y-2">
              <Label htmlFor="org-name">Organization name</Label>
              <Input
                id="org-name"
                value={form.name}
                onChange={(e) => {
                  const nextName = e.target.value;
                  updateForm("name", nextName);
                  if (!slugTouched) updateForm("slug", slugify(nextName));
                }}
                placeholder="Acme Studio"
                required
                minLength={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-slug">Public slug</Label>
              <Input
                id="org-slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  updateForm("slug", slugify(e.target.value));
                }}
                placeholder="acme-studio"
              />
              <p className="text-xs text-muted-foreground">
                Team page: /companies/{form.slug || "your-slug"}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="org-industry">Industry</Label>
                <Input
                  id="org-industry"
                  value={form.industry}
                  onChange={(e) => updateForm("industry", e.target.value)}
                  placeholder="Design agency"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-location">Location</Label>
                <Input
                  id="org-location"
                  value={form.location}
                  onChange={(e) => updateForm("location", e.target.value)}
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-email">Company email</Label>
              <Input
                id="org-email"
                type="email"
                value={form.email}
                onChange={(e) => updateForm("email", e.target.value)}
                placeholder="hello@acme.com"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="org-phone">Phone</Label>
                <Input
                  id="org-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value)}
                  placeholder="+1 555 0100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-website">Website</Label>
                <Input
                  id="org-website"
                  value={form.website}
                  onChange={(e) => updateForm("website", e.target.value)}
                  placeholder="https://acme.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-linkedin">LinkedIn</Label>
              <Input
                id="org-linkedin"
                value={form.linkedin_url}
                onChange={(e) => updateForm("linkedin_url", e.target.value)}
                placeholder="https://linkedin.com/company/acme"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="org-logo">Logo URL</Label>
                <Input
                  id="org-logo"
                  value={form.logo_url}
                  onChange={(e) => updateForm("logo_url", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-accent">Accent color</Label>
                <div className="flex gap-2">
                  <Input
                    id="org-accent"
                    value={form.accent_color}
                    onChange={(e) => updateForm("accent_color", e.target.value)}
                    placeholder="#0f766e"
                  />
                  <Input
                    type="color"
                    aria-label="Pick accent color"
                    className="h-9 w-12 shrink-0 cursor-pointer p-1"
                    value={
                      /^#[0-9a-fA-F]{6}$/.test(form.accent_color)
                        ? form.accent_color
                        : "#0f766e"
                    }
                    onChange={(e) => updateForm("accent_color", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-cover">Cover image URL</Label>
              <Input
                id="org-cover"
                value={form.cover_image_url}
                onChange={(e) => updateForm("cover_image_url", e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-template">Default portfolio template</Label>
              <NativeSelect
                id="org-template"
                value={form.default_template_id}
                onChange={(e) => updateForm("default_template_id", e.target.value)}
              >
                <option value="">No default</option>
                {activeTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </NativeSelect>
              <p className="text-xs text-muted-foreground">
                Suggested template for new members joining this organization.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-about">About</Label>
              <Textarea
                id="org-about"
                value={form.about}
                onChange={(e) => updateForm("about", e.target.value)}
                rows={4}
                placeholder="What your team does..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-seo-title">SEO title</Label>
              <Input
                id="org-seo-title"
                value={form.seo_title}
                onChange={(e) => updateForm("seo_title", e.target.value)}
                placeholder={form.name || "Acme Studio · Team"}
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground">
                Shown as the page title in search results and browser tabs.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-seo-description">SEO description</Label>
              <Textarea
                id="org-seo-description"
                value={form.seo_description}
                onChange={(e) => updateForm("seo_description", e.target.value)}
                rows={2}
                maxLength={500}
                placeholder="A short summary shown in search results and link previews."
              />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2.5">
              <div className="min-w-0 flex-1 pr-2">
                <p className="text-sm font-medium">Public team page</p>
                <p className="text-xs text-muted-foreground">
                  Allow anyone to view your organization team page
                </p>
              </div>
              <Switch
                checked={form.is_public}
                onCheckedChange={(checked) => updateForm("is_public", checked)}
                aria-label="Public team page"
                className="shrink-0"
              />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2.5">
              <div className="min-w-0 flex-1 pr-2">
                <p className="text-sm font-medium">Featured members only</p>
                <p className="text-xs text-muted-foreground">
                  Show only featured public portfolios on the team page
                </p>
              </div>
              <Switch
                checked={form.featured_only_on_public}
                onCheckedChange={(checked) =>
                  updateForm("featured_only_on_public", checked)
                }
                aria-label="Featured members only"
                className="shrink-0"
              />
            </div>

            {isEditing ? (
              <div className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2.5">
                <div className="min-w-0 flex-1 pr-2">
                  <p className="text-sm font-medium">Verified badge</p>
                  <p className="text-xs text-muted-foreground">
                    {isOwnerPro
                      ? "Show a verified badge on your public team page"
                      : "Requires the organization owner to be on the Pro plan"}
                  </p>
                </div>
                <Switch
                  checked={form.is_verified}
                  onCheckedChange={(checked) => updateForm("is_verified", checked)}
                  disabled={!isOwnerPro}
                  aria-label="Verified badge"
                  className="shrink-0"
                />
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
              disabled={isSubmitting || form.name.trim().length < 2}
            >
              {isSubmitting
                ? isEditing
                  ? "Saving…"
                  : "Creating…"
                : isEditing
                  ? "Save changes"
                  : "Add organization"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
