"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import {
  BadgeCheck,
  Building2,
  Clock,
  ExternalLink,
  Globe,
  Link2,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGetPublicCompanyQuery,
  useRecordPublicCompanyEventMutation,
} from "@/store/api/portfolioApi";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import type { PublicCompanyMember } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface PublicCompanyPageClientProps {
  slug: string;
}

export function PublicCompanyPageClient({ slug }: PublicCompanyPageClientProps) {
  const { data, isLoading, isError, error } = useGetPublicCompanyQuery(slug);
  const [recordEvent] = useRecordPublicCompanyEventMutation();

  const groupedMembers = useMemo(() => {
    if (!data || !data.departments || data.departments.length === 0) return null;
    const groups = data.departments.map((department) => ({
      department,
      members: data.members.filter(
        (member) => member.department_id === department.id
      ),
    }));
    const unassigned = data.members.filter((member) => !member.department_id);
    return { groups, unassigned };
  }, [data]);

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
      <div className="mx-auto max-w-5xl px-4 py-20">
        <p className="text-center text-sm text-muted-foreground">Loading team…</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <Building2 className="mx-auto h-10 w-10 text-muted-foreground" />
        <p className="mt-4 text-lg font-medium">Organization not available</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {getApiErrorMessage(
            error,
            "This team page is private, missing, or no longer published."
          )}
        </p>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline" }), "mt-6 inline-flex")}
        >
          Back home
        </Link>
      </div>
    );
  }

  const accent = data.accent_color?.trim() || undefined;
  const hasContact =
    Boolean(data.email) ||
    Boolean(data.phone) ||
    Boolean(data.location) ||
    Boolean(data.website) ||
    Boolean(data.linkedin_url);

  async function handleMemberClick(memberUserId: string, href: string) {
    try {
      await recordEvent({
        slug,
        body: {
          event_type: "member_click",
          member_user_id: memberUserId,
          referrer: typeof document !== "undefined" ? document.referrer : "",
        },
      }).unwrap();
    } catch {
      // tracking should never block navigation
    }
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="min-h-svh bg-background">
      <section
        className="relative border-b overflow-hidden"
        style={
          accent
            ? {
                background: `linear-gradient(135deg, ${accent}18, transparent 55%)`,
              }
            : undefined
        }
      >
        {data.cover_image_url ? (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: `url(${data.cover_image_url})` }}
            aria-hidden
          />
        ) : null}
        <div className="relative mx-auto flex max-w-5xl flex-col gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-4">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-background"
              style={accent ? { borderColor: `${accent}55` } : undefined}
            >
              {data.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.logo_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <Building2 className="h-7 w-7 text-muted-foreground" />
              )}
            </div>
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
                style={accent ? { color: accent } : undefined}
              >
                Organization
              </p>
              <h1 className="mt-1 flex flex-wrap items-center gap-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {data.name}
                {data.is_verified ? (
                  <Badge className="gap-1 bg-blue-500/15 text-sm font-medium text-blue-700 dark:text-blue-300">
                    <BadgeCheck className="h-4 w-4" />
                    Verified
                  </Badge>
                ) : null}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                {data.industry ? <span>{data.industry}</span> : null}
                {data.industry && data.location ? <span aria-hidden>·</span> : null}
                {data.location ? (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {data.location}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.website ? (
              <a
                href={data.website}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline" })}
              >
                <Globe className="mr-2 h-4 w-4" />
                Website
              </a>
            ) : null}
            {data.linkedin_url ? (
              <a
                href={data.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline" })}
              >
                <Link2 className="mr-2 h-4 w-4" />
                LinkedIn
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-10 px-4 py-12 sm:px-6">
        {data.about ? (
          <section className="max-w-3xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              About
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-base leading-7 text-foreground/90">
              {data.about}
            </p>
          </section>
        ) : null}

        {hasContact ? (
          <section className="max-w-3xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Contact
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {data.email ? (
                <li>
                  <a
                    href={`mailto:${data.email}`}
                    className="inline-flex items-center gap-2 text-foreground/90 hover:underline"
                  >
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {data.email}
                  </a>
                </li>
              ) : null}
              {data.phone ? (
                <li>
                  <a
                    href={`tel:${data.phone}`}
                    className="inline-flex items-center gap-2 text-foreground/90 hover:underline"
                  >
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {data.phone}
                  </a>
                </li>
              ) : null}
              {data.location ? (
                <li className="inline-flex items-center gap-2 text-foreground/90">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {data.location}
                </li>
              ) : null}
            </ul>
          </section>
        ) : null}

        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">Team</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {data.member_count} public portfolio
              {data.member_count === 1 ? "" : "s"}
              {data.featured_only_on_public ? " · featured members" : ""}
            </p>
          </div>

          {data.members.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <Users className="h-8 w-8 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="font-medium">No public team portfolios yet</p>
                  <p className="max-w-md text-sm text-muted-foreground">
                    {data.featured_only_on_public
                      ? "This organization is showing featured members only, and none have a public portfolio right now."
                      : "When teammates publish their portfolios, they will appear here."}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : groupedMembers ? (
            <div className="space-y-8">
              {groupedMembers.groups
                .filter((group) => group.members.length > 0)
                .map((group) => (
                  <div key={group.department.id}>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      {group.department.name}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {group.members.map((member, index) => (
                        <MemberCard
                          key={member.user_id ?? `placeholder-${group.department.id}-${index}`}
                          member={member}
                          accent={accent}
                          onView={handleMemberClick}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              {groupedMembers.unassigned.length > 0 ? (
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Other
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {groupedMembers.unassigned.map((member, index) => (
                      <MemberCard
                        key={member.user_id ?? `placeholder-unassigned-${index}`}
                        member={member}
                        accent={accent}
                        onView={handleMemberClick}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.members.map((member, index) => (
                <MemberCard
                  key={member.user_id ?? `placeholder-${index}`}
                  member={member}
                  accent={accent}
                  onView={handleMemberClick}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function MemberCard({
  member,
  accent,
  onView,
}: {
  member: PublicCompanyMember;
  accent: string | undefined;
  onView: (memberUserId: string, href: string) => void;
}) {
  const isPlaceholder = Boolean(member.is_placeholder) || !member.portfolio_username;
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex h-full flex-col gap-4 p-5">
        <div className="flex items-start gap-3">
          <ProfileAvatar src={member.avatar_url || null} alt={member.full_name} size="sm" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-semibold">{member.full_name}</p>
              {member.is_featured ? (
                <Badge
                  variant="secondary"
                  style={
                    accent
                      ? {
                          backgroundColor: `${accent}22`,
                          color: accent,
                        }
                      : undefined
                  }
                >
                  Featured
                </Badge>
              ) : null}
              {isPlaceholder ? <Badge variant="outline">Joining soon</Badge> : null}
            </div>
            {member.title ? (
              <p className="truncate text-sm text-muted-foreground">{member.title}</p>
            ) : null}
            {member.department_name ? (
              <p className="truncate text-xs text-muted-foreground">
                {member.department_name}
              </p>
            ) : null}
          </div>
        </div>
        {isPlaceholder ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled
            className="mt-auto w-full gap-1.5"
          >
            <Clock className="h-3.5 w-3.5" />
            Pending join
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => onView(member.user_id as string, `/${member.portfolio_username}`)}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "mt-auto w-full gap-1.5"
            )}
          >
            View portfolio
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        )}
      </CardContent>
    </Card>
  );
}
