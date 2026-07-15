import {
  Award,
  BarChart3,
  Briefcase,
  Eye,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  LayoutTemplate,
  Quote,
  KanbanSquare,
  Settings,
  Sparkles,
  User,
  Video,
  Wrench,
  Calendar,
  Building2,
} from "lucide-react";

export const sidebarNavItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Organization", href: "/organization", icon: Building2 },
  { title: "Profile", href: "/profile", icon: User },
  { title: "Video Introduction", href: "/intro-video", icon: Video },
  { title: "Skills", href: "/skills", icon: Wrench },
  { title: "Projects", href: "/projects", icon: Briefcase },
  { title: "Experience", href: "/experience", icon: Briefcase },
  { title: "Education", href: "/education", icon: GraduationCap },
  { title: "Certifications", href: "/certifications", icon: Award },
  { title: "Templates", href: "/templates", icon: LayoutTemplate },
  { title: "Portfolio Preview", href: "/preview", icon: Eye },
  { title: "AI Assistance", href: "/ai", icon: Sparkles },
  { title: "Applications", href: "/applications", icon: KanbanSquare },
  { title: "Messages", href: "/messages", icon: Inbox },
  { title: "Meetings", href: "/meetings", icon: Calendar },
  { title: "Testimonials", href: "/testimonials", icon: Quote },
] as const;

export const sidebarFooterNavItem = {
  title: "Settings",
  href: "/settings",
  icon: Settings,
} as const;

export const landingNavItems = [
  { title: "Features", href: "#features" },
  { title: "Templates", href: "#templates" },
  { title: "Pricing", href: "#pricing" },
  { title: "Contact", href: "#contact" },
  { title: "Discover", href: "/discover" },
  { title: "Demo", href: "/demo" },
] as const;
