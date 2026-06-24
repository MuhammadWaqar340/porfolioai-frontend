"use client";

import { Award, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCertifications } from "@/hooks/use-certifications";
import { isApiHostedAsset } from "@/lib/api/asset-url";
import {
  formatCertificationDate,
  hasCertificationUrl,
} from "@/lib/certification-utils";
import { cn } from "@/lib/utils";

const certificationCardClass =
  "portfolio-item-card flex flex-col overflow-hidden rounded-xl border bg-card";

export function PortfolioCertifications() {
  const { certifications, isLoaded } = useCertifications();

  if (!isLoaded) {
    return null;
  }

  if (certifications.length === 0) {
    return (
      <section data-portfolio-section="certifications">
        <h2 className="mb-6 text-2xl font-bold">Certifications</h2>
        <p className="text-sm text-muted-foreground">
          No certifications added yet.
        </p>
      </section>
    );
  }

  return (
    <section data-portfolio-section="certifications">
      <h2 className="mb-6 text-2xl font-bold">Certifications</h2>
      <div className="portfolio-stagger-children grid gap-4 sm:grid-cols-2">
        {certifications.map((certification) => {
          const mediaUrl = certification.mediaUrl?.trim() ?? "";
          const hasMedia = mediaUrl.length > 0;
          const hasCredential = hasCertificationUrl(certification.credentialUrl);
          const skipOptimization =
            mediaUrl.startsWith("data:") ||
            mediaUrl.startsWith("blob:") ||
            isApiHostedAsset(mediaUrl);

          return (
            <div key={certification.id} className={certificationCardClass}>
              {hasMedia ? (
                <div className="relative aspect-[16/9] w-full shrink-0 border-b bg-muted/30">
                  <Image
                    src={mediaUrl}
                    alt={certification.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized={skipOptimization}
                  />
                </div>
              ) : null}
              <div className="flex flex-1 items-start gap-3 p-4">
                <Award className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <h3 className="break-words font-semibold">
                    {certification.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {certification.organization}
                  </p>
                  <p className="mt-1 text-sm font-medium text-primary">
                    {formatCertificationDate(certification)}
                  </p>
                  {hasCredential ? (
                    <Link
                      href={certification.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary",
                        "underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
                      )}
                    >
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                      View credential
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
