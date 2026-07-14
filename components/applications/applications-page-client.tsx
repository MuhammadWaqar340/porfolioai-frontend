"use client";

import { KanbanSquare, Link2, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  ApplicationFormSheet,
  buildApplicationPayload,
} from "@/components/applications/application-form-sheet";
import { ApplicationsBoard } from "@/components/applications/applications-board";
import { UrlImportSheet } from "@/components/url-import/url-import-sheet";
import { PageHeader } from "@/components/layout/page-header";
import { ProUpgradeCard } from "@/components/subscription/pro-upgrade-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FREE_ACTIVE_APPLICATION_LIMIT,
} from "@/constants/applications";
import type { ApplicationStatus } from "@/constants/applications";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { useSubscription } from "@/hooks/use-subscription";
import type { JobApplication } from "@/lib/api/types";
import { notifySuccess } from "@/lib/toast";
import {
  useCreateJobApplicationMutation,
  useDeleteJobApplicationMutation,
  useGetJobApplicationStatsQuery,
  useGetJobApplicationsQuery,
  useUpdateJobApplicationMutation,
} from "@/store/api/portfolioApi";

export function ApplicationsPageClient() {
  const { isPro } = useSubscription();
  const { data: applications = [], isLoading } = useGetJobApplicationsQuery();
  const { data: stats } = useGetJobApplicationStatsQuery();
  const [createApplication] = useCreateJobApplicationMutation();
  const [updateApplication] = useUpdateJobApplicationMutation();
  const [deleteApplication] = useDeleteJobApplicationMutation();
  const { confirm, confirmDialog } = useConfirmDialog();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [importSheetOpen, setImportSheetOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);

  const atLimit = stats?.is_at_active_limit ?? false;

  function openCreateSheet() {
    setEditingApplication(null);
    setSheetOpen(true);
  }

  function openEditSheet(application: JobApplication) {
    setEditingApplication(application);
    setSheetOpen(true);
  }

  async function handleSubmit(form: Parameters<typeof buildApplicationPayload>[0]) {
    const payload = buildApplicationPayload(form);
    if (editingApplication) {
      await updateApplication({ id: editingApplication.id, ...payload }).unwrap();
      notifySuccess("Application updated.");
      return;
    }
    await createApplication(payload).unwrap();
    notifySuccess("Application added.");
  }

  async function handleStatusChange(
    application: JobApplication,
    status: ApplicationStatus
  ) {
    if (application.status === status) return;
    await updateApplication({ id: application.id, status }).unwrap();
    notifySuccess("Status updated.");
  }

  function handleDelete(application: JobApplication) {
    confirm({
      title: "Delete application?",
      description: `Remove ${application.job_title} at ${application.company_name} from your tracker.`,
      confirmLabel: "Delete",
      variant: "destructive",
      onConfirm: async () => {
        await deleteApplication(application.id).unwrap();
        notifySuccess("Application deleted.");
      },
    });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Applications"
        description="Track every role you save, apply to, and interview for — with linked portfolio variants and materials."
      >
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setImportSheetOpen(true)}
            disabled={atLimit && !isPro}
          >
            <Link2 className="mr-2 h-4 w-4" />
            Import from URL
          </Button>
          <Button
            type="button"
            variant="outline"
            render={<Link href="/applications/apply" />}
            nativeButton={false}
            disabled={atLimit && !isPro}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Apply to job
          </Button>
          <Button type="button" onClick={openCreateSheet} disabled={atLimit && !isPro}>
            <Plus className="mr-2 h-4 w-4" />
            Add application
          </Button>
        </div>
      </PageHeader>

      {stats ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <Card className="border-border/80">
            <CardContent className="px-4 py-3">
              <p className="text-xs text-muted-foreground">Active pipeline</p>
              <p className="text-2xl font-semibold tabular-nums">{stats.active}</p>
            </CardContent>
          </Card>
          <Card className="border-border/80">
            <CardContent className="px-4 py-3">
              <p className="text-xs text-muted-foreground">Applied this week</p>
              <p className="text-2xl font-semibold tabular-nums">{stats.applied_this_week}</p>
            </CardContent>
          </Card>
          <Card className="border-border/80">
            <CardContent className="px-4 py-3">
              <p className="text-xs text-muted-foreground">Interviews</p>
              <p className="text-2xl font-semibold tabular-nums">{stats.interview}</p>
            </CardContent>
          </Card>
          <Card className="border-border/80">
            <CardContent className="px-4 py-3">
              <p className="text-xs text-muted-foreground">Follow-ups due</p>
              <p className="text-2xl font-semibold tabular-nums">{stats.follow_ups_due}</p>
            </CardContent>
          </Card>
          <Card className="border-border/80">
            <CardContent className="px-4 py-3">
              <p className="text-xs text-muted-foreground">Total tracked</p>
              <p className="text-2xl font-semibold tabular-nums">{stats.total}</p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {!isPro && stats ? (
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="tabular-nums">
            {stats.active}/{FREE_ACTIVE_APPLICATION_LIMIT} active slots used
          </Badge>
          <span>Saved, Applied, and Interview stages count toward the free limit.</span>
        </div>
      ) : null}

      {atLimit && !isPro ? (
        <ProUpgradeCard
          title="Active application limit reached"
          description={`Free accounts can track up to ${FREE_ACTIVE_APPLICATION_LIMIT} active applications. Upgrade to Pro for unlimited tracking, or move a role to Offer, Rejected, or Withdrawn.`}
        />
      ) : null}

      {isLoading ? (
        <div className="grid gap-4 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-80 animate-pulse rounded-xl border bg-muted/30" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <KanbanSquare className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold">Start tracking applications</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Save roles you are interested in, move them through Applied and Interview, and keep
              cover letters and portfolio links in one place.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                type="button"
                render={<Link href="/applications/apply" />}
                nativeButton={false}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Apply to a job
              </Button>
              <Button type="button" onClick={openCreateSheet}>
                <Plus className="mr-2 h-4 w-4" />
                Add your first application
              </Button>
              <Button variant="outline" render={<Link href="/ai#apply" />} nativeButton={false}>
                Generate a cover letter
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <ApplicationsBoard
          applications={applications}
          onEdit={openEditSheet}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      )}

      <ApplicationFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        application={editingApplication}
        onSubmit={handleSubmit}
      />
      <UrlImportSheet open={importSheetOpen} onOpenChange={setImportSheetOpen} />

      {confirmDialog}
    </div>
  );
}
