"use client";

import Link from "next/link";
import { useEffect } from "react";
import { BadgeCheck, Building2 } from "lucide-react";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { Badge } from "@/components/ui/badge";
import {
  useGetPublicCompanyQuery,
  useRecordPublicCompanyEventMutation,
} from "@/store/api/portfolioApi";
import { cn } from "@/lib/utils";

interface EmbedCompanyPageClientProps {
  slug: string;
}

export function EmbedCompanyPageClient({ slug }: EmbedCompanyPageClientProps) {
  const { data, isLoading, isError } = useGetPublicCompanyQuery(slug);
  const [recordEvent] = useRecordPublicCompanyEventMutation();

  useEffect(() => {
    if (!data) return;
    void recordEvent({
      slug,
      body: {
        event_type: "page_view",
        referrer: typeof document !== "undefined" ? document.referrer : "",
      },
    });
  }, [data, recordEvent, slug]);

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">Loading team…</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 p-6 text-center">
        <Building2 className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Team page unavailable.</p>
      </div>
    );
  }

  const accent = data.accent_color?.trim() || undefined;
  const visibleMembers = data.members.filter(
    (member) => !member.is_placeholder && member.portfolio_username
  );

  return (
    <div className="min-h-svh bg-background p-4 sm:p-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-5">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-background"
            style={accent ? { borderColor: `${accent}55` } : undefined}
          >
            {data.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.logo_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <Building2 className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="flex min-w-0 flex-col">
            <a
              href={`/companies/${data.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 truncate text-base font-semibold hover:underline"
            >
              {data.name}
              {data.is_verified ? (
                <Badge className="gap-1 bg-blue-500/15 text-xs text-blue-700 dark:text-blue-300">
                  <BadgeCheck className="h-3 w-3" />
                  Verified
                </Badge>
              ) : null}
            </a>
            <p className="truncate text-xs text-muted-foreground">
              {visibleMembers.length} team member{visibleMembers.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {visibleMembers.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No public team portfolios yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {visibleMembers.map((member, index) => (
              <Link
                key={member.user_id ?? `member-${index}`}
                href={`/${member.portfolio_username}`}
                target="_blank"
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-colors hover:bg-muted/50"
                )}
              >
                <ProfileAvatar
                  src={member.avatar_url || null}
                  alt={member.full_name}
                  size="sm"
                />
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">{member.full_name}</p>
                  {member.title ? (
                    <p className="truncate text-[11px] text-muted-foreground">
                      {member.title}
                    </p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        )}

        <a
          href={`/companies/${data.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-center text-[11px] text-muted-foreground hover:underline"
        >
          Powered by PortfolioAI
        </a>
      </div>
    </div>
  );
}
