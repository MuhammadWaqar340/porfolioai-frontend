import { resolveAssetUrl } from "@/lib/api/asset-url";
import type {
  ApiCertification,
  ApiEducation,
  ApiExperience,
  ApiIntroVideo,
  ApiNotification,
  ApiProfile,
  ApiProject,
  ApiSkillCategory,
  ApiTemplate,
  PublicPortfolio,
} from "@/lib/api/types";
import type { PortfolioTestimonial as ApiPortfolioTestimonial } from "@/lib/api/types";
import { resolveTemplateSlug, type TemplateSlug } from "@/constants/templates";
import type {
  Certification,
  Education,
  Experience,
  IntroVideo,
  Profile,
  Project,
  SkillCategory,
  Template,
  Testimonial,
  Notification,
} from "@/types";

export function mapProfile(api: ApiProfile): Profile {
  return {
    id: api.id,
    fullName: api.full_name,
    title: api.title,
    about: api.about,
    email: api.email,
    phone: api.phone,
    location: api.location,
    linkedin: api.linkedin,
    github: api.github,
    website: api.website,
    avatarUrl: resolveAssetUrl(api.avatar_url),
    introVideoUrl: api.intro_video_url,
    introVideoEnabled: api.intro_video_enabled,
    introVideoScript: api.intro_video_script,
  };
}

export function mapProfileToApi(
  profile: Partial<Profile>
): Record<string, string | boolean> {
  const body: Record<string, string | boolean> = {};
  if (profile.fullName !== undefined) body.full_name = profile.fullName;
  if (profile.title !== undefined) body.title = profile.title;
  if (profile.about !== undefined) body.about = profile.about;
  if (profile.email !== undefined) body.email = profile.email;
  if (profile.phone !== undefined) body.phone = profile.phone;
  if (profile.location !== undefined) body.location = profile.location;
  if (profile.linkedin !== undefined) body.linkedin = profile.linkedin;
  if (profile.github !== undefined) body.github = profile.github;
  if (profile.website !== undefined) body.website = profile.website;
  return body;
}

export function mapIntroVideo(api: ApiIntroVideo): IntroVideo {
  return {
    introVideoUrl: api.intro_video_url,
    introVideoEnabled: api.intro_video_enabled,
    introVideoScript: api.intro_video_script,
  };
}

export function mapIntroVideoToApi(
  introVideo: Partial<IntroVideo>
): Record<string, string | boolean> {
  const body: Record<string, string | boolean> = {};
  if (introVideo.introVideoUrl !== undefined) {
    body.intro_video_url = introVideo.introVideoUrl;
  }
  if (introVideo.introVideoEnabled !== undefined) {
    body.intro_video_enabled = introVideo.introVideoEnabled;
  }
  if (introVideo.introVideoScript !== undefined) {
    body.intro_video_script = introVideo.introVideoScript;
  }
  return body;
}

function toStoredAssetPath(url: string): string {
  if (!url) return "";
  if (url.startsWith("/uploads/")) return url;

  try {
    const { pathname } = new URL(url);
    if (pathname.startsWith("/uploads/")) return pathname;
  } catch {
    // Keep external URLs as-is.
  }

  return url;
}

function resolveProjectImageUrls(api: ApiProject): string[] {
  const raw =
    api.image_urls && api.image_urls.length > 0
      ? api.image_urls
      : api.image_url
        ? [api.image_url]
        : [];

  return raw.map(resolveAssetUrl).filter(Boolean);
}

export function mapProject(api: ApiProject): Project {
  const imageUrls = resolveProjectImageUrls(api);

  return {
    id: api.id,
    title: api.title,
    description: api.description,
    imageUrl: imageUrls[0] ?? "",
    imageUrls,
    technologies: api.technologies ?? [],
    githubUrl: api.github_url,
    liveUrl: api.live_url,
  };
}

export function mapProjectToApi(project: Omit<Project, "id">) {
  const imageUrls = (
    project.imageUrls.length > 0
      ? project.imageUrls
      : project.imageUrl
        ? [project.imageUrl]
        : []
  ).map(toStoredAssetPath);

  return {
    title: project.title,
    description: project.description,
    image_url: imageUrls[0] ?? "",
    image_urls: imageUrls,
    technologies: project.technologies,
    github_url: project.githubUrl,
    live_url: project.liveUrl,
  };
}

