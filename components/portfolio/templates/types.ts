import type { Profile } from "@/types";

export interface PortfolioTemplateLayoutProps {
  profile: Profile;
  isLoaded: boolean;
  embedded?: boolean;
  className?: string;
}
