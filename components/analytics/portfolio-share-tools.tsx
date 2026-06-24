"use client";

import { Check, Copy, QrCode, Share2 } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormAlert } from "@/components/ui/form-alert";
import { Input } from "@/components/ui/input";
import {
  buildLinkedInShareUrl,
  buildQrCodeImageUrl,
  getPublicPortfolioUrl,
} from "@/lib/portfolio-url";
import { cn } from "@/lib/utils";
import { notifySuccess } from "@/lib/toast";
import { useGetProfileQuery } from "@/store/api/portfolioApi";

interface PortfolioShareToolsProps {
  username: string;
}

export function PortfolioShareTools({ username }: PortfolioShareToolsProps) {
  const { data: profile } = useGetProfileQuery();
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);

  const publicUrl = getPublicPortfolioUrl(username);
  const displayName = profile?.full_name?.trim() || profile?.title?.trim() || username;
  const linkedInUrl = buildLinkedInShareUrl(publicUrl, displayName);
  const qrUrl = buildQrCodeImageUrl(publicUrl);

  async function handleCopy() {
    setCopyError(null);
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      notifySuccess("Portfolio link copied.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError("Could not copy link to clipboard.");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share your portfolio</CardTitle>
        <CardDescription>
          Copy your link, post to LinkedIn, or download a QR code for resumes and business cards.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input readOnly value={publicUrl} className="font-mono text-xs sm:text-sm" />
          <Button type="button" variant="outline" onClick={handleCopy} className="shrink-0">
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? "Copied" : "Copy link"}
          </Button>
        </div>
        {copyError ? <FormAlert message={copyError} /> : null}

        <div className="flex flex-wrap gap-2">
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "secondary" }))}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share on LinkedIn
          </a>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowQr((value) => !value)}
          >
            <QrCode className="mr-2 h-4 w-4" />
            {showQr ? "Hide QR code" : "Show QR code"}
          </Button>
        </div>

        {showQr ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border bg-muted/30 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrUrl}
              alt={`QR code for ${publicUrl}`}
              width={200}
              height={200}
              className="rounded-md bg-white p-2"
            />
            <p className="max-w-xs text-center text-xs text-muted-foreground">
              Scan to open your portfolio. Right-click the image to save it.
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
