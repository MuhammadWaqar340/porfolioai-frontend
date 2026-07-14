import type {
  ApiCertification,
  ApiEducation,
  ApiExperience,
  ApiIntroVideo,
  ApiProfile,
  ApiProject,
  ApiSkillCategory,
  ApiSuccess,
  ApiTemplate,
  AIGenerateAboutResult,
  AIGenerateIntroScriptResult,
  AIGenerateProjectResult,
  AIChatResult,
  AIContentResult,
  AIStatus,
  AuthData,
  BulkSkillResult,
  DashboardStats,
  InactivityNudge,
  MeData,
  NotificationsList,
  MarkAllNotificationsReadResult,
  ClearNotificationsResult,
  ApiNotification,
  PortfolioAnalytics,
  PlatformPublicConfig,
  PortfolioReviewResult,
  JobDescriptionTailorResult,
  CoverLetterResult,
  CoverLetterTone,
  MeetingAvailability,
  MeetingBookResult,
  MeetingSettings,
  MeetingTimezone,
  ScheduledMeeting,
  CertificationSuggestionResult,
  EducationSuggestionResult,
  GitHubImportResult,
  JobApplication,
  JobApplicationStats,
  JobApplicationStatus,
  ApplyWizardResult,
  SuggestVariantFromJobResult,
  PortfolioFeedbackItem,
  PortfolioContactMessage,
  PortfolioSettings,
  PortfolioVariant,
  PortfolioTestimonial,
  PublicPortfolio,
  PublicPortfolioGallery,
  ShareLink,
  ResumeImportResult,
  ResumeParseFileResult,
  UrlImportResult,
  UrlImportType,
  SkillsSuggestionsResult,
  SuggestTechnologiesResult,
  SuggestTitleResult,
  SubscriptionPlanData,
  TokenData,
  UserPreferences,
  UsernameCheckResult,
} from "@/lib/api/types";
import type { Notification } from "@/types";
import {
  mapCertificationToApi,
  mapEducationToApi,
  mapExperienceToApi,
  mapProjectToApi,
  mapNotification,
} from "@/lib/api/mappers";
import { baseApi, unwrapApi } from "@/store/api/baseApi";

type ProjectBody = ReturnType<typeof mapProjectToApi>;
type ExperienceBody = ReturnType<typeof mapExperienceToApi>;
type EducationBody = ReturnType<typeof mapEducationToApi>;
type CertificationBody = ReturnType<typeof mapCertificationToApi>;

