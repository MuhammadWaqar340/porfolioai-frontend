"use client";

import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useOptionalDemoPortfolio } from "@/contexts/portfolio-demo-context";
import { getStoredAccessToken } from "@/lib/auth-storage";
import { cn } from "@/lib/utils";
import { useGetPortfolioSettingsQuery } from "@/store/api/portfolioApi";
import { useAppSelector, useIsAuthenticated } from "@/store/hooks";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

interface DownloadAtsCvButtonProps {
  className?: string;
}

function filenameFromDisposition(header: string | null, fallback: string): string {
  if (!header) return fallback;
  const utfMatch = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (utfMatch?.[1]) {
    try {
      return decodeURIComponent(utfMatch[1]);
    } catch {
      return utfMatch[1];
    }
  }
  const plainMatch = /filename="?([^";]+)"?/i.exec(header);
  return plainMatch?.[1]?.trim() || fallback;
}

/**
 * Downloads an ATS-friendly DOCX built from portfolio data.
 * Public/share views use username; dashboard preview uses the owner endpoint.
 */
export function DownloadAtsCvButton({ className }: DownloadAtsCvButtonProps) {
  const demo = useOptionalDemoPortfolio();
  const isAuthenticated = useIsAuthenticated();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const { data: settings } = useGetPortfolioSettingsQuery(undefined, {
    skip: Boolean(demo) || !isAuthenticated,
  });
  const [loading, setLoading] = useState(false);

  const publicUsername = demo?.portfolioUsername ?? null;
  const shareToken = demo?.shareToken ?? null;
  const canUseOwnerEndpoint = !demo && isAuthenticated;
  const canDownload = Boolean(publicUsername || canUseOwnerEndpoint || settings?.username);

  if (!canDownload) return null;

  const handleDownload = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const headers: HeadersInit = {};
      let url: string;

      if (publicUsername) {
        const params = new URLSearchParams();
        if (shareToken) params.set("share", shareToken);
        const qs = params.toString();
        url = `${API_BASE_URL}/portfolio/public/${encodeURIComponent(publicUsername)}/ats-cv${qs ? `?${qs}` : ""}`;
      } else {
        url = `${API_BASE_URL}/portfolio/ats-cv`;
        const token = accessToken || getStoredAccessToken();
        if (!token) {
          throw new Error("Sign in required to download your CV");
        }
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(url, { headers, credentials: "include" });
      if (!response.ok) {
        throw new Error(`Download failed (${response.status})`);
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = filenameFromDisposition(
        response.headers.get("Content-Disposition"),
        "ATS_CV.docx",
      );
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
      toast.success("CV downloaded");
    } catch {
      toast.error("Could not download CV. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className={cn("cursor-pointer", className)}
      aria-label="Download Resume"
      title="Download Resume"
    >
      {loading ? (
        <Loader2 className="mr-1.5 h-4 w-4 shrink-0 animate-spin" />
      ) : (
        <Download className="mr-1.5 h-4 w-4 shrink-0" />
      )}
      <span>{loading ? "Preparing…" : "Download Resume"}</span>
    </button>
  );
}
