"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TemplateCard } from "@/components/cards/template-card";
import { ProUpgradeCard } from "@/components/subscription/pro-upgrade-card";
import { FormAlert } from "@/components/ui/form-alert";
import {
  TemplatesToolbar,
  type TemplateFilter,
} from "@/components/templates/templates-toolbar";
import {
  TemplateCarouselSlide,
  TemplatesCarousel,
} from "@/components/templates/templates-carousel";
import { useSubscription } from "@/hooks/use-subscription";
import { animationDelays, motion } from "@/lib/motion";
import { mapTemplate } from "@/lib/api/mappers";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { notifySuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";
import {
  useGetPortfolioSettingsQuery,
  useGetTemplatesQuery,
  useUpdatePortfolioSettingsMutation,
} from "@/store/api/portfolioApi";
import { useIsAuthenticated } from "@/store/hooks";
import type { Template } from "@/types";

const cardAnimationDelays = [
  animationDelays[100],
  animationDelays[200],
  animationDelays[300],
  animationDelays[400],
  animationDelays[500],
] as const;

function cardAnimationDelay(index: number) {
  return cardAnimationDelays[index % cardAnimationDelays.length];
}

interface TemplatesGridProps {
  selectable?: boolean;
  showToolbar?: boolean;
  layout?: "grid" | "carousel";
}

function TemplateCardSkeleton({ index }: { index: number }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card shadow-sm",
        motion.fadeInUp,
        cardAnimationDelay(index)
      )}
    >
      <div className="aspect-[5/4] animate-pulse bg-muted/50 sm:aspect-[4/3]" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-2/5 animate-pulse rounded-md bg-muted" />
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-muted/80" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-muted/80" />
        </div>
        <div className="flex gap-2 pt-1">
          <div className="h-5 w-14 animate-pulse rounded-md bg-muted/70" />
          <div className="h-5 w-10 animate-pulse rounded-md bg-muted/70" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-9 flex-1 animate-pulse rounded-lg bg-muted/60" />
          <div className="h-9 flex-1 animate-pulse rounded-lg bg-muted/60" />
        </div>
      </div>
    </div>
  );
}

export function TemplatesGrid({
  selectable,
  showToolbar = true,
  layout = "grid",
}: TemplatesGridProps) {
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
  const [filter, setFilter] = useState<TemplateFilter>("all");
  const { isPro, canUseTemplate } = useSubscription();

  const templates = useMemo(
    () => (data ?? []).filter((t) => t.is_active).map(mapTemplate),
    [data]
  );

  const freeCount = templates.filter((t) => !t.isPremium).length;
  const proCount = templates.filter((t) => t.isPremium).length;

  const filteredTemplates = useMemo(() => {
    if (filter === "free") return templates.filter((t) => !t.isPremium);
    if (filter === "pro") return templates.filter((t) => t.isPremium);
    return templates;
  }, [filter, templates]);

  const selectedTemplateId = settings?.template_id ?? null;
  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

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
    if (layout === "carousel") {
      return (
        <TemplatesCarousel>
          {Array.from({ length: 5 }).map((_, index) => (
            <TemplateCarouselSlide key={index}>
              <TemplateCardSkeleton index={index} />
            </TemplateCarouselSlide>
          ))}
        </TemplatesCarousel>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <TemplateCardSkeleton key={index} index={index} />
        ))}
      </div>
    );
  }

  if (isError || !templates.length) {
    return (
      <div className="rounded-2xl border border-dashed bg-muted/20 px-6 py-14 text-center sm:px-12 sm:py-16">
        <p className="text-base font-medium text-foreground">No templates available</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Check back soon or refresh the page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {error ? <FormAlert message={error} /> : null}

      {!isPro && canSelect ? (
        <ProUpgradeCard
          compact
          title="Unlock all templates"
          description="Free includes Minimal and Bold. Upgrade to Pro for Modern, Professional, Creative, Elegant, Developer, and Aurora."
        />
      ) : null}

      {showToolbar ? (
        <TemplatesToolbar
          filter={filter}
          onFilterChange={setFilter}
          totalCount={templates.length}
          freeCount={freeCount}
          proCount={proCount}
          selectedName={canSelect ? selectedTemplate?.name : null}
        />
      ) : null}

      {filteredTemplates.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-muted/20 px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No {filter === "pro" ? "Pro" : "free"} templates in this view.
          </p>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className="mt-3 text-sm font-medium text-primary hover:underline"
          >
            Show all templates
          </button>
        </div>
      ) : layout === "carousel" ? (
        <TemplatesCarousel>
          {filteredTemplates.map((template, index) => (
            <TemplateCarouselSlide key={template.id}>
              <div className={cn(motion.fadeInUp, cardAnimationDelay(index))}>
                <TemplateCard
                  template={template}
                  layout={canSelect ? "select" : "browse"}
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
              </div>
            </TemplateCarouselSlide>
          ))}
        </TemplatesCarousel>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 2xl:grid-cols-4">
          {filteredTemplates.map((template, index) => (
            <div
              key={template.id}
              className={cn(motion.fadeInUp, cardAnimationDelay(index))}
            >
              <TemplateCard
                template={template}
                layout={canSelect ? "select" : "browse"}
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
            </div>
          ))}
        </div>
      )}

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
