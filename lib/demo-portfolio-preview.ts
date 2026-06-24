import type { MappedPublicPortfolio } from "@/lib/api/mappers";
import type { Testimonial } from "@/types";

export const DEMO_PREVIEW_TESTIMONIALS: Testimonial[] = [
  {
    id: "demo-testimonial-1",
    authorName: "Sarah Chen",
    authorRole: "Engineering Manager",
    authorCompany: "Northline Labs",
    quote:
      "Delivered polished features ahead of schedule and communicated clearly across design and engineering.",
    isPublished: true,
    source: "demo",
  },
  {
    id: "demo-testimonial-2",
    authorName: "Marcus Webb",
    authorRole: "Product Lead",
    authorCompany: "Brightstack",
    quote:
      "A strong collaborator who turns ambiguous requirements into thoughtful, user-friendly solutions.",
    isPublished: true,
    source: "demo",
  },
];

/** Enables showcase sections for template demos — forms stay display-only. */
export function buildTemplatePreviewPortfolio(
  portfolio: MappedPublicPortfolio
): MappedPublicPortfolio {
  const testimonials =
    portfolio.testimonials.length > 0
      ? portfolio.testimonials
      : DEMO_PREVIEW_TESTIMONIALS;

  return {
    ...portfolio,
    displayOnly: true,
    portfolioUsername: portfolio.portfolioUsername ?? "demo",
    contactFormEnabled: true,
    meetBookingEnabled: true,
    testimonialsEnabled: true,
    testimonialSubmissionsEnabled: true,
    allowFeedback: true,
    shareToken: portfolio.shareToken ?? "demo-preview",
    testimonials,
  };
}
