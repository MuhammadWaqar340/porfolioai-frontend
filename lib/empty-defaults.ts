import type {
  Certification,
  Education,
  Experience,
  IntroVideo,
  Profile,
  Project,
  SkillCategory,
} from "@/types";

export const emptyProfile: Profile = {
  id: "",
  fullName: "",
  title: "",
  about: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  website: "",
  avatarUrl: "",
  introVideoUrl: "",
  introVideoEnabled: false,
  introVideoScript: "",
};

export const emptyIntroVideo: IntroVideo = {
  introVideoUrl: "",
  introVideoEnabled: false,
  introVideoScript: "",
};

export const emptyProjects: Project[] = [];
export const emptySkills: SkillCategory[] = [];
export const emptyExperiences: Experience[] = [];
export const emptyEducation: Education[] = [];
export const emptyCertifications: Certification[] = [];
