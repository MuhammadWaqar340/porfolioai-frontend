"use client";

import type { ReactNode } from "react";
import { Code2, Globe, Link2, Mail, Phone, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { LogoMark } from "@/components/brand/logo-mark";
import { PortfolioCertifications } from "@/components/portfolio/portfolio-certifications";
import { PortfolioContactForm } from "@/components/portfolio/portfolio-contact-form";
import { PortfolioEducation } from "@/components/portfolio/portfolio-education";
import { PortfolioExperience } from "@/components/portfolio/portfolio-experience";
import { PortfolioIntroVideoSection } from "@/components/portfolio/portfolio-intro-video-section";
import { PortfolioFeedbackForm } from "@/components/portfolio/portfolio-feedback-form";
import { PortfolioMeetBooking } from "@/components/portfolio/portfolio-meet-booking";
import { PortfolioProjects } from "@/components/portfolio/portfolio-projects";
import { PortfolioTestimonials } from "@/components/portfolio/portfolio-testimonials";
import { PortfolioTestimonialSubmitForm } from "@/components/portfolio/portfolio-testimonial-submit-form";
import { PortfolioSkills } from "@/components/portfolio/portfolio-skills";
import {
  templateBodyBackdrop,
  templateBodyStyles,
} from "@/components/portfolio/templates/template-styles";
import {
  TemplateSection,
  TemplateSeparator,
  type PortfolioSectionId,
} from "@/components/portfolio/templates/template-section";
import {
  templateNavStyles,
} from "@/components/portfolio/templates/template-motion";
import { buttonVariants } from "@/components/ui/button";
import type { TemplateSlug } from "@/constants/templates";
import { useOptionalDemoPortfolio } from "@/contexts/portfolio-demo-context";
import { useProfile } from "@/hooks/use-profile";
import { shouldShowIntroVideo } from "@/lib/intro-video";
import type { Profile } from "@/types";
import { cn } from "@/lib/utils";

export function hasUrl(url: string): boolean {
  return Boolean(url?.trim());
}

type ContactVariant =
  | "default"
  | "minimal"
  | "professional"
  | "creative"
  | "elegant"
  | "developer"
  | "bold"
  | "aurora";

/** Strip app gradient button styles — used for minimal/elegant contact chips */
const contactGradientReset =
  "!bg-none !shadow-none hover:!shadow-none";

const contactTransparentBg =
  "!bg-transparent hover:!bg-transparent";

interface ContactVariantStyle {
  wrapper: string;
  outline: string;
  primary: string;
  usePlainLinks: boolean;
}

const contactVariantClasses: Record<ContactVariant, ContactVariantStyle> = {
  default: {
    wrapper: "gap-3",
    outline: "",
    primary: "",
    usePlainLinks: false,
  },
  minimal: {
    wrapper: "gap-x-7 gap-y-3 sm:gap-x-9",
    outline: cn(
      contactGradientReset,
      contactTransparentBg,
      "inline-flex h-auto min-h-0 min-w-0 items-center gap-2 rounded-none border-0 border-b border-border/50 bg-transparent px-0 py-2 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground",
      "transition-colors duration-300 hover:scale-100 hover:border-foreground/70 hover:bg-transparent hover:text-foreground",
      "[&_svg]:size-3.5 [&_svg]:text-foreground/45"
    ),
    primary: cn(
      contactGradientReset,
      contactTransparentBg,
      "inline-flex h-auto min-h-0 min-w-0 items-center gap-2 rounded-none border-0 border-b-2 border-foreground bg-transparent px-0 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-foreground",
      "transition-colors duration-300 hover:scale-100 hover:bg-transparent",
      "[&_svg]:size-3.5"
    ),
    usePlainLinks: true,
  },
  professional: {
    wrapper: "gap-3",
    outline: "rounded-md border-border/80 bg-background",
    primary: "rounded-md",
    usePlainLinks: false,
  },
  creative: {
    wrapper: "gap-3",
    outline: "rounded-full border-primary/30 bg-primary/5 hover:bg-primary/10",
    primary: "rounded-full",
    usePlainLinks: false,
  },
  elegant: {
    wrapper: "gap-2.5 sm:gap-3",
    outline: cn(
      contactGradientReset,
      contactTransparentBg,
      "inline-flex h-9 min-w-0 items-center gap-2 rounded-sm border border-amber-500/30 bg-background/70 px-4 text-sm text-foreground/85 backdrop-blur-sm",
      "transition-all duration-300 hover:scale-100 hover:border-amber-500/50 hover:bg-amber-500/[0.07] hover:text-amber-950 dark:hover:text-amber-50",
      "[&_svg]:size-3.5 [&_svg]:text-amber-700/70 dark:[&_svg]:text-amber-300/80"
    ),
    primary: cn(
      contactGradientReset,
      "!bg-amber-800 !text-white",
      "inline-flex h-9 min-w-0 items-center gap-2 rounded-sm border border-amber-800/80 px-4 text-sm font-medium",
      "transition-all duration-300 hover:scale-100 hover:!bg-amber-900 hover:border-amber-900",
      "dark:!bg-amber-600 dark:!text-white dark:border-amber-500/70 dark:hover:!bg-amber-500",
      "[&_svg]:size-3.5 [&_svg]:!text-white"
    ),
    usePlainLinks: true,
  },
  developer: {
    wrapper: "gap-3",
    outline:
      "rounded-md border-emerald-500/30 bg-zinc-900/60 font-mono text-xs text-emerald-300 hover:border-emerald-400/50 hover:bg-emerald-500/10",
    primary:
      "rounded-md border-emerald-400 bg-emerald-500/20 font-mono text-xs text-emerald-200",
    usePlainLinks: false,
  },
  bold: {
    wrapper: "gap-3",
    outline:
      "rounded-none border-2 border-foreground bg-transparent font-bold uppercase shadow-[3px_3px_0_0_var(--foreground)] hover:translate-x-0.5 hover:translate-y-0.5",
    primary:
      "rounded-none border-2 border-foreground bg-foreground font-bold uppercase text-background shadow-[3px_3px_0_0_var(--foreground)]",
    usePlainLinks: false,
  },
  aurora: {
    wrapper: "gap-3",
    outline:
      "rounded-none border border-violet-500/25 bg-transparent px-4 text-sm text-foreground transition-colors hover:border-rose-500/40 hover:bg-rose-500/[0.05]",
    primary:
      "rounded-none border border-violet-900 bg-violet-950 px-4 text-sm text-violet-50 hover:bg-violet-900 dark:border-violet-700 dark:bg-violet-800",
    usePlainLinks: false,
  },
};

function contactLinkClass(
  variant: ContactVariant,
  kind: "outline" | "primary",
  extra?: string
) {
  const styles = contactVariantClasses[variant];
  const variantClass = kind === "primary" ? styles.primary : styles.outline;

  if (styles.usePlainLinks) {
    return cn(
      "group/button select-none outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
      variantClass,
      extra
    );
  }

  return cn(
    buttonVariants({
      variant: kind === "primary" ? "default" : "outline",
      size: "sm",
    }),
    "transition-all duration-300 ease-out hover:scale-[1.02]",
    variantClass,
    extra
  );
}

interface ContactLinksProps {
  profile: Profile;
  className?: string;
  variant?: ContactVariant;
}

interface ContactHoverLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
}

