import type { Middleware, UnknownAction } from "@reduxjs/toolkit";
import { areSuccessToastsSuppressed, notifySuccess } from "@/lib/toast";

type MutationFulfilledAction = UnknownAction & {
  meta: {
    arg: {
      endpointName: string;
      type: string;
      originalArgs?: unknown;
    };
  };
  payload: unknown;
};

const SKIP_SUCCESS_TOAST = new Set([
  "register",
  "login",
  "googleLogin",
  "logout",
  "refreshToken",
  "forgotPassword",
  "resetPassword",
  "verifyEmail",
  "resendVerificationEmail",
  "recordPortfolioView",
  "generateAbout",
  "generateProjectDescription",
  "aiChat",
  "pageChat",
  "portfolioReview",
  "tailorJobDescription",
  "generateCoverLetter",
  "suggestVariantFromJob",
  "completeApplyWizard",
  "generateExperienceDescription",
  "suggestSkills",
  "suggestTitle",
  "suggestTechnologies",
  "improveText",
  "importResumeText",
  "parseResumeFile",
  "uploadProjectImage",
  "uploadCertificationMedia",
  "markNotificationRead",
  "markAllNotificationsRead",
]);

function isMutationFulfilled(action: UnknownAction): action is MutationFulfilledAction {
  return (
    typeof action.type === "string" &&
    action.type.endsWith("/fulfilled") &&
    (action as MutationFulfilledAction).meta?.arg?.type === "mutation"
  );
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function getSuccessMessage(endpointName: string, action: MutationFulfilledAction): string | null {
  const payload = asRecord(action.payload);
  const args = asRecord(action.meta.arg.originalArgs);

  switch (endpointName) {
    case "updateProfile":
      return "Profile saved successfully.";
    case "updateIntroVideo":
      return "Video introduction saved.";
    case "deleteIntroVideo":
      return "Video introduction removed.";
    case "uploadAvatar":
      return "Profile photo updated.";
    case "deleteAvatar":
      return "Profile photo removed.";
    case "addSkill":
      return args?.name
        ? `"${String(args.name)}" added to ${String(args.category ?? "skills")}.`
        : "Skill added successfully.";
    case "bulkAddSkills": {
      const added = Array.isArray(payload?.added) ? payload.added : [];
      if (added.length === 1) {
        return `"${String(added[0])}" added successfully.`;
      }
      if (added.length > 1) {
        return `${added.length} skills added successfully.`;
      }
      return "Skills updated.";
    }
    case "deleteSkill":
      return "Skill removed successfully.";
    case "reorderSkillCategories":
    case "reorderSkills":
      return "Skills reordered.";
    case "updateSkillCategory":
      return args?.name
        ? `Category renamed to "${String(args.name)}".`
        : "Category updated successfully.";
    case "deleteSkillCategory":
      return "Category deleted successfully.";
    case "createProject":
      return payload?.title
        ? `"${String(payload.title)}" has been added to your projects.`
        : "Project added successfully.";
    case "updateProject":
      return payload?.title
        ? `"${String(payload.title)}" has been updated.`
        : "Project updated successfully.";
    case "deleteProject":
      return "Project removed successfully.";
    case "reorderProjects":
      return "Projects reordered.";
    case "createExperience":
      return payload?.position
        ? `"${String(payload.position)}" experience added.`
        : "Experience added successfully.";
    case "updateExperience":
      return payload?.position
        ? `"${String(payload.position)}" experience updated.`
        : "Experience updated successfully.";
    case "deleteExperience":
      return "Experience removed successfully.";
    case "reorderExperiences":
      return "Experience reordered.";
    case "createEducation":
      return payload?.degree
        ? `"${String(payload.degree)}" added to education.`
        : "Education entry added successfully.";
    case "updateEducation":
      return payload?.degree
        ? `"${String(payload.degree)}" updated.`
        : "Education entry updated successfully.";
    case "deleteEducation":
      return "Education entry removed successfully.";
    case "reorderEducation":
      return "Education entries reordered.";
    case "createCertification":
      return payload?.name
        ? `"${String(payload.name)}" certification added.`
        : "Certification added successfully.";
    case "updateCertification":
      return payload?.name
        ? `"${String(payload.name)}" certification updated.`
        : "Certification updated successfully.";
    case "deleteCertification":
      return "Certification removed successfully.";
    case "reorderCertifications":
      return "Certifications reordered.";
    case "updatePortfolioSettings": {
      if (args && "username" in args && args.username) {
        return `Username updated to "${String(args.username)}".`;
      }
      if (
        args &&
        "template_id" in args &&
        Object.keys(args).length === 1
      ) {
        return null;
      }
      if (args) {
        const keys = Object.keys(args);
        const notificationKeys = ["notify_portfolio_views", "notify_email_updates"];
        const privacyKeys = ["is_public", "seo_indexing_enabled"];
        if (keys.every((key) => notificationKeys.includes(key))) {
          return "Notification preferences saved.";
        }
        if (keys.every((key) => privacyKeys.includes(key))) {
          return "Privacy settings saved.";
        }
      }
      return "Portfolio settings saved.";
    }
    case "updatePreferences":
      return "Preferences saved.";
    case "changePassword":
      return "Password updated successfully.";
    case "deleteNotification":
      return "Notification removed.";
    case "clearAllNotifications":
      return "All notifications cleared.";
    default:
      return null;
  }
}

export const mutationToastMiddleware: Middleware = () => (next) => (action) => {
  const result = next(action);
  const typedAction = action as UnknownAction;

  if (!isMutationFulfilled(typedAction)) {
    return result;
  }

  const endpointName = typedAction.meta.arg.endpointName;
  if (SKIP_SUCCESS_TOAST.has(endpointName)) {
    return result;
  }

  if (areSuccessToastsSuppressed()) {
    return result;
  }

  const message = getSuccessMessage(endpointName, typedAction);
  if (message) {
    notifySuccess(message);
  }

  return result;
};