export const portfolioApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Auth
    register: builder.mutation<
      AuthData,
      {
        first_name: string;
        last_name: string;
        email: string;
        password: string;
        username?: string;
      }
    >({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
      transformResponse: (r: ApiSuccess<AuthData>) => unwrapApi(r),
    }),
    login: builder.mutation<
      AuthData,
      { email: string; password: string; remember_me?: boolean }
    >({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      transformResponse: (r: ApiSuccess<AuthData>) => unwrapApi(r),
    }),
    googleLogin: builder.mutation<AuthData, { id_token: string; remember_me?: boolean }>({
      query: (body) => ({ url: "/auth/google", method: "POST", body }),
      transformResponse: (r: ApiSuccess<AuthData>) => unwrapApi(r),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      invalidatesTags: [
        "User",
        "Profile",
        "Skills",
        "Projects",
        "Experience",
        "Education",
        "Certifications",
        "PortfolioSettings",
        "DashboardStats",
        "Notifications",
      ],
    }),
    refreshToken: builder.mutation<TokenData, void>({
      query: () => ({ url: "/auth/refresh", method: "POST" }),
      transformResponse: (r: ApiSuccess<TokenData>) => unwrapApi(r),
    }),
    getMe: builder.query<MeData, void>({
      query: () => "/auth/me",
      transformResponse: (r: ApiSuccess<MeData>) => unwrapApi(r),
      providesTags: ["User"],
    }),
    getSubscriptionPlan: builder.query<SubscriptionPlanData, void>({
      query: () => "/auth/plan",
      transformResponse: (r: ApiSuccess<SubscriptionPlanData>) => unwrapApi(r),
      providesTags: ["User", "SubscriptionPlan"],
    }),
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
      transformResponse: (r: { success: boolean; message: string }) => ({
        message: r.message,
      }),
    }),
    resetPassword: builder.mutation<
      { message: string },
      { token: string; new_password: string }
    >({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
      transformResponse: (r: { success: boolean; message: string }) => ({
        message: r.message,
      }),
    }),
    changePassword: builder.mutation<
      { message: string },
      { current_password: string; new_password: string }
    >({
      query: (body) => ({ url: "/auth/change-password", method: "PATCH", body }),
      transformResponse: (r: { success: boolean; message: string }) => ({
        message: r.message,
      }),
    }),
    verifyEmail: builder.mutation<{ message: string }, { token: string }>({
      query: (body) => ({ url: "/auth/verify-email", method: "POST", body }),
      transformResponse: (r: { success: boolean; message: string }) => ({
        message: r.message,
      }),
      invalidatesTags: ["User"],
    }),
    resendVerificationEmail: builder.mutation<{ message: string }, void>({
      query: () => ({ url: "/auth/resend-verification", method: "POST" }),
      transformResponse: (r: { success: boolean; message: string }) => ({
        message: r.message,
      }),
    }),

    // Profile
    getProfile: builder.query<ApiProfile, void>({
      query: () => "/profile",
      transformResponse: (r: ApiSuccess<ApiProfile>) => unwrapApi(r),
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation<
      ApiProfile,
      Record<string, string | boolean>
    >({
      query: (body) => ({ url: "/profile", method: "PATCH", body }),
      transformResponse: (r: ApiSuccess<ApiProfile>) => unwrapApi(r),
      invalidatesTags: ["Profile", "DashboardStats", "InactivityNudge"],
    }),
    uploadAvatar: builder.mutation<{ avatar_url: string }, FormData>({
      query: (body) => ({ url: "/profile/avatar", method: "POST", body }),
      transformResponse: (r: ApiSuccess<{ avatar_url: string }>) => unwrapApi(r),
      invalidatesTags: ["Profile", "DashboardStats", "InactivityNudge"],
    }),
    deleteAvatar: builder.mutation<{ message: string }, void>({
      query: () => ({ url: "/profile/avatar", method: "DELETE" }),
      transformResponse: (r: { success: boolean; message: string }) => ({
        message: r.message,
      }),
      invalidatesTags: ["Profile", "DashboardStats", "InactivityNudge"],
    }),

    // Intro video
    getIntroVideo: builder.query<ApiIntroVideo, void>({
      query: () => "/intro-video",
      transformResponse: (r: ApiSuccess<ApiIntroVideo>) => unwrapApi(r),
      providesTags: ["IntroVideo"],
    }),
    updateIntroVideo: builder.mutation<
      ApiIntroVideo,
      Record<string, string | boolean>
    >({
      query: (body) => ({ url: "/intro-video", method: "PATCH", body }),
      transformResponse: (r: ApiSuccess<ApiIntroVideo>) => unwrapApi(r),
      invalidatesTags: ["DashboardStats", "InactivityNudge"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            portfolioApi.util.updateQueryData("getIntroVideo", undefined, () => data)
          );
          dispatch(
            portfolioApi.util.updateQueryData("getProfile", undefined, (draft) => {
              draft.intro_video_url = data.intro_video_url;
              draft.intro_video_enabled = data.intro_video_enabled;
              draft.intro_video_script = data.intro_video_script;
            })
          );
        } catch {
          // Leave cached queries unchanged when the mutation fails.
        }
      },
    }),
    deleteIntroVideo: builder.mutation<ApiIntroVideo, void>({
      query: () => ({ url: "/intro-video", method: "DELETE" }),
      transformResponse: (r: ApiSuccess<ApiIntroVideo>) => unwrapApi(r),
      invalidatesTags: ["DashboardStats", "InactivityNudge"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            portfolioApi.util.updateQueryData("getIntroVideo", undefined, () => data)
          );
          dispatch(
            portfolioApi.util.updateQueryData("getProfile", undefined, (draft) => {
              draft.intro_video_url = data.intro_video_url;
              draft.intro_video_enabled = data.intro_video_enabled;
              draft.intro_video_script = data.intro_video_script;
            })
          );
        } catch {
          // Leave cached queries unchanged when the mutation fails.
        }
      },
    }),

    // Skills
    getSkills: builder.query<ApiSkillCategory[], void>({
      query: () => "/skills",
      transformResponse: (r: ApiSuccess<ApiSkillCategory[]>) => unwrapApi(r),
      providesTags: ["Skills"],
    }),
    addSkill: builder.mutation<
      { id: string; name: string; category_id: string; display_order: number },
      { name: string; category: string }
    >({
      query: (body) => ({ url: "/skills", method: "POST", body }),
      invalidatesTags: ["Skills", "DashboardStats", "InactivityNudge"],
    }),
    bulkAddSkills: builder.mutation<
      BulkSkillResult,
      { category: string; names: string[] }
    >({
      query: (body) => ({ url: "/skills/bulk", method: "POST", body }),
      transformResponse: (r: ApiSuccess<BulkSkillResult>) => unwrapApi(r),
      invalidatesTags: ["Skills", "DashboardStats", "InactivityNudge"],
    }),
    deleteSkill: builder.mutation<void, string>({
      query: (id) => ({ url: `/skills/${id}`, method: "DELETE" }),
      invalidatesTags: ["Skills", "DashboardStats", "InactivityNudge"],
    }),
    reorderSkillCategories: builder.mutation<void, string[]>({
      query: (ordered_category_ids) => ({
        url: "/skills/reorder/categories",
        method: "PUT",
        body: { ordered_category_ids },
      }),
      invalidatesTags: ["Skills", "DashboardStats", "InactivityNudge"],
    }),
    reorderSkills: builder.mutation<
      void,
      { category_id: string; ordered_skill_ids: string[] }
    >({
      query: (body) => ({ url: "/skills/reorder", method: "PUT", body }),
      invalidatesTags: ["Skills", "DashboardStats", "InactivityNudge"],
    }),
    updateSkillCategory: builder.mutation<
      ApiSkillCategory,
      { categoryId: string; name: string }
    >({
      query: ({ categoryId, name }) => ({
        url: `/skills/categories/${categoryId}`,
        method: "PATCH",
        body: { name },
      }),
      transformResponse: (r: ApiSuccess<ApiSkillCategory>) => unwrapApi(r),
      invalidatesTags: ["Skills", "DashboardStats", "InactivityNudge"],
    }),
    deleteSkillCategory: builder.mutation<void, string>({
      query: (categoryId) => ({
        url: `/skills/categories/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Skills", "DashboardStats", "InactivityNudge"],
    }),

    // Projects
    getProjects: builder.query<ApiProject[], void>({
      query: () => "/projects",
      transformResponse: (r: ApiSuccess<ApiProject[]>) => unwrapApi(r),
      providesTags: ["Projects"],
    }),
    uploadProjectImage: builder.mutation<{ image_url: string }, FormData>({
      query: (body) => ({ url: "/projects/upload-image", method: "POST", body }),
      transformResponse: (r: ApiSuccess<{ image_url: string }>) => unwrapApi(r),
    }),
    createProject: builder.mutation<ApiProject, ProjectBody>({
      query: (body) => ({ url: "/projects", method: "POST", body }),
      transformResponse: (r: ApiSuccess<ApiProject>) => unwrapApi(r),
      invalidatesTags: ["Projects", "DashboardStats", "InactivityNudge"],
    }),
    updateProject: builder.mutation<
      ApiProject,
      { id: string; data: ProjectBody }
    >({
      query: ({ id, data }) => ({ url: `/projects/${id}`, method: "PATCH", body: data }),
      transformResponse: (r: ApiSuccess<ApiProject>) => unwrapApi(r),
      invalidatesTags: ["Projects", "DashboardStats", "InactivityNudge"],
    }),
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({ url: `/projects/${id}`, method: "DELETE" }),
      invalidatesTags: ["Projects", "DashboardStats", "InactivityNudge"],
    }),
    reorderProjects: builder.mutation<void, string[]>({
      query: (ordered_ids) => ({
        url: "/projects/reorder",
        method: "PUT",
        body: { ordered_ids },
      }),
      invalidatesTags: ["Projects", "DashboardStats", "InactivityNudge"],
    }),

    // Experience
    getExperiences: builder.query<ApiExperience[], void>({
      query: () => "/experiences",
      transformResponse: (r: ApiSuccess<ApiExperience[]>) => unwrapApi(r),
      providesTags: ["Experience"],
    }),
    createExperience: builder.mutation<ApiExperience, ExperienceBody>({
      query: (body) => ({ url: "/experiences", method: "POST", body }),
      transformResponse: (r: ApiSuccess<ApiExperience>) => unwrapApi(r),
      invalidatesTags: ["Experience", "DashboardStats", "InactivityNudge"],
    }),
    updateExperience: builder.mutation<
      ApiExperience,
      { id: string; data: ExperienceBody }
    >({
      query: ({ id, data }) => ({
        url: `/experiences/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (r: ApiSuccess<ApiExperience>) => unwrapApi(r),
      invalidatesTags: ["Experience", "DashboardStats", "InactivityNudge"],
    }),
    deleteExperience: builder.mutation<void, string>({
      query: (id) => ({ url: `/experiences/${id}`, method: "DELETE" }),
      invalidatesTags: ["Experience", "DashboardStats", "InactivityNudge"],
    }),
    reorderExperiences: builder.mutation<void, string[]>({
      query: (ordered_ids) => ({
        url: "/experiences/reorder",
        method: "PUT",
        body: { ordered_ids },
      }),
      invalidatesTags: ["Experience", "DashboardStats", "InactivityNudge"],
    }),

    // Education
    getEducation: builder.query<ApiEducation[], void>({
      query: () => "/education",
      transformResponse: (r: ApiSuccess<ApiEducation[]>) => unwrapApi(r),
      providesTags: ["Education"],
    }),
    createEducation: builder.mutation<ApiEducation, EducationBody>({
      query: (body) => ({ url: "/education", method: "POST", body }),
      transformResponse: (r: ApiSuccess<ApiEducation>) => unwrapApi(r),
      invalidatesTags: ["Education", "DashboardStats", "InactivityNudge"],
    }),
    updateEducation: builder.mutation<
      ApiEducation,
      { id: string; data: EducationBody }
    >({
      query: ({ id, data }) => ({
        url: `/education/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (r: ApiSuccess<ApiEducation>) => unwrapApi(r),
      invalidatesTags: ["Education", "DashboardStats", "InactivityNudge"],
    }),
    deleteEducation: builder.mutation<void, string>({
      query: (id) => ({ url: `/education/${id}`, method: "DELETE" }),
      invalidatesTags: ["Education", "DashboardStats", "InactivityNudge"],
    }),
    reorderEducation: builder.mutation<void, string[]>({
      query: (ordered_ids) => ({
        url: "/education/reorder",
        method: "PUT",
        body: { ordered_ids },
      }),
      invalidatesTags: ["Education", "DashboardStats", "InactivityNudge"],
    }),

    // Certifications
    getCertifications: builder.query<ApiCertification[], void>({
      query: () => "/certifications",
      transformResponse: (r: ApiSuccess<ApiCertification[]>) => unwrapApi(r),
      providesTags: ["Certifications"],
    }),
    uploadCertificationMedia: builder.mutation<{ media_url: string }, FormData>({
      query: (body) => ({
        url: "/certifications/upload-media",
        method: "POST",
        body,
      }),
      transformResponse: (r: ApiSuccess<{ media_url: string }>) => unwrapApi(r),
    }),
    createCertification: builder.mutation<ApiCertification, CertificationBody>({
      query: (body) => ({ url: "/certifications", method: "POST", body }),
      transformResponse: (r: ApiSuccess<ApiCertification>) => unwrapApi(r),
      invalidatesTags: ["Certifications", "DashboardStats", "InactivityNudge"],
    }),
    updateCertification: builder.mutation<
      ApiCertification,
      { id: string; data: CertificationBody }
    >({
      query: ({ id, data }) => ({
        url: `/certifications/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (r: ApiSuccess<ApiCertification>) => unwrapApi(r),
      invalidatesTags: ["Certifications", "DashboardStats", "InactivityNudge"],
    }),
    deleteCertification: builder.mutation<void, string>({
      query: (id) => ({ url: `/certifications/${id}`, method: "DELETE" }),
      invalidatesTags: ["Certifications", "DashboardStats", "InactivityNudge"],
    }),
    reorderCertifications: builder.mutation<void, string[]>({
      query: (ordered_ids) => ({
        url: "/certifications/reorder",
        method: "PUT",
        body: { ordered_ids },
      }),
      invalidatesTags: ["Certifications", "DashboardStats", "InactivityNudge"],
    }),

    // Templates & Portfolio
    getTemplates: builder.query<ApiTemplate[], void>({
      query: () => "/templates",
      transformResponse: (r: ApiSuccess<ApiTemplate[]>) => unwrapApi(r),
      providesTags: ["Templates"],
    }),
    getPortfolioSettings: builder.query<PortfolioSettings, void>({
      query: () => "/portfolio/settings",
      transformResponse: (r: ApiSuccess<PortfolioSettings>) => unwrapApi(r),
      providesTags: ["PortfolioSettings"],
    }),
    updatePortfolioSettings: builder.mutation<
      PortfolioSettings,
      Partial<PortfolioSettings>
    >({
      query: (body) => ({ url: "/portfolio/settings", method: "PATCH", body }),
      invalidatesTags: ["PortfolioSettings", "User", "DashboardStats", "InactivityNudge"],
    }),
    checkUsername: builder.query<UsernameCheckResult, string>({
      query: (username) =>
        `/portfolio/check-username?username=${encodeURIComponent(username)}`,
      transformResponse: (r: ApiSuccess<UsernameCheckResult>) => unwrapApi(r),
    }),
    recordPortfolioView: builder.mutation<
      { message: string },
      { username: string; referrer?: string }
    >({
      query: ({ username, referrer }) => ({
        url: `/portfolio/public/${encodeURIComponent(username)}/view`,
        method: "POST",
        body: { referrer },
      }),
      transformResponse: (r: { success: boolean; message: string }) => ({
        message: r.message,
      }),
    }),
    getPortfolioAnalytics: builder.query<PortfolioAnalytics, void>({
      query: () => "/portfolio/analytics",
      transformResponse: (r: ApiSuccess<PortfolioAnalytics>) => unwrapApi(r),
      providesTags: ["PortfolioAnalytics"],
    }),
    getPreferences: builder.query<UserPreferences, void>({
      query: () => "/preferences",
      transformResponse: (r: ApiSuccess<UserPreferences>) => unwrapApi(r),
      providesTags: ["Preferences"],
    }),
    getNotifications: builder.query<
      { items: Notification[]; unreadCount: number },
      { limit?: number; offset?: number } | void
    >({
      query: (params) => {
        const limit = params?.limit ?? 20;
        const offset = params?.offset ?? 0;
        return `/notifications?limit=${limit}&offset=${offset}`;
      },
      transformResponse: (r: ApiSuccess<NotificationsList>) => {
        const data = unwrapApi(r);
        return {
          items: data.items.map(mapNotification),
          unreadCount: data.unread_count,
        };
      },
      providesTags: ["Notifications"],
    }),
    markNotificationRead: builder.mutation<Notification, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: "PATCH",
      }),
      transformResponse: (r: ApiSuccess<ApiNotification>) =>
        mapNotification(unwrapApi(r)),
      invalidatesTags: ["Notifications"],
    }),
    markAllNotificationsRead: builder.mutation<MarkAllNotificationsReadResult, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "POST",
      }),
      transformResponse: (r: ApiSuccess<MarkAllNotificationsReadResult>) =>
        unwrapApi(r),
      invalidatesTags: ["Notifications"],
    }),
    deleteNotification: builder.mutation<{ message: string }, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: "DELETE",
      }),
      transformResponse: (r: { success: boolean; message: string }) => ({
        message: r.message,
      }),
      invalidatesTags: ["Notifications"],
    }),
    clearAllNotifications: builder.mutation<ClearNotificationsResult, void>({
      query: () => ({
        url: "/notifications",
        method: "DELETE",
      }),
      transformResponse: (r: ApiSuccess<ClearNotificationsResult>) => unwrapApi(r),
      invalidatesTags: ["Notifications"],
    }),
    updatePreferences: builder.mutation<
      UserPreferences,
      Partial<
        Pick<
          UserPreferences,
          "target_role" | "onboarding_complete" | "onboarding_banner_dismissed"
        >
      >
    >({
      query: (body) => ({ url: "/preferences", method: "PATCH", body }),
      transformResponse: (r: ApiSuccess<UserPreferences>) => unwrapApi(r),
      invalidatesTags: ["Preferences"],
    }),
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => "/portfolio/dashboard-stats",
      transformResponse: (r: ApiSuccess<DashboardStats>) => unwrapApi(r),
      providesTags: ["DashboardStats"],
      keepUnusedDataFor: 30,
    }),
    getInactivityNudge: builder.query<InactivityNudge, void>({
      query: () => "/portfolio/inactivity-nudge",
      transformResponse: (r: ApiSuccess<InactivityNudge>) => unwrapApi(r),
      providesTags: ["InactivityNudge"],
      keepUnusedDataFor: 60,
    }),
    dismissInactivityNudge: builder.mutation<{ dismissed: boolean }, void>({
      query: () => ({
        url: "/portfolio/inactivity-nudge/dismiss",
        method: "POST",
      }),
      transformResponse: (r: ApiSuccess<{ dismissed: boolean }>) => unwrapApi(r),
      invalidatesTags: ["InactivityNudge"],
    }),
    getPublicPortfolio: builder.query<
      PublicPortfolio,
      string | { username: string; variant?: string; share?: string }
    >({
      query: (arg) => {
        const username = typeof arg === "string" ? arg : arg.username;
        const variant = typeof arg === "string" ? undefined : arg.variant;
        const share = typeof arg === "string" ? undefined : arg.share;
        const params = new URLSearchParams();
        if (variant) params.set("variant", variant);
        if (share) params.set("share", share);
        const qs = params.toString();
        return `/portfolio/public/${username}${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (r: ApiSuccess<PublicPortfolio>) => unwrapApi(r),
    }),
    getDiscoverPortfolios: builder.query<
      PublicPortfolioGallery,
      { page?: number; limit?: number; q?: string } | void
    >({
      query: (params) => {
        const search = new URLSearchParams();
        if (params?.page) search.set("page", String(params.page));
        if (params?.limit) search.set("limit", String(params.limit));
        if (params?.q?.trim()) search.set("q", params.q.trim());
        const qs = search.toString();
        return `/portfolio/discover${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (r: ApiSuccess<PublicPortfolioGallery>) => unwrapApi(r),
    }),
    getSharedPortfolio: builder.query<PublicPortfolio, string>({
      query: (token) => `/portfolio/share/${token}`,
      transformResponse: (r: ApiSuccess<PublicPortfolio>) => unwrapApi(r),
    }),
    submitPortfolioContact: builder.mutation<
      { message: string },
      { username: string; name: string; email?: string; message: string }
    >({
      query: ({ username, ...body }) => ({
        url: `/portfolio/public/${username}/contact`,
        method: "POST",
        body,
      }),
    }),
    submitPlatformSupport: builder.mutation<
      { message: string },
      { name: string; email: string; subject?: string; message: string }
    >({
      query: (body) => ({
        url: "/support/contact",
        method: "POST",
        body,
      }),
      transformResponse: (r: ApiSuccess<{ message: string }>) => unwrapApi(r),
    }),

    getPlatformConfig: builder.query<PlatformPublicConfig, void>({
      query: () => "/platform/config",
      transformResponse: (r: ApiSuccess<PlatformPublicConfig>) => unwrapApi(r),
      providesTags: ["PlatformConfig"],
    }),

    submitShareFeedback: builder.mutation<
      PortfolioFeedbackItem,
      {
        token: string;
        viewer_name: string;
        viewer_email?: string;
        section?: string;
        message: string;
      }
    >({
      query: ({ token, ...body }) => ({
        url: `/portfolio/share/${token}/feedback`,
        method: "POST",
        body,
      }),
      transformResponse: (r: ApiSuccess<PortfolioFeedbackItem>) => unwrapApi(r),
    }),
    getPortfolioVariants: builder.query<PortfolioVariant[], void>({
      query: () => "/portfolio/variants",
      transformResponse: (r: ApiSuccess<PortfolioVariant[]>) => unwrapApi(r),
      providesTags: ["PortfolioVariants"],
    }),
    createPortfolioVariant: builder.mutation<
      PortfolioVariant,
      {
        name: string;
        slug: string;
        title_override?: string;
        about_override?: string;
        featured_project_ids?: string[];
        is_default?: boolean;
      }
    >({
      query: (body) => ({ url: "/portfolio/variants", method: "POST", body }),
      transformResponse: (r: ApiSuccess<PortfolioVariant>) => unwrapApi(r),
      invalidatesTags: ["PortfolioVariants"],
    }),
    updatePortfolioVariant: builder.mutation<
      PortfolioVariant,
      {
        id: string;
        name?: string;
        slug?: string;
        title_override?: string | null;
        about_override?: string | null;
        featured_project_ids?: string[];
        is_default?: boolean;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/portfolio/variants/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (r: ApiSuccess<PortfolioVariant>) => unwrapApi(r),
      invalidatesTags: ["PortfolioVariants"],
    }),
    deletePortfolioVariant: builder.mutation<void, string>({
      query: (id) => ({ url: `/portfolio/variants/${id}`, method: "DELETE" }),
      invalidatesTags: ["PortfolioVariants"],
    }),
    getShareLinks: builder.query<ShareLink[], void>({
      query: () => "/portfolio/share-links",
      transformResponse: (r: ApiSuccess<ShareLink[]>) => unwrapApi(r),
      providesTags: ["ShareLinks"],
    }),
    createShareLink: builder.mutation<
      ShareLink,
      {
        label: string;
        variant_id?: string;
        allow_feedback?: boolean;
        expires_in_days?: number;
      }
    >({
      query: (body) => ({ url: "/portfolio/share-links", method: "POST", body }),
      transformResponse: (r: ApiSuccess<ShareLink>) => unwrapApi(r),
      invalidatesTags: ["ShareLinks"],
    }),
    deleteShareLink: builder.mutation<void, string>({
      query: (id) => ({ url: `/portfolio/share-links/${id}`, method: "DELETE" }),
      invalidatesTags: ["ShareLinks"],
    }),
    getJobApplications: builder.query<JobApplication[], { status?: JobApplicationStatus } | void>({
      query: (params) => ({
        url: "/applications",
        params: params?.status ? { status: params.status } : undefined,
      }),
      transformResponse: (r: ApiSuccess<JobApplication[]>) => unwrapApi(r),
      providesTags: ["JobApplications"],
    }),
    getJobApplicationStats: builder.query<JobApplicationStats, void>({
      query: () => "/applications/stats",
      transformResponse: (r: ApiSuccess<JobApplicationStats>) => unwrapApi(r),
      providesTags: ["JobApplications"],
    }),
    createJobApplication: builder.mutation<
      JobApplication,
      {
        company_name: string;
        job_title: string;
        recruiter_email?: string;
        job_url?: string;
        job_description?: string;
        status?: JobApplicationStatus;
        fit_score?: number;
        notes?: string;
        applied_at?: string | null;
        follow_up_at?: string | null;
        portfolio_variant_id?: string | null;
        share_link_id?: string | null;
        cover_letter_subject?: string;
        cover_letter_content?: string;
      }
    >({
      query: (body) => ({ url: "/applications", method: "POST", body }),
      transformResponse: (r: ApiSuccess<JobApplication>) => unwrapApi(r),
      invalidatesTags: ["JobApplications"],
    }),
    updateJobApplication: builder.mutation<
      JobApplication,
      {
        id: string;
        company_name?: string;
        job_title?: string;
        recruiter_email?: string | null;
        job_url?: string | null;
        job_description?: string | null;
        status?: JobApplicationStatus;
        fit_score?: number | null;
        notes?: string | null;
        applied_at?: string | null;
        follow_up_at?: string | null;
        portfolio_variant_id?: string | null;
        share_link_id?: string | null;
        cover_letter_subject?: string | null;
        cover_letter_content?: string | null;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/applications/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (r: ApiSuccess<JobApplication>) => unwrapApi(r),
      invalidatesTags: ["JobApplications"],
    }),
    deleteJobApplication: builder.mutation<void, string>({
      query: (id) => ({ url: `/applications/${id}`, method: "DELETE" }),
      invalidatesTags: ["JobApplications"],
    }),
    completeApplyWizard: builder.mutation<
      ApplyWizardResult,
      {
        company_name: string;
        job_title: string;
        recruiter_email?: string;
        job_url?: string;
        job_description: string;
        status?: JobApplicationStatus;
        fit_score?: number;
        notes?: string;
        create_variant?: boolean;
        variant?: {
          name: string;
          slug: string;
          title_override?: string;
          about_override?: string;
          featured_project_ids?: string[];
        };
        existing_variant_id?: string;
        cover_letter_subject: string;
        cover_letter_content: string;
        create_share_link?: boolean;
        share_link_label?: string;
        share_link_expires_in_days?: number;
      }
    >({
      query: (body) => ({ url: "/applications/apply-wizard", method: "POST", body }),
      transformResponse: (r: ApiSuccess<ApplyWizardResult>) => unwrapApi(r),
      invalidatesTags: ["JobApplications", "PortfolioVariants", "ShareLinks"],
    }),
    getContactMessages: builder.query<PortfolioContactMessage[], void>({
      query: () => "/portfolio/messages",
      transformResponse: (r: ApiSuccess<PortfolioContactMessage[]>) => unwrapApi(r),
      providesTags: ["PortfolioMessages"],
    }),
    deleteContactMessage: builder.mutation<void, string>({
      query: (id) => ({ url: `/portfolio/messages/${id}`, method: "DELETE" }),
      invalidatesTags: ["PortfolioMessages"],
    }),
    getPortfolioFeedback: builder.query<PortfolioFeedbackItem[], void>({
      query: () => "/portfolio/feedback",
      transformResponse: (r: ApiSuccess<PortfolioFeedbackItem[]>) => unwrapApi(r),
      providesTags: ["PortfolioFeedback"],
    }),
    deletePortfolioFeedback: builder.mutation<void, string>({
      query: (id) => ({ url: `/portfolio/feedback/${id}`, method: "DELETE" }),
      invalidatesTags: ["PortfolioFeedback"],
    }),
    getTestimonials: builder.query<PortfolioTestimonial[], void>({
      query: () => "/portfolio/testimonials",
      transformResponse: (r: ApiSuccess<PortfolioTestimonial[]>) => unwrapApi(r),
      providesTags: ["Testimonials"],
    }),
    createTestimonial: builder.mutation<
      PortfolioTestimonial,
      {
        author_name: string;
        author_role?: string;
        author_company?: string;
        quote: string;
        is_published?: boolean;
      }
    >({
      query: (body) => ({ url: "/portfolio/testimonials", method: "POST", body }),
      transformResponse: (r: ApiSuccess<PortfolioTestimonial>) => unwrapApi(r),
      invalidatesTags: ["Testimonials", "DashboardStats", "InactivityNudge"],
    }),
    updateTestimonial: builder.mutation<
      PortfolioTestimonial,
      {
        id: string;
        author_name?: string;
        author_role?: string;
        author_company?: string;
        quote?: string;
        is_published?: boolean;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/portfolio/testimonials/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (r: ApiSuccess<PortfolioTestimonial>) => unwrapApi(r),
      invalidatesTags: ["Testimonials", "DashboardStats", "InactivityNudge"],
    }),
    deleteTestimonial: builder.mutation<void, string>({
      query: (id) => ({ url: `/portfolio/testimonials/${id}`, method: "DELETE" }),
      invalidatesTags: ["Testimonials", "DashboardStats", "InactivityNudge"],
    }),
    submitPortfolioTestimonial: builder.mutation<
      { message: string },
      {
        username: string;
        author_name: string;
        author_role?: string;
        author_company?: string;
        quote: string;
      }
    >({
      query: ({ username, ...body }) => ({
        url: `/portfolio/public/${encodeURIComponent(username)}/testimonials`,
        method: "POST",
        body,
      }),
      transformResponse: (r: { success: boolean; message: string }) => ({
        message: r.message,
      }),
    }),
    getDemoPortfolio: builder.query<PublicPortfolio, void>({
      query: () => "/demo/portfolio",
      transformResponse: (r: ApiSuccess<PublicPortfolio>) => unwrapApi(r),
    }),

    // AI
    getAIStatus: builder.query<AIStatus, void>({
      query: () => "/ai/status",
      transformResponse: (r: ApiSuccess<AIStatus>) => unwrapApi(r),
    }),
    generateAbout: builder.mutation<
      AIGenerateAboutResult,
      { prompt?: string; tone?: string }
    >({
      query: (body) => ({
        url: "/ai/generate/about",
        method: "POST",
        body,
      }),
      transformResponse: (r: ApiSuccess<AIGenerateAboutResult>) => unwrapApi(r),
    }),
    generateIntroScript: builder.mutation<
      AIGenerateIntroScriptResult,
      { tone?: string; target_role?: string }
    >({
      query: (body) => ({
        url: "/ai/generate/intro-script",
        method: "POST",
        body,
      }),
      transformResponse: (r: ApiSuccess<AIGenerateIntroScriptResult>) => unwrapApi(r),
    }),
    generateProjectDescription: builder.mutation<
      AIGenerateProjectResult,
      { title?: string; notes?: string; technologies?: string[] }
    >({
      query: (body) => ({
        url: "/ai/generate/project-description",
        method: "POST",
        body,
      }),
      transformResponse: (r: ApiSuccess<AIGenerateProjectResult>) =>
        unwrapApi(r),
    }),
    aiChat: builder.mutation<
      AIChatResult,
      {
        message: string;
        history?: { role: "user" | "assistant"; content: string }[];
        target_role?: string;
      }
    >({
      query: (body) => ({ url: "/ai/chat", method: "POST", body }),
      transformResponse: (r: ApiSuccess<AIChatResult>) => unwrapApi(r),
    }),
    portfolioReview: builder.mutation<PortfolioReviewResult, void>({
      query: () => ({ url: "/ai/portfolio/review", method: "POST" }),
      transformResponse: (r: ApiSuccess<PortfolioReviewResult>) => unwrapApi(r),
    }),
    tailorJobDescription: builder.mutation<
      JobDescriptionTailorResult,
      { job_description: string; target_role?: string }
    >({
      query: (body) => ({
        url: "/ai/tailor/job-description",
        method: "POST",
        body,
      }),
      transformResponse: (r: ApiSuccess<JobDescriptionTailorResult>) => unwrapApi(r),
    }),
    generateCoverLetter: builder.mutation<
      CoverLetterResult,
      {
        company_name: string;
        job_title: string;
        job_description: string;
        tone?: CoverLetterTone;
        additional_notes?: string;
        target_role?: string;
      }
    >({
      query: (body) => ({
        url: "/ai/generate/cover-letter",
        method: "POST",
        body,
      }),
      transformResponse: (r: ApiSuccess<CoverLetterResult>) => unwrapApi(r),
    }),
    suggestVariantFromJob: builder.mutation<
      SuggestVariantFromJobResult,
      {
        company_name: string;
        job_title: string;
        job_description: string;
        target_role?: string;
      }
    >({
      query: (body) => ({
        url: "/ai/suggest/variant-from-job",
        method: "POST",
        body,
      }),
      transformResponse: (r: ApiSuccess<SuggestVariantFromJobResult>) => unwrapApi(r),
    }),
    generateExperienceDescription: builder.mutation<
      AIContentResult,
      {
        company?: string;
        position?: string;
        notes?: string;
        is_present?: boolean;
        target_role?: string;
      }
    >({
      query: (body) => ({
        url: "/ai/generate/experience-description",
        method: "POST",
        body,
      }),
      transformResponse: (r: ApiSuccess<AIContentResult>) => unwrapApi(r),
    }),
    suggestSkills: builder.mutation<
      SkillsSuggestionsResult,
      { target_role?: string }
    >({
      query: (body) => ({
        url: "/ai/generate/skills-suggestions",
        method: "POST",
        body,
      }),
      transformResponse: (r: ApiSuccess<SkillsSuggestionsResult>) => unwrapApi(r),
    }),
    suggestTitle: builder.mutation<
      SuggestTitleResult,
      { target_role?: string }
    >({
      query: (body) => ({
        url: "/ai/suggest/title",
        method: "POST",
        body,
      }),
      transformResponse: (r: ApiSuccess<SuggestTitleResult>) => unwrapApi(r),
    }),
    suggestTechnologies: builder.mutation<
      SuggestTechnologiesResult,
      { title?: string; notes?: string }
    >({
      query: (body) => ({
        url: "/ai/suggest/technologies",
        method: "POST",
        body,
      }),
      transformResponse: (r: ApiSuccess<SuggestTechnologiesResult>) =>
        unwrapApi(r),
    }),
    improveText: builder.mutation<
      AIContentResult,
      {
        text: string;
        field_type?: string;
        instruction?: string;
        target_role?: string;
      }
    >({
      query: (body) => ({ url: "/ai/improve-text", method: "POST", body }),
      transformResponse: (r: ApiSuccess<AIContentResult>) => unwrapApi(r),
    }),
    suggestEducationEntry: builder.mutation<
      EducationSuggestionResult,
      { notes?: string; target_role?: string }
    >({
      query: (body) => ({
        url: "/ai/suggest/education-entry",
        method: "POST",
        body,
      }),
      transformResponse: (r: ApiSuccess<EducationSuggestionResult>) => unwrapApi(r),
    }),
    suggestCertificationEntry: builder.mutation<
      CertificationSuggestionResult,
      { notes?: string; target_role?: string }
    >({
      query: (body) => ({
        url: "/ai/suggest/certification-entry",
        method: "POST",
        body,
      }),
      transformResponse: (r: ApiSuccess<CertificationSuggestionResult>) =>
        unwrapApi(r),
    }),
    importGitHubRepos: builder.mutation<
      GitHubImportResult,
      { github_username: string; max_repos?: number }
    >({
      query: (body) => ({
        url: "/ai/github/import-repos",
        method: "POST",
        body,
      }),
      transformResponse: (r: ApiSuccess<GitHubImportResult>) => unwrapApi(r),
    }),
    pageChat: builder.mutation<
      AIChatResult,
      {
        message: string;
        page?: string;
        history?: { role: "user" | "assistant"; content: string }[];
        target_role?: string;
      }
    >({
      query: (body) => ({ url: "/ai/page-chat", method: "POST", body }),
      transformResponse: (r: ApiSuccess<AIChatResult>) => unwrapApi(r),
    }),
    importResumeText: builder.mutation<
      ResumeImportResult,
      { text: string }
    >({
      query: (body) => ({ url: "/ai/resume/import", method: "POST", body }),
      transformResponse: (r: ApiSuccess<ResumeImportResult>) => unwrapApi(r),
    }),
    parseResumeFile: builder.mutation<ResumeParseFileResult, FormData>({
      query: (body) => ({ url: "/ai/resume/parse-file", method: "POST", body }),
      transformResponse: (r: ApiSuccess<ResumeParseFileResult>) => unwrapApi(r),
    }),
    importFromUrl: builder.mutation<
      UrlImportResult,
      { url: string; import_type?: UrlImportType; fallback_text?: string }
    >({
      query: (body) => ({ url: "/ai/import-from-url", method: "POST", body }),
      transformResponse: (r: ApiSuccess<UrlImportResult>) => unwrapApi(r),
    }),

    getMeetingSettings: builder.query<MeetingSettings, void>({
      query: () => "/meetings/settings",
      transformResponse: (r: ApiSuccess<MeetingSettings>) => unwrapApi(r),
      providesTags: ["Meetings"],
    }),
    getMeetingTimezones: builder.query<MeetingTimezone[], void>({
      query: () => "/meetings/timezones",
      transformResponse: (r: ApiSuccess<MeetingTimezone[]>) => unwrapApi(r),
      providesTags: ["Meetings"],
    }),
    updateMeetingSettings: builder.mutation<
      MeetingSettings,
      Partial<
        Pick<
          MeetingSettings,
          | "enabled"
          | "timezone"
          | "duration_minutes"
          | "buffer_minutes"
          | "start_hour"
          | "end_hour"
          | "available_days"
          | "booking_window_days"
        >
      >
    >({
      query: (body) => ({ url: "/meetings/settings", method: "PATCH", body }),
      transformResponse: (r: ApiSuccess<MeetingSettings>) => unwrapApi(r),
      invalidatesTags: ["Meetings", "PortfolioSettings"],
    }),
    getGoogleCalendarConnectUrl: builder.query<{ url: string }, void>({
      query: () => "/meetings/google/connect-url",
      transformResponse: (r: ApiSuccess<{ url: string }>) => unwrapApi(r),
    }),
    disconnectGoogleCalendar: builder.mutation<MeetingSettings, void>({
      query: () => ({ url: "/meetings/google/disconnect", method: "POST" }),
      transformResponse: (r: ApiSuccess<MeetingSettings>) => unwrapApi(r),
      invalidatesTags: ["Meetings"],
    }),
    getUpcomingMeetings: builder.query<ScheduledMeeting[], void>({
      query: () => "/meetings/upcoming",
      transformResponse: (r: ApiSuccess<ScheduledMeeting[]>) => unwrapApi(r),
      providesTags: ["Meetings"],
    }),
    cancelMeeting: builder.mutation<ScheduledMeeting, string>({
      query: (meetingId) => ({ url: `/meetings/${meetingId}`, method: "DELETE" }),
      transformResponse: (r: ApiSuccess<ScheduledMeeting>) => unwrapApi(r),
      invalidatesTags: ["Meetings"],
    }),
    getPublicMeetingAvailability: builder.query<
      MeetingAvailability,
      string
    >({
      query: (username) => `/meetings/public/${username}/availability`,
      transformResponse: (r: ApiSuccess<MeetingAvailability>) => unwrapApi(r),
    }),
    bookPublicMeeting: builder.mutation<
      MeetingBookResult,
      {
        username: string;
        visitor_name: string;
        visitor_email: string;
        message?: string;
        starts_at: string;
      }
    >({
      query: ({ username, ...body }) => ({
        url: `/meetings/public/${username}/book`,
        method: "POST",
        body,
      }),
      transformResponse: (r: ApiSuccess<MeetingBookResult>) => unwrapApi(r),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationEmailMutation,
  useGoogleLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetMeQuery,
  useGetSubscriptionPlanQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
  useGetIntroVideoQuery,
  useUpdateIntroVideoMutation,
  useDeleteIntroVideoMutation,
  useGetSkillsQuery,
  useAddSkillMutation,
  useBulkAddSkillsMutation,
  useDeleteSkillMutation,
  useReorderSkillCategoriesMutation,
  useReorderSkillsMutation,
  useUpdateSkillCategoryMutation,
  useDeleteSkillCategoryMutation,
  useGetProjectsQuery,
  useUploadProjectImageMutation,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useReorderProjectsMutation,
  useGetExperiencesQuery,
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
  useReorderExperiencesMutation,
  useGetEducationQuery,
  useCreateEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
  useReorderEducationMutation,
  useGetCertificationsQuery,
  useUploadCertificationMediaMutation,
  useCreateCertificationMutation,
  useUpdateCertificationMutation,
  useDeleteCertificationMutation,
  useReorderCertificationsMutation,
  useGetTemplatesQuery,
  useGetPortfolioSettingsQuery,
  useUpdatePortfolioSettingsMutation,
  useCheckUsernameQuery,
  useLazyCheckUsernameQuery,
  useRecordPortfolioViewMutation,
  useGetPortfolioAnalyticsQuery,
  useGetPreferencesQuery,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
  useClearAllNotificationsMutation,
  useUpdatePreferencesMutation,
  useGetDashboardStatsQuery,
  useGetInactivityNudgeQuery,
  useDismissInactivityNudgeMutation,
  useGetPublicPortfolioQuery,
  useGetDiscoverPortfoliosQuery,
  useGetSharedPortfolioQuery,
  useSubmitPortfolioContactMutation,
  useSubmitPlatformSupportMutation,
  useGetPlatformConfigQuery,
  useSubmitShareFeedbackMutation,
  useGetPortfolioVariantsQuery,
  useCreatePortfolioVariantMutation,
  useUpdatePortfolioVariantMutation,
  useDeletePortfolioVariantMutation,
  useGetShareLinksQuery,
  useCreateShareLinkMutation,
  useDeleteShareLinkMutation,
  useGetJobApplicationsQuery,
  useGetJobApplicationStatsQuery,
  useCreateJobApplicationMutation,
  useUpdateJobApplicationMutation,
  useDeleteJobApplicationMutation,
  useCompleteApplyWizardMutation,
  useGetContactMessagesQuery,
  useDeleteContactMessageMutation,
  useGetPortfolioFeedbackQuery,
  useDeletePortfolioFeedbackMutation,
  useGetTestimonialsQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
  useSubmitPortfolioTestimonialMutation,
  useGetDemoPortfolioQuery,
  useGetAIStatusQuery,
  useGenerateAboutMutation,
  useGenerateIntroScriptMutation,
  useGenerateProjectDescriptionMutation,
  useAiChatMutation,
  usePortfolioReviewMutation,
  useTailorJobDescriptionMutation,
  useGenerateCoverLetterMutation,
  useSuggestVariantFromJobMutation,
  useGenerateExperienceDescriptionMutation,
  useSuggestSkillsMutation,
  useSuggestTitleMutation,
  useSuggestTechnologiesMutation,
  useImproveTextMutation,
  useSuggestEducationEntryMutation,
  useSuggestCertificationEntryMutation,
  useImportGitHubReposMutation,
  usePageChatMutation,
  useImportResumeTextMutation,
  useParseResumeFileMutation,
  useImportFromUrlMutation,
  useGetMeetingSettingsQuery,
  useGetMeetingTimezonesQuery,
  useUpdateMeetingSettingsMutation,
  useLazyGetGoogleCalendarConnectUrlQuery,
  useDisconnectGoogleCalendarMutation,
  useGetUpcomingMeetingsQuery,
  useCancelMeetingMutation,
  useGetPublicMeetingAvailabilityQuery,
  useBookPublicMeetingMutation,
} = portfolioApi;