function ContactHoverLink({
  href,
  icon: Icon,
  label,
  value,
  variant,
  className,
}: ContactHoverLinkProps & { variant: ContactVariant }) {
  const plain = contactVariantClasses[variant].usePlainLinks;

  return (
    <Link
      href={href}
      title={value}
      className={contactLinkClass(
        variant,
        "outline",
        cn(
          plain ? "justify-center" : "group min-w-[5.75rem] justify-center",
          className
        )
      )}
    >
      <Icon className={cn("shrink-0", plain ? "" : "mr-1.5 h-4 w-4")} />
      <span className={plain ? "ml-2" : "group-hover:hidden group-focus-visible:hidden"}>
        {label}
      </span>
      {!plain ? (
        <span className="hidden max-w-[14rem] truncate group-hover:inline group-focus-visible:inline">
          {value}
        </span>
      ) : null}
    </Link>
  );
}

export function ContactLinks({
  profile,
  className,
  variant = "default",
}: ContactLinksProps) {
  const styles = contactVariantClasses[variant];
  const plain = styles.usePlainLinks;

  return (
    <div className={cn("flex flex-wrap items-center", styles.wrapper, className)}>
      {hasUrl(profile.phone) && (
        <ContactHoverLink
          href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}
          icon={Phone}
          label="Phone"
          value={profile.phone.trim()}
          variant={variant}
        />
      )}
      {hasUrl(profile.email) && (
        <ContactHoverLink
          href={`mailto:${profile.email}`}
          icon={Mail}
          label="Email"
          value={profile.email.trim()}
          variant={variant}
        />
      )}
      {hasUrl(profile.linkedin) && (
        <Link
          href={profile.linkedin}
          target="_blank"
          className={contactLinkClass(variant, "outline")}
        >
          <Link2 className={cn("shrink-0", plain ? "" : "mr-1.5 h-4 w-4")} />
          <span className={plain ? "ml-2" : undefined}>LinkedIn</span>
        </Link>
      )}
      {hasUrl(profile.github) && (
        <Link
          href={profile.github}
          target="_blank"
          className={contactLinkClass(variant, "outline")}
        >
          <Code2 className={cn("shrink-0", plain ? "" : "mr-1.5 h-4 w-4")} />
          <span className={plain ? "ml-2" : undefined}>GitHub</span>
        </Link>
      )}
      {hasUrl(profile.website) && (
        <Link
          href={profile.website}
          target="_blank"
          className={contactLinkClass(variant, "primary")}
        >
          <Globe className={cn("shrink-0", plain ? "" : "mr-1.5 h-4 w-4")} />
          <span className={plain ? "ml-2" : undefined}>Website</span>
        </Link>
      )}
    </div>
  );
}

