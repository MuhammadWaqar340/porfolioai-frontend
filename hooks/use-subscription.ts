"use client";

import {
  FREE_TEMPLATE_SLUGS,
  isProGatingBypassed,
  isProPlan,
  type SubscriptionPlan,
} from "@/constants/plans";
import { useGetSubscriptionPlanQuery } from "@/store/api/portfolioApi";
import { useAppSelector } from "@/store/hooks";

export function useSubscription() {
  const user = useAppSelector((state) => state.auth.user);
  const planFromUser = (user && "subscription_plan" in user
    ? user.subscription_plan
    : undefined) as SubscriptionPlan | undefined;

  const { data: planData, isLoading } = useGetSubscriptionPlanQuery(undefined, {
    skip: !user,
  });

  const plan = planData?.plan ?? planFromUser ?? "free";
  const bypassPro = isProGatingBypassed();
  const isPro = bypassPro || (planData?.is_pro ?? isProPlan(plan));
  const canUseAI = isPro;

  return {
    plan,
    isPro,
    bypassPro,
    canUseAI,
    isLoading,
    freeTemplateSlugs: planData?.free_template_slugs ?? [...FREE_TEMPLATE_SLUGS],
    features: planData?.features ?? {
      all_templates: isPro,
      intro_video: isPro,
      full_analytics: isPro,
      portfolio_variants: isPro,
      private_share_links: isPro,
      unlimited_ai: isPro,
      meet_booking: isPro,
      job_application_tracker: true,
      unlimited_job_applications: isPro,
      unlimited_organizations: isPro,
      org_verified_badge: isPro,
      org_embed_widget: true,
      org_departments: true,
      org_limit: isPro ? -1 : 1,
      org_seat_limit: isPro ? 50 : 5,
    },
    canUseTemplate(slug: string) {
      return (
        isPro ||
        FREE_TEMPLATE_SLUGS.includes(slug as (typeof FREE_TEMPLATE_SLUGS)[number])
      );
    },
  };
}
