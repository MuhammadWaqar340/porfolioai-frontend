"use client";

import { Copy, Layers, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { notifySuccess } from "@/lib/toast";
import { useSubscription } from "@/hooks/use-subscription";
import { ProUpgradeCard } from "@/components/subscription/pro-upgrade-card";
import {
  useCreatePortfolioVariantMutation,
  useDeletePortfolioVariantMutation,
  useGetPortfolioVariantsQuery,
  useGetProjectsQuery,
} from "@/store/api/portfolioApi";
import { cn } from "@/lib/utils";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function PortfolioVariantsPanel() {
  const { isPro } = useSubscription();
  const { data: variants = [], isLoading } = useGetPortfolioVariantsQuery();
  const { data: projects = [] } = useGetProjectsQuery();
  const [createVariant, { isLoading: isCreating }] = useCreatePortfolioVariantMutation();
  const [deleteVariant] = useDeletePortfolioVariantMutation();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [titleOverride, setTitleOverride] = useState("");
  const [aboutOverride, setAboutOverride] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const finalSlug = slug || slugify(name);
    if (!name.trim() || !finalSlug) return;

    try {
      await createVariant({
        name: name.trim(),
        slug: finalSlug,
        title_override: titleOverride.trim() || undefined,
        about_override: aboutOverride.trim() || undefined,
        featured_project_ids: projects.slice(0, 3).map((p) => p.id),
      }).unwrap();
      setName("");
      setSlug("");
      setTitleOverride("");
      setAboutOverride("");
      notifySuccess("Portfolio variant created.");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  async function handleCopy(url: string) {
    await navigator.clipboard.writeText(url);
    notifySuccess("Preview link copied.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          Portfolio variants
        </CardTitle>
        <CardDescription>
          Create job-specific snapshots with a custom headline, about section, and featured projects.
          Open with <code className="text-xs">?variant=slug</code> on your public URL.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isPro ? (
          <ProUpgradeCard
            compact
            title="Portfolio variants are Pro"
            description="Create tailored portfolio versions for different job applications with custom headlines and featured projects."
          />
        ) : null}
        <form
          onSubmit={(e) => void handleCreate(e)}
          className={cn("space-y-3 rounded-lg border p-4", !isPro && "pointer-events-none opacity-60")}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="variant-name">Variant name</Label>
              <Input
                id="variant-name"
                placeholder="e.g. Data Science role"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slug) setSlug(slugify(e.target.value));
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="variant-slug">URL slug</Label>
              <Input
                id="variant-slug"
                placeholder="data-science"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="variant-title">Headline override (optional)</Label>
            <Input
              id="variant-title"
              value={titleOverride}
              onChange={(e) => setTitleOverride(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="variant-about">About override (optional)</Label>
            <Textarea
              id="variant-about"
              rows={3}
              value={aboutOverride}
              onChange={(e) => setAboutOverride(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" size="sm" disabled={isCreating}>
            {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Create variant
          </Button>
        </form>

        {isLoading ? (
          <div className="h-20 animate-pulse rounded-lg bg-muted/40" />
        ) : variants.length > 0 ? (
          <ul className="space-y-2">
            {variants.map((variant) => (
              <li
                key={variant.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{variant.name}</p>
                  <p className="text-xs text-muted-foreground">/{variant.slug}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => void handleCopy(variant.preview_url)}
                  >
                    <Copy className="mr-1 h-3.5 w-3.5" />
                    Copy link
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => void deleteVariant(variant.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No variants yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
