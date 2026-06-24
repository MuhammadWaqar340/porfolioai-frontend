import type {
  Certification,
  Education,
  Experience,
  Profile,
  Project,
  SkillCategory,
} from "@/types";

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

/** Raw API profile shape (snake_case) */
export interface ApiProfile {
  id: string;
  user_id: string;
  full_name: string;
  title: string;
  about: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  avatar_url: string;
  intro_video_url: string;
  intro_video_enabled: boolean;
  intro_video_script: string;
  created_at: string;
  updated_at: string;
}

export interface ApiIntroVideo {
  intro_video_url: string;
  intro_video_enabled: boolean;
  intro_video_script: string;
}

export interface ApiProject {
  id: string;
  title: string;
  description: string;
  image_url: string;
  image_urls?: string[];
  technologies: string[];
  github_url: string;
  live_url: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ApiExperience {
  id: string;
  company: string;
  position: string;
  start_month: number;
  start_year: number;
  end_month: number | null;
  end_year: number | null;
  is_present: boolean;
  description: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ApiEducation {
  id: string;
  degree: string;
  institution: string;
  start_year: number;
  end_year: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ApiCertification {
  id: string;
  name: string;
  organization: string;
  issue_month: number;
  issue_year: number;
  credential_url: string;
  media_url: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: { field: string; message: string }[];
  };
}

export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  auth_provider: "local" | "google";
  is_active: boolean;
  is_admin?: boolean;
  is_verified: boolean;
  subscription_plan?: SubscriptionPlan;
  created_at: string;
}

export type SubscriptionPlan = "free" | "pro";

export interface PlanFeatures {
  all_templates: boolean;
  intro_video: boolean;
  full_analytics: boolean;
  portfolio_variants: boolean;
  private_share_links: boolean;
  unlimited_ai: boolean;
  meet_booking: boolean;
}

export interface SubscriptionPlanData {
  plan: SubscriptionPlan;
  is_pro: boolean;
  free_template_slugs: string[];
  ai_monthly_limit: number;
  ai_requests_used: number;
  features: PlanFeatures;
}

export interface TokenData {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthData {
  user: AuthUser;
  tokens: TokenData;
}

export interface MeData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  auth_provider: "local" | "google";
  is_verified: boolean;
  is_admin: boolean;
  is_platform_owner?: boolean;
  is_impersonating?: boolean;
  impersonator_id?: string | null;
  impersonator_email?: string | null;
  has_profile: boolean;
  portfolio_slug: string | null;
  selected_template_id: string | null;
  subscription_plan: SubscriptionPlan;
  created_at: string;
}

export interface AdminOverview {
  total_users: number;
  active_users: number;
  disabled_users: number;
  verified_users: number;
  pro_users: number;
  public_portfolios: number;
  gallery_listings: number;
  support_messages: number;
  new_users_7d: number;
}

export interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  auth_provider: string;
  is_active: boolean;
  is_admin: boolean;
  is_verified: boolean;
  subscription_plan: SubscriptionPlan;
  portfolio_public: boolean;
  listed_in_gallery: boolean;
  portfolio_slug: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUserStats {
  projects_count: number;
  skills_count: number;
  experiences_count: number;
  education_count: number;
  certifications_count: number;
  portfolio_views_total: number;
  portfolio_views_last_7_days: number;
  portfolio_completion_percent: number;
}

export interface AdminUserDetail extends AdminUser {
  profile_full_name: string;
  profile_title: string;
  template_slug: string | null;
  stats: AdminUserStats;
  ai_requests_used: number;
  ai_requests_period: string;
}

export interface AdminPortfolio {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  portfolio_slug: string;
  is_active: boolean;
  subscription_plan: SubscriptionPlan;
  is_public: boolean;
  listed_in_gallery: boolean;
  gallery_featured: boolean;
  gallery_sort_order: number | null;
  profile_title: string;
  template_slug: string | null;
  portfolio_views_total: number;
  updated_at: string;
}

export interface AdminPortfolioList {
  items: AdminPortfolio[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminUserUpdateBody {
  is_active?: boolean;
  is_verified?: boolean;
  is_admin?: boolean;
  subscription_plan?: SubscriptionPlan;
  portfolio_public?: boolean;
  listed_in_gallery?: boolean;
}

export interface AdminUserList {
  items: AdminUser[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminSupportMessage {
  id: string;
  user_id: string | null;
  sender_name: string;
  sender_email: string;
  subject: string;
  message: string;
  status: "open" | "resolved";
  admin_notes: string;
  resolved_at: string | null;
  created_at: string;
}

export interface AdminSupportMessageList {
  items: AdminSupportMessage[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminSupportMessageUpdateBody {
  status?: "open" | "resolved";
  admin_notes?: string;
}

export interface AdminDailyCount {
  date: string;
  count: number;
}

export interface AdminAnalytics {
  days: number;
  signups: AdminDailyCount[];
  portfolio_views: AdminDailyCount[];
  support_messages: AdminDailyCount[];
  plan_breakdown: Record<string, number>;
  top_referrers: AdminReferrerCount[];
}

export interface AdminAiUsageUser {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  subscription_plan: SubscriptionPlan;
  ai_requests_used: number;
}

export interface AdminAiUsageOverview {
  period: string;
  total_requests_this_month: number;
  active_users_this_month: number;
  top_users: AdminAiUsageUser[];
}

export interface AdminAuditLogEntry {
  id: string;
  admin_id: string | null;
  admin_email: string | null;
  action: string;
  target_type: string;
  target_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface AdminAuditLogList {
  items: AdminAuditLogEntry[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminBulkUsersBody {
  user_ids: string[];
  action:
    | "disable"
    | "enable"
    | "verify"
    | "grant_pro"
    | "revoke_pro"
    | "delist_gallery";
}

export interface AdminBulkUsersResult {
  updated: number;
  skipped: number;
}

export interface AdminDiscoverUpdateBody {
  listed_in_gallery?: boolean;
  gallery_featured?: boolean;
  gallery_sort_order?: number;
}

export interface AdminPlatformSettings {
  maintenance_mode: boolean;
  announcement_enabled: boolean;
  announcement_message: string;
  discover_enabled: boolean;
  support_email: string;
}

export interface PlatformPublicConfig {
  maintenance_mode: boolean;
  announcement_enabled: boolean;
  announcement_message: string;
}

export interface AdminReferrerCount {
  source: string;
  label: string;
  count: number;
}

export interface AdminEmailPreview {
  template_id: string;
  subject: string;
  plain_text: string;
  html: string;
}

export interface AdminSystemHealth {
  environment: string;
  version: string;
  database_ok: boolean;
  upload_dir_ok: boolean;
  smtp_configured: boolean;
  ai_configured_provider: string;
  ai_active_provider: string | null;
  ai_available: boolean;
  ai_message: string;
  total_users: number;
  pro_users: number;
  owner_email_configured: boolean;
  support_email_configured: boolean;
}

export interface AdminImpersonationResult {
  access_token: string;
  expires_in: number;
  user: MeData;
  impersonator_id: string;
  impersonator_email: string;
}

export interface UserPreferences {
  user_id: string;
  target_role: string;
  onboarding_complete: boolean;
  onboarding_banner_dismissed: boolean;
  updated_at: string;
}

export interface UsernameCheckResult {
  username: string;
  available: boolean;
}

export interface DailyViewCount {
  date: string;
  count: number;
}

export interface ReferrerBreakdownItem {
  source: string;
  label: string;
  count: number;
}

export interface PortfolioAnalytics {
  total_views: number;
  views_last_7_days: number;
  views_last_30_days: number;
  unique_days_with_views: number;
  last_viewed_at: string | null;
  top_referrers: string[];
  views_by_day: DailyViewCount[];
  referrer_breakdown: ReferrerBreakdownItem[];
}

export interface PortfolioSettings {
  user_id: string;
  username: string;
  public_url: string;
  template_id: string | null;
  template_slug: string | null;
  is_public: boolean;
  seo_indexing_enabled: boolean;
  notify_portfolio_views: boolean;
  notify_email_updates: boolean;
  contact_form_enabled: boolean;
  listed_in_gallery: boolean;
  testimonials_enabled: boolean;
  testimonial_submissions_enabled: boolean;
  updated_at: string;
}

export interface PortfolioTestimonial {
  id: string;
  author_name: string;
  author_role: string;
  author_company: string;
  quote: string;
  is_published: boolean;
  source: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface PublicPortfolioGalleryItem {
  username: string;
  full_name: string;
  title: string;
  about_preview: string;
  avatar_url: string | null;
  template_slug: string | null;
  projects_count: number;
  skills_count: number;
  public_url: string;
}

export interface PublicPortfolioGallery {
  items: PublicPortfolioGalleryItem[];
  total: number;
  page: number;
  limit: number;
}

export interface NotificationsList {
  items: ApiNotification[];
  unread_count: number;
}

export interface ApiNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  action_url: string | null;
  read: boolean;
  created_at: string;
}

export interface MarkAllNotificationsReadResult {
  updated_count: number;
}

export interface ClearNotificationsResult {
  deleted_count: number;
}

export interface DashboardStats {
  projects_count: number;
  skills_count: number;
  skill_categories_count: number;
  experiences_count: number;
  education_count: number;
  certifications_count: number;
  profile_completion_percent: number;
  portfolio_completion_percent: number;
  sections_completed: number;
  sections_total: number;
  has_avatar: boolean;
  has_template_selected: boolean;
  is_portfolio_public: boolean;
  portfolio_views_total: number;
  portfolio_views_last_7_days: number;
  updated_at: string;
}

export interface InactivityNudgeSuggestion {
  message: string;
  action_path: string | null;
}

export interface InactivityNudge {
  show: boolean;
  days_inactive: number;
  title: string;
  message: string;
  primary_action_path: string | null;
  primary_action_label: string;
  suggestions: InactivityNudgeSuggestion[];
  views_last_30_days: number;
  portfolio_completion_percent: number;
}

export type ApiSkillCategory = {
  id: string;
  name: string;
  display_order: number;
  skills: {
    id: string;
    name: string;
    category_id: string;
    display_order: number;
  }[];
};

export interface ApiTemplate {
  id: string;
  name: string;
  description: string;
  preview_url: string;
  slug: string;
  is_active: boolean;
  is_premium?: boolean;
  created_at: string;
}

export interface PublicPortfolio {
  username?: string;
  profile: ApiProfile;
  skills: ApiSkillCategory[];
  projects: ApiProject[];
  experiences: ApiExperience[];
  education: ApiEducation[];
  certifications: ApiCertification[];
  template: ApiTemplate | null;
  variant_slug?: string | null;
  variant_name?: string | null;
  contact_form_enabled?: boolean;
  share_token?: string | null;
  allow_feedback?: boolean;
  testimonials_enabled?: boolean;
  testimonial_submissions_enabled?: boolean;
  meet_booking_enabled?: boolean;
  testimonials?: PortfolioTestimonial[];
}

export interface PortfolioVariant {
  id: string;
  name: string;
  slug: string;
  title_override: string | null;
  about_override: string | null;
  featured_project_ids: string[];
  is_default: boolean;
  preview_url: string;
  created_at: string;
  updated_at: string;
}

export interface ShareLink {
  id: string;
  label: string;
  token: string;
  share_url: string;
  variant_id: string | null;
  allow_feedback: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface PortfolioFeedbackItem {
  id: string;
  viewer_name: string;
  viewer_email: string | null;
  section: string | null;
  message: string;
  created_at: string;
}

export interface PortfolioContactMessage {
  id: string;
  sender_name: string;
  sender_email: string | null;
  message: string;
  created_at: string;
}

export interface EducationSuggestionResult {
  degree: string;
  institution: string;
  start_year: number | null;
  end_year: number | null;
  provider: string;
}

export interface CertificationSuggestionResult {
  name: string;
  organization: string;
  provider: string;
}

export interface GitHubRepoDraft {
  title: string;
  description: string;
  github_url: string;
  live_url: string;
  technologies: string[];
  source_repo: string;
}

export interface GitHubImportResult {
  username: string;
  repos: GitHubRepoDraft[];
}

export interface BulkSkillResult {
  added: string[];
  skipped: string[];
}

export interface AIStatus {
  configured_provider: string;
  active_provider: string | null;
  model: string;
  available: boolean;
  message: string;
  subscription_plan?: SubscriptionPlan | null;
  is_pro?: boolean | null;
  ai_monthly_limit?: number | null;
  ai_requests_used?: number | null;
}

export interface AIGenerateAboutResult {
  content: string;
  provider: string;
}

export interface AIGenerateIntroScriptResult {
  content: string;
  provider: string;
}

export interface AIGenerateProjectResult {
  content: string;
  provider: string;
}

export interface AIChatResult {
  reply: string;
  provider: string;
}

export interface PortfolioReviewSuggestion {
  category: string;
  message: string;
  priority: "high" | "medium" | "low" | string;
  action_path: string | null;
}

export interface PortfolioSectionScore {
  section: string;
  label: string;
  score: number;
  status: "complete" | "needs_work" | "missing" | string;
}

export interface PortfolioReviewResult {
  score: number;
  completeness_score: number;
  suggestions: PortfolioReviewSuggestion[];
  summary: string;
  provider: string;
  section_scores?: PortfolioSectionScore[];
  target_role?: string;
}

export interface JobTailorGap {
  category: string;
  message: string;
  priority: "high" | "medium" | "low" | string;
  action_path: string | null;
}

export interface JobDescriptionTailorResult {
  fit_score: number;
  summary: string;
  matching_strengths: string[];
  gaps: JobTailorGap[];
  keywords_to_add: string[];
  provider: string;
}

export interface AIContentResult {
  content: string;
  provider: string;
}

export interface SkillSuggestionItem {
  name: string;
  category: string;
}

export interface SkillsSuggestionsResult {
  suggestions: SkillSuggestionItem[];
  provider: string;
}

export interface SuggestTitleResult {
  titles: string[];
  provider: string;
}

export interface SuggestTechnologiesResult {
  technologies: string[];
  provider: string;
}

export interface ResumeImportDraft {
  full_name: string;
  title: string;
  about: string;
  skills: string[];
  experiences: Record<string, unknown>[];
  projects: Record<string, unknown>[];
  education: Record<string, unknown>[];
}

export interface ResumeImportResult {
  draft: ResumeImportDraft;
  provider: string;
}

export interface ResumeParseFileResult {
  text: string;
  filename: string;
  character_count: number;
}

export interface MeetingSettings {
  enabled: boolean;
  timezone: string;
  duration_minutes: number;
  buffer_minutes: number;
  start_hour: number;
  end_hour: number;
  available_days: number[];
  booking_window_days: number;
  calendar_connected: boolean;
  calendar_email: string | null;
  updated_at: string;
}

export interface MeetingAvailabilityDate {
  date: string;
  slots: string[];
}

export interface MeetingAvailability {
  timezone: string;
  duration_minutes: number;
  dates: MeetingAvailabilityDate[];
}

export interface MeetingTimezone {
  zone: string;
  utc: string;
  name: string;
}

export interface ScheduledMeeting {
  id: string;
  visitor_name: string;
  visitor_email: string;
  message: string | null;
  starts_at: string;
  ends_at: string;
  meet_url: string;
  status: string;
  created_at: string;
}

export interface MeetingBookResult {
  meeting_id: string;
  meet_url: string;
  starts_at: string;
  ends_at: string;
  message: string;
}
