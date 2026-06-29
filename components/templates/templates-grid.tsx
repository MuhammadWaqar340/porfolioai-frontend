"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TemplateCard } from "@/components/cards/template-card";
import { ProUpgradeCard } from "@/components/subscription/pro-upgrade-card";
import { FormAlert } from "@/components/ui/form-alert";
import { useSubscription } from "@/hooks/use-subscription";
import { mapTemplate } from "@/lib/api/mappers";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { notifySuccess } from "@/lib/toast";
import {
  useGetPortfolioSettingsQuery,
  useGetTemplatesQuery,
  useUpdatePortfolioSettingsMutation,
} from "@/store/api/portfolioApi";
import { useIsAuthenticated } from "@/store/hooks";
import type { Template } from "@/types";

interface TemplatesGridProps {
  selectable?: boolean;
}

export function TemplatesGrid({ selectable }: TemplatesGridProps) {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const canSelect = selectable ?? isAuthenticated;
  const { data, isLoading, isError } = useGetTemplatesQuery();
  const { data: settings } = useGetPortfolioSettingsQuery(undefined, {
    skip: !canSelect,
  });
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdatePortfolioSettingsMutation();
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isPro, canUseTemplate } = useSubscription();

  async function handleSelect(template: Template) {
    if (!canUseTemplate(template.slug)) return;
    setError(null);
    setSelectingId(template.id);
    try {
      await updateSettings({ template_id: template.id }).unwrap();
      notifySuccess(`${template.name} template applied. Open Preview to see it.`);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSelectingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-72 animate-pulse rounded-xl border bg-muted/40"
          />
        ))}
      </div>
    );
  }

  if (isError || !data?.length) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
        No templates available right now.
      </div>
    );
  }

  const templates = data
    .filter((template) => template.is_active)
    .map(mapTemplate);

  const selectedTemplateId = settings?.template_id ?? null;

  return (
    <div className="space-y-4">
      {error ? <FormAlert message={error} /> : null}
      {!isPro ? (
        <ProUpgradeCard
          compact
          title="Unlock all templates"
          description="Free includes Minimal and Bold. Upgrade to Pro for Modern, Professional, Creative, Elegant, Developer, and Aurora."
        />
      ) : null}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplateId === template.id}
            isSelecting={selectingId === template.id && isUpdating}
            isLocked={canSelect && !canUseTemplate(template.slug)}
            onSelect={canSelect ? handleSelect : undefined}
            previewFrom={canSelect ? "templates" : undefined}
            actionLabel={canSelect ? undefined : "Get started"}
            onAction={
              canSelect
                ? undefined
                : () => {
                    router.push("/signup");
                  }
            }
          />
        ))}
      </div>
      {canSelect && selectedTemplateId ? (
        <p className="text-center text-sm text-muted-foreground">
          View your portfolio in{" "}
          <Link href="/preview" className="font-medium text-primary hover:underline">
            Preview
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}
