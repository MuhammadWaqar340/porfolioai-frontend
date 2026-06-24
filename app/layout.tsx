import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionRestore } from "@/components/auth/session-restore";
import { AuthInit } from "@/components/auth/auth-init";
import { PreferencesInit } from "@/components/auth/preferences-init";
import { PlatformStatusBanners } from "@/components/layout/platform-status-banners";
import { MaintenanceGate } from "@/components/layout/maintenance-gate";
import { ScrollUnlock } from "@/components/layout/scroll-unlock";
import { AppGoogleOAuthProvider } from "@/components/providers/google-oauth-provider";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AppToaster } from "@/components/providers/app-toaster";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PortfolioAI — Build Your Portfolio with AI",
    template: "%s | PortfolioAI",
  },
  description:
    "Create beautiful and professional portfolios manually or with AI assistance.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <ReduxProvider>
          <AppGoogleOAuthProvider>
            <ThemeProvider>
              <AppToaster />
              <SessionRestore />
              <AuthInit />
              <PreferencesInit />
              <ScrollUnlock />
              <PlatformStatusBanners />
              <MaintenanceGate>{children}</MaintenanceGate>
            </ThemeProvider>
          </AppGoogleOAuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
