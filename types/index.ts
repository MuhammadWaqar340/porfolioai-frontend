export interface Profile {
  id: string;
  fullName: string;
  title: string;
  about: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  avatarUrl: string;
  introVideoUrl: string;
  introVideoEnabled: boolean;
  introVideoScript: string;
}

export interface IntroVideo {
  introVideoUrl: string;
  introVideoEnabled: boolean;
  introVideoScript: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: Skill[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageUrls: string[];
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startMonth: number;
  startYear: number;
  endMonth: number | null;
  endYear: number | null;
  isPresent: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  startYear: number;
  endYear: number;
}

export interface Certification {
  id: string;
  name: string;
  organization: string;
  issueMonth: number;
  issueYear: number;
  credentialUrl: string;
  mediaUrl: string;
}

export interface Testimonial {
  id: string;
  authorName: string;
  authorRole: string;
  authorCompany: string;
  quote: string;
  isPublished: boolean;
  source: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  slug: string;
  isPremium?: boolean;
}

export interface DashboardStat {
  label: string;
  value: string | number;
  icon: string;
  change?: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface AIFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  example?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  actionUrl: string | null;
  time: string;
  read: boolean;
}
