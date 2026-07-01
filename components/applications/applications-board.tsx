"use client";

import {
  APPLICATION_BOARD_COLUMNS,
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
  applicationMatchesColumn,
} from "@/constants/applications";
import type { JobApplication } from "@/lib/api/types";
import { ApplicationCard } from "@/components/applications/application-card";
import { cn } from "@/lib/utils";

interface ApplicationsBoardProps {
  applications: JobApplication[];
  onEdit: (application: JobApplication) => void;
  onDelete: (application: JobApplication) => void;
  onStatusChange: (application: JobApplication, status: ApplicationStatus) => void;
}

export function ApplicationsBoard({
  applications,
  onEdit,
  onDelete,
  onStatusChange,
}: ApplicationsBoardProps) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="grid min-w-[min(100%,64rem)] gap-4 md:min-w-full xl:grid-cols-4">
      {APPLICATION_BOARD_COLUMNS.map((column) => {
        const items = applications.filter((application) =>
          applicationMatchesColumn(application.status, column.id)
        );

        return (
          <section
            key={column.id}
            className="flex max-h-[calc(100svh-15rem)] min-h-[320px] min-w-0 flex-col rounded-xl border border-border/80 bg-muted/10"
          >
            <header className="shrink-0 border-b px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{column.label}</h3>
                <span className="rounded-full bg-background px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
                  {items.length}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{column.description}</p>
            </header>

            <div
              className={cn(
                "min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-3",
                items.length === 0 ? "flex flex-col justify-center" : "flex flex-col gap-3"
              )}
            >
              {items.length === 0 ? (
                <p className="px-2 text-center text-xs text-muted-foreground">
                  No applications in this stage.
                </p>
              ) : (
                items.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onEdit={() => onEdit(application)}
                    onDelete={() => onDelete(application)}
                    onStatusChange={(status) => onStatusChange(application, status)}
                  />
                ))
              )}
            </div>
          </section>
        );
      })}
      </div>
    </div>
  );
}

export function getStatusLabel(status: ApplicationStatus) {
  return APPLICATION_STATUS_LABELS[status];
}
