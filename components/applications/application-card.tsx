"use client";

import { CalendarClock, ExternalLink, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
} from "@/constants/applications";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { JobApplication } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { ApplicationRecruiterEmail } from "@/components/applications/application-recruiter-email";

interface ApplicationCardProps {
  application: JobApplication;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: ApplicationStatus) => void;
}

function statusVariant(status: ApplicationStatus) {
  if (status === "offer") return "secondary" as const;
  if (status === "rejected" || status === "withdrawn") return "outline" as const;
  if (status === "interview") return "default" as const;
  return "secondary" as const;
}

function formatShortDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function ApplicationCard({
  application,
  onEdit,
  onDelete,
  onStatusChange,
}: ApplicationCardProps) {
  const followUp = formatShortDate(application.follow_up_at);
  const applied = formatShortDate(application.applied_at);

  return (
    <Card className="w-full min-w-0 gap-0 overflow-visible border-border/70 bg-card/90 py-0 shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="gap-1.5 px-3 pt-3 pb-2">
        <CardTitle className="min-w-0 pr-1 text-sm font-semibold leading-snug">
          <span className="line-clamp-2 break-words">{application.job_title}</span>
        </CardTitle>
        {application.fit_score != null ? (
          <CardAction>
            <Badge variant="outline" className="shrink-0 tabular-nums text-[10px]">
              {application.fit_score}%
            </Badge>
          </CardAction>
        ) : null}
        <p className="min-w-0 truncate text-xs text-muted-foreground">
          {application.company_name}
        </p>
      </CardHeader>

      <CardContent className="space-y-3 px-3 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={statusVariant(application.status)} className="text-[10px]">
            {APPLICATION_STATUS_LABELS[application.status]}
          </Badge>
          {applied ? (
            <span className="text-[10px] text-muted-foreground">Applied {applied}</span>
          ) : null}
        </div>
        {followUp ? (
          <p className="flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-300">
            <CalendarClock className="h-3.5 w-3.5" />
            Follow-up {followUp}
          </p>
        ) : null}

        {application.variant_name ? (
          <p className="truncate text-[11px] text-muted-foreground">
            Variant: {application.variant_name}
          </p>
        ) : null}

        <ApplicationRecruiterEmail email={application.recruiter_email} />

        <div className="flex items-center gap-1">
          <label className="sr-only" htmlFor={`status-${application.id}`}>
            Update status
          </label>
          <select
            id={`status-${application.id}`}
            value={application.status}
            onChange={(event) => onStatusChange(event.target.value as ApplicationStatus)}
            className={cn(
              "h-8 min-w-0 flex-1 rounded-md border border-input bg-background px-2 text-xs",
              "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            )}
          >
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {APPLICATION_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Button type="button" variant="outline" size="xs" onClick={onEdit}>
            <Pencil className="mr-1 h-3 w-3" />
            Edit
          </Button>
          {application.job_url ? (
            <Button
              type="button"
              variant="outline"
              size="xs"
              render={
                <Link href={application.job_url} target="_blank" rel="noopener noreferrer" />
              }
              nativeButton={false}
            >
              <ExternalLink className="mr-1 h-3 w-3" />
              Job
            </Button>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