export function mapExperience(api: ApiExperience): Experience {
  return {
    id: api.id,
    company: api.company,
    position: api.position,
    startMonth: api.start_month,
    startYear: api.start_year,
    endMonth: api.end_month,
    endYear: api.end_year,
    isPresent: api.is_present,
    description: api.description,
  };
}

export function mapExperienceToApi(exp: Omit<Experience, "id">) {
  return {
    company: exp.company,
    position: exp.position,
    start_month: exp.startMonth,
    start_year: exp.startYear,
    end_month: exp.endMonth,
    end_year: exp.endYear,
    is_present: exp.isPresent,
    description: exp.description,
  };
}

export function mapEducation(api: ApiEducation): Education {
  return {
    id: api.id,
    degree: api.degree,
    institution: api.institution,
    startYear: api.start_year,
    endYear: api.end_year,
  };
}

export function mapEducationToApi(edu: Omit<Education, "id">) {
  return {
    degree: edu.degree,
    institution: edu.institution,
    start_year: edu.startYear,
    end_year: edu.endYear,
  };
}

export function mapCertification(api: ApiCertification): Certification {
  return {
    id: api.id,
    name: api.name,
    organization: api.organization,
    issueMonth: api.issue_month,
    issueYear: api.issue_year,
    credentialUrl: api.credential_url,
    mediaUrl: resolveAssetUrl(api.media_url),
  };
}

export function mapCertificationToApi(cert: Omit<Certification, "id">) {
  return {
    name: cert.name,
    organization: cert.organization,
    issue_month: cert.issueMonth,
    issue_year: cert.issueYear,
    credential_url: cert.credentialUrl,
    media_url: toStoredAssetPath(cert.mediaUrl),
  };
}

export function mapTemplate(api: ApiTemplate): Template {
  return {
    id: api.id,
    name: api.name,
    description: api.description,
    previewUrl: resolveAssetUrl(api.preview_url),
    slug: api.slug,
    isPremium: api.is_premium ?? false,
  };
}

export function mapSkillCategories(data: ApiSkillCategory[]): SkillCategory[] {
  return data.map((cat) => ({
    id: cat.id,
    name: cat.name,
    skills: cat.skills.map((s) => ({
      id: s.id,
      name: s.name,
      category: cat.name,
    })),
  }));
}

export function mapTestimonial(api: ApiPortfolioTestimonial): Testimonial {
  return {
    id: api.id,
    authorName: api.author_name,
    authorRole: api.author_role,
    authorCompany: api.author_company,
    quote: api.quote,
    isPublished: api.is_published,
    source: api.source,
  };
}

export interface MappedPublicPortfolio {
  profile: Profile;
  skills: SkillCategory[];
  projects: Project[];
  experiences: Experience[];
  education: Education[];
  certifications: Certification[];
  testimonials: Testimonial[];
  templateSlug: TemplateSlug;
  portfolioUsername?: string;
  variantName?: string | null;
  contactFormEnabled?: boolean;
  meetBookingEnabled?: boolean;
  testimonialsEnabled?: boolean;
  testimonialSubmissionsEnabled?: boolean;
  shareToken?: string | null;
  allowFeedback?: boolean;
  /** Template demo mode: show all sections, disable form actions */
  displayOnly?: boolean;
}

export function mapPublicPortfolio(
  api: PublicPortfolio,
  meta?: { username?: string }
): MappedPublicPortfolio {
  return {
    profile: mapProfile(api.profile),
    skills: mapSkillCategories(api.skills),
    projects: api.projects.map(mapProject),
    experiences: api.experiences.map(mapExperience),
    education: api.education.map(mapEducation),
    certifications: api.certifications.map(mapCertification),
    testimonials: (api.testimonials ?? []).map(mapTestimonial),
    templateSlug: resolveTemplateSlug(api.template?.slug ?? null),
    portfolioUsername: meta?.username ?? api.username,
    variantName: api.variant_name ?? null,
    contactFormEnabled: api.contact_form_enabled ?? true,
    meetBookingEnabled: api.meet_booking_enabled ?? false,
    testimonialsEnabled: api.testimonials_enabled ?? false,
    testimonialSubmissionsEnabled: api.testimonial_submissions_enabled ?? false,
    shareToken: api.share_token ?? null,
    allowFeedback: api.allow_feedback ?? false,
  };
}

export function mapNotification(api: ApiNotification): Notification {
  return {
    id: api.id,
    type: api.type,
    title: api.title,
    message: api.message,
    actionUrl: api.action_url,
    time: api.created_at,
    read: api.read,
  };
}
