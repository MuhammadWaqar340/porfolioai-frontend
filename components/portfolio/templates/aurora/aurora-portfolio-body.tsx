"use client";

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
import { AuroraSection } from "@/components/portfolio/templates/aurora/aurora-section";
import { useOptionalDemoPortfolio } from "@/contexts/portfolio-demo-context";
import { useProfile } from "@/hooks/use-profile";
import { shouldShowIntroVideo } from "@/lib/intro-video";
import { cn } from "@/lib/utils";

interface AuroraPortfolioBodyProps {
  className?: string;
}

export function AuroraPortfolioBody({ className }: AuroraPortfolioBodyProps) {
  const portfolio = useOptionalDemoPortfolio();
  const { profile: authProfile } = useProfile();
  const profile = portfolio?.profile ?? authProfile;
  const showIntroVideo = shouldShowIntroVideo(profile);
  let sectionIndex = 0;

  return (
    <div
      className={cn(
        "relative",
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-[min(28rem,40%)] before:bg-[linear-gradient(180deg,oklch(0.35_0.12_320/3%)_0%,transparent_100%)] dark:before:bg-[linear-gradient(180deg,oklch(0.45_0.12_300/8%)_0%,transparent_100%)]",
        className
      )}
    >
      <div className="relative z-[1] space-y-0">
        {portfolio?.variantName ? (
          <p className="mx-auto max-w-5xl px-4 pt-6 text-sm font-medium text-violet-800 dark:text-rose-300">
            Viewing variant: {portfolio.variantName}
          </p>
        ) : null}

        {showIntroVideo ? (
          <AuroraSection
            id="intro-video"
            variant="cinema"
            index={sectionIndex++}
            number="00"
            label="Introduction"
            subtitle="A personal video message to set the tone."
            className="mx-4 mt-8 sm:mx-6 lg:mx-auto lg:max-w-5xl"
          >
            <PortfolioIntroVideoSection />
          </AuroraSection>
        ) : null}

        <AuroraSection
          id="skills"
          variant="constellation"
          index={sectionIndex++}
          number="01"
          label="Expertise"
          subtitle="Tools and disciplines that shape my work."
          className="mt-10 sm:mt-14"
        >
          <PortfolioSkills />
        </AuroraSection>

        <AuroraSection
          id="projects"
          variant="showcase"
          index={sectionIndex++}
          number="02"
          label="Selected Work"
          subtitle="Projects that reflect craft, curiosity, and impact."
          className="mx-4 mt-10 sm:mx-6 lg:mx-auto lg:max-w-5xl"
        >
          <PortfolioProjects />
        </AuroraSection>

        <AuroraSection
          id="experience"
          variant="timeline"
          index={sectionIndex++}
          number="03"
          label="Career Path"
          subtitle="Roles and milestones along the way."
          className="mx-4 mt-10 sm:mx-6 lg:mx-auto lg:max-w-5xl"
        >
          <PortfolioExperience />
        </AuroraSection>

        <AuroraSection
          id="education"
          variant="academy"
          index={sectionIndex++}
          number="04"
          label="Education"
          subtitle="Formal training and academic foundations."
          className="mx-4 mt-10 sm:mx-6 lg:mx-auto lg:max-w-5xl"
        >
          <PortfolioEducation />
        </AuroraSection>

        <AuroraSection
          id="certifications"
          variant="honors"
          index={sectionIndex++}
          number="05"
          label="Credentials"
          subtitle="Verified certifications and achievements."
          className="mt-10 sm:mt-14"
        >
          <PortfolioCertifications />
        </AuroraSection>

        <AuroraSection
          id="testimonials"
          variant="voices"
          index={sectionIndex++}
          number="06"
          label="Kind Words"
          subtitle="What collaborators and clients have shared."
          className="mx-4 mt-10 sm:mx-6 lg:mx-auto lg:max-w-5xl"
        >
          <PortfolioTestimonials />
          <div className="mt-8 border-t border-violet-500/15 pt-8">
            <PortfolioTestimonialSubmitForm />
          </div>
        </AuroraSection>

        <AuroraSection
          id="contact"
          variant="reach"
          index={sectionIndex++}
          number="07"
          label="Get in Touch"
          subtitle="Share a brief note — I read every message and respond thoughtfully."
          className="mx-4 mt-10 sm:mx-6 lg:mx-auto lg:max-w-5xl"
        >
          <div data-portfolio-section="contact" className="aurora-reach-forms portfolio-stagger-children">
            <PortfolioMeetBooking />
            <PortfolioContactForm />
            <PortfolioFeedbackForm />
          </div>
        </AuroraSection>
      </div>
    </div>
  );
}
