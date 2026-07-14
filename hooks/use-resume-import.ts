"use client";

import { useCallback, useState } from "react";
import { mapProfileToApi } from "@/lib/api/mappers";
import type { ResumeImportDraft } from "@/lib/api/types";
import {
  buildProfileUpdates,
  mapDraftEducation,
  mapDraftExperience,
  mapDraftProject,
  type ResumeApplyOptions,
  type ResumeApplyResult,
  type ResumeApplySection,
} from "@/lib/resume-import";
import type { Profile } from "@/types";
import {
  useBulkAddSkillsMutation,
  useCreateEducationMutation,
  useCreateExperienceMutation,
  useCreateProjectMutation,
  useImportResumeTextMutation,
  useParseResumeFileMutation,
  useUpdateProfileMutation,
} from "@/store/api/portfolioApi";
import { withoutSuccessToasts } from "@/lib/toast";

export function useResumeImport() {
  const [importResume, { isLoading: isExtracting }] = useImportResumeTextMutation();
  const [parseResumeFile, { isLoading: isParsingFile }] =
    useParseResumeFileMutation();
  const [updateProfile] = useUpdateProfileMutation();
  const [bulkAddSkills] = useBulkAddSkillsMutation();
  const [createExperience] = useCreateExperienceMutation();
  const [createProject] = useCreateProjectMutation();
  const [createEducation] = useCreateEducationMutation();

  const [draft, setDraft] = useState<ResumeImportDraft | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const extractFromText = useCallback(
    async (text: string) => {
      const result = await importResume({ text }).unwrap();
      setDraft(result.draft);
      setProvider(result.provider);
      return result;
    },
    [importResume]
  );

  const loadFromFile = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const result = await parseResumeFile(formData).unwrap();
      return result;
    },
    [parseResumeFile]
  );

  const clearDraft = useCallback(() => {
    setDraft(null);
    setProvider(null);
  }, []);

  const loadDraft = useCallback((nextDraft: ResumeImportDraft, nextProvider: string) => {
    setDraft(nextDraft);
    setProvider(nextProvider);
  }, []);

  const applyDraft = useCallback(
    async (
      currentProfile: Profile,
      options: ResumeApplyOptions
    ): Promise<ResumeApplyResult> => {
      if (!draft) {
        return {
          profileUpdated: false,
          skillsAdded: 0,
          experiencesAdded: 0,
          projectsAdded: 0,
          educationAdded: 0,
        };
      }

      setIsApplying(true);
      const result: ResumeApplyResult = {
        profileUpdated: false,
        skillsAdded: 0,
        experiencesAdded: 0,
        projectsAdded: 0,
        educationAdded: 0,
      };

      try {
        return await withoutSuccessToasts(async () => {
          const sections = new Set<ResumeApplySection>(options.sections);

          if (sections.has("profile")) {
            const updates = buildProfileUpdates(
              draft,
              currentProfile,
              options.overwriteProfile ?? false
            );
            if (Object.keys(updates).length > 0) {
              await updateProfile(mapProfileToApi(updates)).unwrap();
              result.profileUpdated = true;
            }
          }

          if (sections.has("skills") && draft.skills.length > 0) {
            const bulk = await bulkAddSkills({
              category: options.skillsCategory ?? "Tools",
              names: draft.skills,
            }).unwrap();
            result.skillsAdded = bulk.added.length;
          }

          if (sections.has("experiences")) {
            for (const item of draft.experiences) {
              const experience = mapDraftExperience(item);
              if (!experience) continue;
              await createExperience({
                company: experience.company,
                position: experience.position,
                start_month: experience.startMonth,
                start_year: experience.startYear,
                end_month: experience.endMonth,
                end_year: experience.endYear,
                is_present: experience.isPresent,
                description: experience.description,
              }).unwrap();
              result.experiencesAdded += 1;
            }
          }

          if (sections.has("projects")) {
            for (const item of draft.projects) {
              const project = mapDraftProject(item);
              if (!project) continue;
              await createProject({
                title: project.title,
                description: project.description,
                image_url: project.imageUrl,
                image_urls: project.imageUrls,
                technologies: project.technologies,
                github_url: project.githubUrl,
                live_url: project.liveUrl,
              }).unwrap();
              result.projectsAdded += 1;
            }
          }

          if (sections.has("education")) {
            for (const item of draft.education) {
              const education = mapDraftEducation(item);
              if (!education) continue;
              await createEducation({
                degree: education.degree,
                institution: education.institution,
                start_year: education.startYear,
                end_year: education.endYear,
              }).unwrap();
              result.educationAdded += 1;
            }
          }

          return result;
        });
      } finally {
        setIsApplying(false);
      }
    },
    [
      bulkAddSkills,
      createEducation,
      createExperience,
      createProject,
      draft,
      updateProfile,
    ]
  );

  return {
    draft,
    provider,
    isExtracting,
    isParsingFile,
    isApplying,
    extractFromText,
    loadFromFile,
    loadDraft,
    applyDraft,
    clearDraft,
  };
}