interface PortfolioBodyProps {
  template: TemplateSlug;
  className?: string;
}

export function PortfolioBody({ template, className }: PortfolioBodyProps) {
  const portfolio = useOptionalDemoPortfolio();
  const { profile: authProfile } = useProfile();
  const profile = portfolio?.profile ?? authProfile;
  const showIntroVideo = shouldShowIntroVideo(profile);
  let sectionIndex = 0;

  function nextSection(sectionId: PortfolioSectionId, children: ReactNode) {
    const index = sectionIndex++;
    return (
      <TemplateSection template={template} sectionId={sectionId} id={sectionId} index={index}>
        {children}
      </TemplateSection>
    );
  }

  return (
    <div className={cn(templateBodyBackdrop[template], templateBodyStyles[template], className)}>
      <div className="relative z-[1] space-y-10 sm:space-y-12">
      {portfolio?.variantName ? (
        <p className="mb-4 text-sm font-medium text-primary">
          Viewing variant: {portfolio.variantName}
        </p>
      ) : null}
      {showIntroVideo ? (
        <>
          {nextSection("intro-video", <PortfolioIntroVideoSection />)}
          <TemplateSeparator template={template} />
        </>
      ) : null}
      {nextSection("skills", <PortfolioSkills />)}
      <TemplateSeparator template={template} />
      {nextSection("projects", <PortfolioProjects />)}
      <TemplateSeparator template={template} />
      {nextSection("experience", <PortfolioExperience />)}
      <TemplateSeparator template={template} />
      {nextSection("education", <PortfolioEducation />)}
      <TemplateSeparator template={template} />
      {nextSection("certifications", <PortfolioCertifications />)}
      <TemplateSeparator template={template} />
      {nextSection(
        "testimonials",
        <>
          <PortfolioTestimonials />
          <div className="mt-4">
            <PortfolioTestimonialSubmitForm />
          </div>
        </>
      )}
      <TemplateSeparator template={template} />
      {nextSection(
        "contact",
        <div data-portfolio-section="contact" className="portfolio-stagger-children space-y-4">
          <PortfolioMeetBooking />
          <div className="mt-4">
            <PortfolioContactForm />
          </div>
          <div className="mt-4">
            <PortfolioFeedbackForm />
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

interface PortfolioFooterProps {
  className?: string;
  template?: TemplateSlug;
}

export function PortfolioFooter({ className, template }: PortfolioFooterProps) {
  return (
    <footer
      className={cn(
        "border-t py-12 text-center text-sm text-muted-foreground",
        template === "modern" &&
          "border-primary/10 bg-gradient-to-b from-primary/[0.03] via-background to-violet-500/[0.04]",
        template === "minimal" &&
          "border-none bg-gradient-to-b from-muted/20 to-background py-14 text-xs tracking-wide",
        template === "creative" && "border-none bg-gradient-to-r from-primary/5 via-fuchsia-500/5 to-sky-500/5",
        template === "professional" &&
          "border-border/60 bg-gradient-to-r from-muted/30 via-background to-primary/[0.03]",
        template === "elegant" &&
          "border-amber-500/15 bg-gradient-to-t from-amber-500/[0.06] to-background",
        template === "developer" &&
          "border-emerald-600/15 bg-gradient-to-b from-emerald-50/60 to-background text-muted-foreground dark:border-emerald-500/20 dark:from-zinc-950 dark:to-zinc-900 dark:text-zinc-400",
        template === "bold" &&
          "border-t-4 border-foreground bg-gradient-to-r from-foreground/[0.04] via-background to-foreground/[0.04] py-12 font-bold uppercase tracking-wide",
        template === "aurora" &&
          "border-none bg-[#faf9f7] pt-10 pb-14 dark:bg-background",
        className
      )}
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4">
        <div
          className={cn(
            "h-px w-16",
            template === "modern" && "bg-gradient-to-r from-primary/60 to-violet-500/60",
            template === "minimal" && "bg-foreground/25",
            template === "professional" && "bg-primary/50",
            template === "creative" &&
              "bg-gradient-to-r from-primary via-fuchsia-500 to-sky-500",
            template === "elegant" && "bg-amber-500/50",
            template === "developer" && "bg-emerald-500/50",
            template === "bold" && "h-1 w-12 bg-foreground",
            template === "aurora" &&
              "bg-gradient-to-r from-violet-600/60 via-rose-500/50 to-violet-600/60",
            !template && "bg-border"
          )}
          aria-hidden
        />
        <Link
          href="/"
          className="rounded-md transition-all duration-300 hover:opacity-85 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          aria-label="PortfolioAI — go to homepage"
        >
          <LogoMark className="h-8 w-8" />
        </Link>
        <p className="max-w-sm leading-relaxed">
          Built with{" "}
          <span
            className={cn(
              "font-semibold text-foreground",
              template === "creative" && "text-gradient",
              template === "modern" && "text-gradient",
              template === "elegant" && "text-amber-700 dark:text-amber-300",
              template === "developer" && "font-mono text-emerald-700 dark:text-emerald-400",
              template === "bold" && "uppercase tracking-tight",
              template === "minimal" && "tracking-wide",
              template === "aurora" &&
                "font-heading text-violet-800 dark:text-rose-300",
            )}
          >
            PortfolioAI
          </span>
        </p>
      </div>
    </footer>
  );
}

interface TemplateNavProps {
  className?: string;
  template?: TemplateSlug;
}

const NAV_ITEMS = [
  { href: "#intro-video", label: "Intro" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#certifications", label: "Certs" },
  { href: "#testimonials", label: "Quotes" },
  { href: "#contact", label: "Contact" },
];

export function TemplateNav({ className, template = "modern" }: TemplateNavProps) {
  const demo = useOptionalDemoPortfolio();
  const { profile: authProfile } = useProfile();
  const profile = demo?.profile ?? authProfile;
  const navItems = shouldShowIntroVideo(profile)
    ? NAV_ITEMS
    : NAV_ITEMS.filter((item) => item.href !== "#intro-video");

  return (
    <nav
      className={cn(
        "sticky top-0 z-20 border-b backdrop-blur-xl transition-all duration-300",
        "shadow-[0_1px_0_0_oklch(1_0_0/5%_inset),0_4px_24px_-12px_oklch(0_0_0/12%)]",
        templateNavStyles[template],
        className
      )}
    >
      <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 py-3 scrollbar-none sm:gap-1.5 sm:px-6">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-2 text-xs font-medium text-muted-foreground",
              "transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
              template === "modern" &&
                "hover:bg-gradient-to-r hover:from-primary/10 hover:to-violet-500/10 hover:text-primary",
              template === "minimal" &&
                "rounded-none hover:text-foreground hover:underline hover:underline-offset-4",
              template === "professional" &&
                "rounded-sm hover:bg-primary/10 hover:text-primary",
              template === "creative" &&
                "hover:border-primary/40 hover:bg-primary/10 hover:text-primary",
              template === "elegant" &&
                "rounded-none hover:text-amber-700 dark:hover:text-amber-300",
              template === "developer" &&
                "hover:border-emerald-600/40 hover:bg-emerald-100 hover:text-emerald-900 dark:hover:border-emerald-400/50 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-300",
              template === "bold" &&
                "rounded-none hover:bg-foreground hover:text-background",
              template === "aurora" &&
                "rounded-none hover:bg-violet-500/10 hover:text-violet-900 dark:hover:text-rose-200",
            )}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
