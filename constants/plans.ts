export const PLAN_FREE = "free" as const;
export const PLAN_PRO = "pro" as const;

export const PAYMENT_PATH = "/payment" as const;

export type SubscriptionPlan = typeof PLAN_FREE | typeof PLAN_PRO;

/** Templates available on the free plan */
export const FREE_TEMPLATE_SLUGS = ["minimal", "bold"] as const;

export const PRO_MONTHLY_PRICE = 12;
export const PRO_QUARTERLY_PRICE = 30;
export const PRO_ANNUAL_PRICE = 99;

export type ProBillingInterval = "monthly" | "quarterly" | "annual";

export interface ProBillingOption {
  id: ProBillingInterval;
  label: string;
  price: number;
  periodLabel: string;
  perMonth: number;
  savings?: string;
  popular?: boolean;
}

export const PRO_BILLING_OPTIONS: ProBillingOption[] = [
  {
    id: "monthly",
    label: "Monthly",
    price: PRO_MONTHLY_PRICE,
    periodLabel: "/ month",
    perMonth: PRO_MONTHLY_PRICE,
  },
  {
    id: "quarterly",
    label: "3 months",
    price: PRO_QUARTERLY_PRICE,
    periodLabel: "every 3 months",
    perMonth: 10,
    savings: "Save 17%",
    popular: true,
  },
  {
    id: "annual",
    label: "Annual",
    price: PRO_ANNUAL_PRICE,
    periodLabel: "/ year",
    perMonth: 8.25,
    savings: "Save 31%",
  },
];

export const PLAN_FEATURES = {
  free: [
    "Public portfolio URL",
    "2 templates (Minimal & Bold)",
    "Full portfolio builder",
    "Basic view count",
    "Contact form",
  ],
  pro: [
    "All 8 templates (includes Modern & Aurora)",
    "Unlimited AI assistance",
    "AI cover letter generator",
    "Video introduction section",
    "Full analytics & referrers",
    "Portfolio variants for job targeting",
    "Private share links with expiry",
    "Google Meet booking on your portfolio",
    "Priority support",
  ],
} as const;

export function isProPlan(plan: string | null | undefined): boolean {
  return plan === PLAN_PRO;
}

/** True only when NEXT_PUBLIC_BYPASS_PRO_GATING=true (local testing). */
export function isProGatingBypassed(): boolean {
  return process.env.NEXT_PUBLIC_BYPASS_PRO_GATING === "true";
}

export function isFreeTemplateSlug(slug: string): boolean {
  return (FREE_TEMPLATE_SLUGS as readonly string[]).includes(slug);
}

export function isPremiumTemplateSlug(slug: string): boolean {
  return !isFreeTemplateSlug(slug);
}
