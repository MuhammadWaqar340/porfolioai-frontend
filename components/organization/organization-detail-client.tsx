"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  Activity,
  BadgeCheck,
  Check,
  Code2,
  Copy,
  ExternalLink,
  FolderKanban,
  GripVertical,
  Mail,
  MousePointerClick,
  Pencil,
  Plus,
  Shield,
  ShieldOff,
  Star,
  Trash2,
  UserMinus,
  UserPen,
  Eye,
  X,
} from "lucide-react";
import { OrganizationFormSheet } from "@/components/organization/organization-form-sheet";
import { OrganizationInviteFormSheet } from "@/components/organization/organization-invite-form-sheet";
import { OrganizationPlaceholderFormSheet } from "@/components/organization/organization-placeholder-form-sheet";
import { OrganizationMemberPortfolioSheet } from "@/components/organization/organization-member-portfolio-sheet";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { FormAlert } from "@/components/ui/form-alert";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import { PAYMENT_PATH } from "@/constants/plans";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import type {
  CompanyCreatePayload,
  CompanyDepartmentCreatePayload,
  CompanyMember,
  CompanyMemberPortfolioUpdatePayload,
  CompanyPlaceholderCreatePayload,
} from "@/lib/api/types";
import { notifySuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";
import type { RootState } from "@/store";
import {
  useCreateCompanyDepartmentMutation,
  useCreateCompanyInviteMutation,
  useCreateCompanyPlaceholderMutation,
  useDeleteCompanyDepartmentMutation,
  useDeleteCompanyMutation,
  useDeleteCompanyPlaceholderMutation,
  useGetCompanyAnalyticsQuery,
  useGetCompanyAuditLogsQuery,
  useGetCompanyDepartmentsQuery,
  useGetCompanyInvitesQuery,
  useGetCompanyQuery,
  useGetCompanyUsageQuery,
  useRemoveCompanyMemberMutation,
  useReorderCompanyMembersMutation,
  useRequestCompanyMemberEditMutation,
  useRevokeCompanyInviteMutation,
  useUpdateCompanyDepartmentMutation,
  useUpdateCompanyMemberMutation,
  useUpdateCompanyMemberPortfolioMutation,
  useUpdateCompanyMutation,
  useUpdateCompanyPlaceholderMutation,
  useUpdateMyCompanyConsentMutation,
} from "@/store/api/portfolioApi";

interface OrganizationDetailClientProps {
  companyId: string;
}

function completenessBadges(member: CompanyMember) {
  const badges: { label: string; className?: string }[] = [];
  if (member.completeness_label === "private" || !member.portfolio_is_public) {
    badges.push({
      label: "Private",
      className: "bg-muted text-muted-foreground",
    });
  }
  if (member.completeness_label === "ready") {
    badges.push({
      label: "Ready",
      className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    });
  }
  if (!member.has_avatar) {
    badges.push({ label: "Missing avatar" });
  }
  if (!member.has_about) {
    badges.push({ label: "Missing about" });
  }
  if (!member.has_projects) {
    badges.push({ label: "No projects" });
  }
  return badges;
}

export function OrganizationDetailClient({ companyId }: OrganizationDetailClientProps) {
  const router = useRouter();
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
  const { confirm, confirmDialog } = useConfirmDialog();
  const { data: company, isLoading, isError, refetch } = useGetCompanyQuery(companyId);
  const isOwner = company?.my_role === "owner";
  const isManager = isOwner || company?.my_role === "admin";

  const { data: invites = [] } = useGetCompanyInvitesQuery(companyId, {
    skip: !isManager,
  });
  const { data: analytics } = useGetCompanyAnalyticsQuery(companyId, {
    skip: !isManager,
  });
  const { data: auditLogs = [] } = useGetCompanyAuditLogsQuery(
    { companyId, limit: 50 },
    { skip: !isManager }
  );
  const { data: usage } = useGetCompanyUsageQuery(companyId, { skip: !isManager });
  const { data: departments = [] } = useGetCompanyDepartmentsQuery(companyId);
  const [updateCompany] = useUpdateCompanyMutation();
  const [createInvite] = useCreateCompanyInviteMutation();
  const [revokeInvite] = useRevokeCompanyInviteMutation();
  const [updateMember] = useUpdateCompanyMemberMutation();
  const [reorderMembers] = useReorderCompanyMembersMutation();
  const [removeMember] = useRemoveCompanyMemberMutation();
  const [deleteCompany, { isLoading: deleting }] = useDeleteCompanyMutation();
  const [updateMyConsent] = useUpdateMyCompanyConsentMutation();
  const [requestMemberEdit] = useRequestCompanyMemberEditMutation();
  const [updateMemberPortfolio] = useUpdateCompanyMemberPortfolioMutation();
  const [createPlaceholder] = useCreateCompanyPlaceholderMutation();
  const [updatePlaceholder] = useUpdateCompanyPlaceholderMutation();
  const [deletePlaceholder] = useDeleteCompanyPlaceholderMutation();
  const [createDepartment] = useCreateCompanyDepartmentMutation();
  const [updateDepartment] = useUpdateCompanyDepartmentMutation();
  const [deleteDepartment] = useDeleteCompanyDepartmentMutation();

  const [error, setError] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [placeholderError, setPlaceholderError] = useState<string | null>(null);
  const [departmentError, setDepartmentError] = useState<string | null>(null);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [isAddingDepartment, setIsAddingDepartment] = useState(false);
  const [editingDepartmentId, setEditingDepartmentId] = useState<string | null>(null);
  const [editingDepartmentName, setEditingDepartmentName] = useState("");
  const [embedCopied, setEmbedCopied] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [inviteSheetOpen, setInviteSheetOpen] = useState(false);
  const [placeholderSheetOpen, setPlaceholderSheetOpen] = useState(false);
  const [portfolioSheetMemberId, setPortfolioSheetMemberId] = useState<string | null>(
    null
  );
  const [members, setMembers] = useState<CompanyMember[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  useEffect(() => {
    if (company?.members) {
      setMembers(
        [...company.members].sort((a, b) => a.display_order - b.display_order)
      );
    }
  }, [company?.members]);

  const pendingInvites = useMemo(
    () => invites.filter((invite) => invite.status === "pending"),
    [invites]
  );

  const currentMember = useMemo(
    () => members.find((member) => member.user_id === currentUserId) ?? null,
    [members, currentUserId]
  );

  const portfolioSheetMember = useMemo(
    () => members.find((member) => member.user_id === portfolioSheetMemberId) ?? null,
    [members, portfolioSheetMemberId]
  );

  function canRemoveMember(member: CompanyMember) {
    if (member.user_id === currentUserId) return true;
    if (member.role === "owner") return false;
    if (member.role === "admin") return isOwner;
    return isManager;
  }

  async function handleSave(payload: CompanyCreatePayload) {
    try {
      await updateCompany({ companyId, body: payload }).unwrap();
      notifySuccess("Organization updated");
      refetch();
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not update organization"));
      throw err;
    }
  }

  async function handleInvite(email: string, role: "admin" | "member") {
    const invite = await createInvite({ companyId, email, role }).unwrap();
    notifySuccess("Invite sent");
    if (invite.invite_url) {
      await navigator.clipboard.writeText(invite.invite_url);
      notifySuccess("Invite link copied");
    }
  }

  async function handleAddPlaceholder(payload: CompanyPlaceholderCreatePayload) {
    try {
      await createPlaceholder({ companyId, body: payload }).unwrap();
      notifySuccess("Placeholder added");
    } catch (err) {
      setPlaceholderError(getApiErrorMessage(err, "Could not add placeholder"));
      throw err;
    }
  }

  async function handleTogglePlaceholderFeatured(
    placeholderId: string,
    isFeatured: boolean
  ) {
    try {
      await updatePlaceholder({
        companyId,
        placeholderId,
        body: { is_featured: !isFeatured },
      }).unwrap();
    } catch (err) {
      setPlaceholderError(getApiErrorMessage(err, "Could not update placeholder"));
    }
  }

  function handleRemovePlaceholder(placeholderId: string, label: string) {
    confirm({
      title: "Remove placeholder?",
      description: `Remove ${label} from the team page.`,
      confirmLabel: "Remove",
      variant: "destructive",
      onConfirm: async () => {
        await deletePlaceholder({ companyId, placeholderId }).unwrap();
        notifySuccess("Placeholder removed");
      },
    });
  }

  async function handleAssignMemberDepartment(memberUserId: string, departmentId: string) {
    try {
      await updateMember({
        companyId,
        memberUserId,
        body: { department_id: departmentId || null },
      }).unwrap();
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not update department"));
    }
  }

  async function handleAssignPlaceholderDepartment(
    placeholderId: string,
    departmentId: string
  ) {
    try {
      await updatePlaceholder({
        companyId,
        placeholderId,
        body: { department_id: departmentId || null },
      }).unwrap();
    } catch (err) {
      setPlaceholderError(getApiErrorMessage(err, "Could not update department"));
    }
  }

  async function handleCreateDepartment(event: React.FormEvent) {
    event.preventDefault();
    if (newDepartmentName.trim().length < 1) return;
    setIsAddingDepartment(true);
    setDepartmentError(null);
    try {
      const payload: CompanyDepartmentCreatePayload = { name: newDepartmentName.trim() };
      await createDepartment({ companyId, body: payload }).unwrap();
      setNewDepartmentName("");
      notifySuccess("Department added");
    } catch (err) {
      setDepartmentError(getApiErrorMessage(err, "Could not add department"));
    } finally {
      setIsAddingDepartment(false);
    }
  }

  function startRenameDepartment(departmentId: string, currentName: string) {
    setEditingDepartmentId(departmentId);
    setEditingDepartmentName(currentName);
    setDepartmentError(null);
  }

  async function handleSaveRenameDepartment() {
    if (!editingDepartmentId) return;
    const name = editingDepartmentName.trim();
    if (name.length < 1) {
      setEditingDepartmentId(null);
      return;
    }
    try {
      await updateDepartment({
        companyId,
        departmentId: editingDepartmentId,
        body: { name },
      }).unwrap();
      notifySuccess("Department renamed");
    } catch (err) {
      setDepartmentError(getApiErrorMessage(err, "Could not rename department"));
    } finally {
      setEditingDepartmentId(null);
    }
  }

  function handleDeleteDepartment(departmentId: string, name: string) {
    confirm({
      title: "Delete department?",
      description: `Remove "${name}"? Members and placeholders assigned to it will become unassigned.`,
      confirmLabel: "Delete",
      variant: "destructive",
      onConfirm: async () => {
        await deleteDepartment({ companyId, departmentId }).unwrap();
        notifySuccess("Department deleted");
      },
    });
  }

  async function handleCopyEmbedSnippet() {
    if (!company?.public_url) return;
    const snippet = `<iframe src="${company.public_url}/embed" width="100%" height="600" style="border:0;" loading="lazy" title="${company.name} team"></iframe>`;
    try {
      await navigator.clipboard.writeText(snippet);
      setEmbedCopied(true);
      notifySuccess("Embed snippet copied");
      setTimeout(() => setEmbedCopied(false), 2000);
    } catch {
      setError("Could not copy embed snippet");
    }
  }

  async function handleToggleFeatured(memberUserId: string, isFeatured: boolean) {
    try {
      await updateMember({
        companyId,
        memberUserId,
        body: { is_featured: !isFeatured },
      }).unwrap();
      notifySuccess(isFeatured ? "Removed from featured" : "Featured on team page");
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not update member"));
    }
  }

  async function handleChangeRole(memberUserId: string, role: "admin" | "member") {
    try {
      await updateMember({ companyId, memberUserId, body: { role } }).unwrap();
      notifySuccess(role === "admin" ? "Promoted to admin" : "Moved to member");
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not update role"));
    }
  }

  async function handleToggleConsent(nextConsent: boolean) {
    try {
      await updateMyConsent({ companyId, org_edit_consent: nextConsent }).unwrap();
      notifySuccess(
        nextConsent
          ? "Managers can now edit your portfolio"
          : "Managers can no longer edit your portfolio"
      );
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not update your consent setting"));
    }
  }

  async function handleRequestEdit(memberUserId: string) {
    try {
      await requestMemberEdit({ companyId, memberUserId }).unwrap();
      notifySuccess("Edit access requested");
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not request edit access"));
    }
  }

  async function handleSaveMemberPortfolio(body: CompanyMemberPortfolioUpdatePayload) {
    if (!portfolioSheetMemberId) return;
    try {
      await updateMemberPortfolio({
        companyId,
        memberUserId: portfolioSheetMemberId,
        body,
      }).unwrap();
      notifySuccess("Portfolio updated");
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not update portfolio"));
      throw err;
    }
  }

  function handleRemoveMember(memberUserId: string, label: string) {
    confirm({
      title: "Remove member?",
      description: `Remove ${label} from this organization? Their personal portfolio is not deleted.`,
      confirmLabel: "Remove",
      variant: "destructive",
      onConfirm: async () => {
        await removeMember({ companyId, memberUserId }).unwrap();
        notifySuccess("Member removed");
      },
    });
  }

  function handleDeleteOrg() {
    confirm({
      title: "Delete organization?",
      description:
        "This permanently deletes the organization, memberships, and invites. Member portfolios are kept.",
      confirmLabel: "Delete",
      variant: "destructive",
      onConfirm: async () => {
        await deleteCompany(companyId).unwrap();
        notifySuccess("Organization deleted");
        router.push("/organization");
      },
    });
  }

  async function persistOrder(next: CompanyMember[]) {
    setMembers(next);
    try {
      await reorderMembers({
        companyId,
        orderedUserIds: next.map((member) => member.user_id),
      }).unwrap();
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not reorder members"));
      refetch();
    }
  }

  function handleDrop(overUserId: string) {
    if (!isManager || !draggedId || draggedId === overUserId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }
    const fromIndex = members.findIndex((member) => member.user_id === draggedId);
    const toIndex = members.findIndex((member) => member.user_id === overUserId);
    if (fromIndex < 0 || toIndex < 0) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }
    const next = [...members];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setDraggedId(null);
    setDragOverId(null);
    void persistOrder(next);
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading organization…</p>;
  }

  if (isError || !company) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-destructive">
          Organization not found or you do not have access.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {confirmDialog}
      <PageHeader
        title={
          <span className="inline-flex items-center gap-2">
            {company.name}
            {company.is_verified ? (
              <Badge className="gap-1 bg-blue-500/15 text-blue-700 dark:text-blue-300">
                <BadgeCheck className="h-3.5 w-3.5" />
                Verified
              </Badge>
            ) : null}
          </span>
        }
        description="Manage members, invites, and your public team page."
      >
        <div className="flex flex-wrap gap-2">
          {isManager ? (
            <>
              <Button onClick={() => setInviteSheetOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Invite member
              </Button>
              <Button variant="outline" onClick={() => setEditSheetOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </>
          ) : null}
          {isOwner ? (
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive"
              disabled={deleting}
              onClick={handleDeleteOrg}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          ) : null}
          <Link
            href={`/companies/${company.slug}`}
            target="_blank"
            className={buttonVariants({ variant: "outline", size: "default" })}
          >
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
            Team page
          </Link>
          <Link
            href="/organization"
            className={buttonVariants({ variant: "ghost", size: "default" })}
          >
            All organizations
          </Link>
        </div>
      </PageHeader>

      {error ? <FormAlert message={error} /> : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Members</CardDescription>
            <CardTitle className="text-3xl">{company.member_count}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Your role</CardDescription>
            <CardTitle className="text-3xl capitalize">{company.my_role}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Visibility</CardDescription>
            <CardTitle className="text-3xl">
              {company.is_public ? "Public" : "Private"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {isManager && usage ? (
        <Card>
          <CardHeader>
            <CardTitle>Plan usage</CardTitle>
            <CardDescription>
              Seats and organization limits are based on the owner&apos;s{" "}
              <span className="font-medium capitalize">{usage.plan}</span> plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 rounded-lg border p-3">
                <p className="text-sm font-medium">Seats used</p>
                <p className="text-2xl font-semibold">
                  {usage.seats_used}
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    / {usage.seat_limit === -1 ? "Unlimited" : usage.seat_limit}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Members plus reserved placeholders count toward seats.
                </p>
              </div>
              <div className="space-y-1.5 rounded-lg border p-3">
                <p className="text-sm font-medium">Organizations owned</p>
                <p className="text-2xl font-semibold">
                  {usage.orgs_owned}
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    / {usage.org_limit === -1 ? "Unlimited" : usage.org_limit}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Counted for the organization owner&apos;s account.
                </p>
              </div>
            </div>
            {!usage.is_pro_owner &&
            (usage.seats_used >= usage.seat_limit ||
              usage.orgs_owned >= usage.org_limit) ? (
              <div className="flex flex-col gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  You&apos;re at the Free plan limit. Upgrade the owner to Pro for
                  unlimited organizations and up to 50 seats.
                </p>
                <Link
                  href={PAYMENT_PATH}
                  className={cn(buttonVariants({ size: "sm" }), "shrink-0")}
                >
                  Upgrade to Pro
                </Link>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {currentMember ? (
        <Card>
          <CardHeader>
            <CardTitle>Your portfolio access</CardTitle>
            <CardDescription>
              Control whether organization managers can edit your personal portfolio
              on your behalf.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2.5">
              <div className="min-w-0 flex-1 pr-2">
                <p className="text-sm font-medium">Allow managers to edit</p>
                <p className="text-xs text-muted-foreground">
                  Owners and admins can update your profile and portfolio settings
                </p>
              </div>
              <Switch
                checked={currentMember.org_edit_consent}
                onCheckedChange={handleToggleConsent}
                aria-label="Allow managers to edit your portfolio"
                className="shrink-0"
              />
            </div>
            {currentMember.org_edit_requested_at && !currentMember.org_edit_consent ? (
              <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300">
                Edit access requested{" "}
                {new Date(currentMember.org_edit_requested_at).toLocaleDateString()}
              </Badge>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {isManager && analytics ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                Team page views
              </CardDescription>
              <CardTitle className="text-2xl">{analytics.page_views_total}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {analytics.page_views_last_7_days} in last 7 days
              </p>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <MousePointerClick className="h-3.5 w-3.5" />
                Portfolio clicks
              </CardDescription>
              <CardTitle className="text-2xl">{analytics.member_clicks_total}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {analytics.member_clicks_last_7_days} in last 7 days
              </p>
            </CardHeader>
          </Card>
          <Card className="sm:col-span-2">
            <CardHeader className="pb-2">
              <CardDescription>Top portfolio clicks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1.5 pt-0">
              {analytics.top_member_clicks.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No portfolio clicks yet. Share your team page to start tracking.
                </p>
              ) : (
                analytics.top_member_clicks.map((row) => (
                  <div
                    key={row.user_id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="truncate">{row.full_name}</span>
                    <span className="text-muted-foreground">{row.clicks}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
          <div>
            <CardTitle>Team members</CardTitle>
            <CardDescription>
              {isManager
                ? "Drag to reorder how members appear. Feature people for the public team page."
                : "Featured members appear first on the public team page. Only public portfolios show publicly."}
            </CardDescription>
          </div>
          {isManager ? (
            <Button size="sm" onClick={() => setInviteSheetOpen(true)}>
              <Mail className="mr-1.5 h-3.5 w-3.5" />
              Invite
            </Button>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-3">
          {members.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No members yet. Invite teammates to build your team page.
            </p>
          ) : null}
          {members.map((member) => {
            const isSelf = member.user_id === currentUserId;
            const canRequestEdit =
              isManager && !isSelf && !member.org_edit_consent;
            const canEditPortfolio =
              isManager && !isSelf && member.org_edit_consent;
            return (
              <div
                key={member.id}
                draggable={isManager}
                onDragStart={() => setDraggedId(member.user_id)}
                onDragEnd={() => {
                  setDraggedId(null);
                  setDragOverId(null);
                }}
                onDragOver={(event) => {
                  if (!isManager) return;
                  event.preventDefault();
                  setDragOverId(member.user_id);
                }}
                onDrop={() => handleDrop(member.user_id)}
                className={cn(
                  "flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between",
                  draggedId === member.user_id && "opacity-50",
                  dragOverId === member.user_id && "ring-2 ring-primary/30"
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  {isManager ? (
                    <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
                  ) : null}
                  <ProfileAvatar
                    src={member.avatar_url || null}
                    alt={member.full_name}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium">{member.full_name}</p>
                      <Badge variant="secondary" className="capitalize">
                        {member.role}
                      </Badge>
                      {member.is_featured ? (
                        <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300">
                          Featured
                        </Badge>
                      ) : null}
                      {isManager && member.org_edit_consent ? (
                        <Badge variant="outline">Edit access</Badge>
                      ) : null}
                      {isManager &&
                      !member.org_edit_consent &&
                      member.org_edit_requested_at ? (
                        <Badge variant="outline">Edit requested</Badge>
                      ) : null}
                      {isManager
                        ? completenessBadges(member).map((badge) => (
                            <Badge
                              key={badge.label}
                              variant="outline"
                              className={badge.className}
                            >
                              {badge.label}
                            </Badge>
                          ))
                        : null}
                      {!isManager && member.department_name ? (
                        <Badge variant="outline">{member.department_name}</Badge>
                      ) : null}
                    </div>
                    <p className="truncate text-sm text-muted-foreground">
                      {member.title || member.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Portfolio:{" "}
                      {member.portfolio_username
                        ? `/${member.portfolio_username}${
                            member.portfolio_is_public ? "" : " (private)"
                          }`
                        : "not set"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {isManager && departments.length > 0 ? (
                    <NativeSelect
                      className="h-7 w-auto min-w-[9rem] text-xs"
                      value={member.department_id ?? ""}
                      onChange={(e) =>
                        handleAssignMemberDepartment(member.user_id, e.target.value)
                      }
                      aria-label={`Department for ${member.full_name}`}
                    >
                      <option value="">No department</option>
                      {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                          {department.name}
                        </option>
                      ))}
                    </NativeSelect>
                  ) : null}
                  {member.portfolio_username ? (
                    <Link
                      href={`/${member.portfolio_username}`}
                      target="_blank"
                      className={buttonVariants({ size: "sm", variant: "outline" })}
                    >
                      Preview
                    </Link>
                  ) : null}
                  {isManager ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleToggleFeatured(member.user_id, member.is_featured)
                      }
                    >
                      <Star className="mr-1.5 h-3.5 w-3.5" />
                      {member.is_featured ? "Unfeature" : "Feature"}
                    </Button>
                  ) : null}
                  {canEditPortfolio ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPortfolioSheetMemberId(member.user_id)}
                    >
                      <UserPen className="mr-1.5 h-3.5 w-3.5" />
                      Edit portfolio
                    </Button>
                  ) : null}
                  {canRequestEdit ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={Boolean(member.org_edit_requested_at)}
                      onClick={() => handleRequestEdit(member.user_id)}
                    >
                      {member.org_edit_requested_at
                        ? "Edit access requested"
                        : "Request edit access"}
                    </Button>
                  ) : null}
                  {isOwner && !isSelf && member.role === "member" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleChangeRole(member.user_id, "admin")}
                    >
                      <Shield className="mr-1.5 h-3.5 w-3.5" />
                      Make admin
                    </Button>
                  ) : null}
                  {isOwner && !isSelf && member.role === "admin" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleChangeRole(member.user_id, "member")}
                    >
                      <ShieldOff className="mr-1.5 h-3.5 w-3.5" />
                      Make member
                    </Button>
                  ) : null}
                  {!isSelf && canRemoveMember(member) ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        handleRemoveMember(member.user_id, member.full_name)
                      }
                    >
                      <UserMinus className="mr-1.5 h-3.5 w-3.5" />
                      Remove
                    </Button>
                  ) : null}
                  {isSelf && member.role !== "owner" ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveMember(member.user_id, "yourself")}
                    >
                      Leave
                    </Button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {isManager ? (
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <div>
              <CardTitle>Placeholders</CardTitle>
              <CardDescription>
                Reserve team page spots for people who haven&apos;t joined yet.
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setPlaceholderSheetOpen(true)}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add placeholder
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {placeholderError ? <FormAlert message={placeholderError} /> : null}
            {company.placeholders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No placeholders yet.</p>
            ) : (
              company.placeholders.map((placeholder) => (
                <div
                  key={placeholder.id}
                  className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium">{placeholder.display_name}</p>
                      {placeholder.is_featured ? (
                        <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300">
                          Featured
                        </Badge>
                      ) : null}
                      <Badge variant="outline">
                        {placeholder.invite_id ? "Invited" : "Not invited"}
                      </Badge>
                      {placeholder.department_name ? (
                        <Badge variant="outline">{placeholder.department_name}</Badge>
                      ) : null}
                    </div>
                    <p className="truncate text-sm text-muted-foreground">
                      {placeholder.title || placeholder.email}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {departments.length > 0 ? (
                      <NativeSelect
                        className="h-7 w-auto min-w-[9rem] text-xs"
                        value={placeholder.department_id ?? ""}
                        onChange={(e) =>
                          handleAssignPlaceholderDepartment(
                            placeholder.id,
                            e.target.value
                          )
                        }
                        aria-label={`Department for ${placeholder.display_name}`}
                      >
                        <option value="">No department</option>
                        {departments.map((department) => (
                          <option key={department.id} value={department.id}>
                            {department.name}
                          </option>
                        ))}
                      </NativeSelect>
                    ) : null}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleTogglePlaceholderFeatured(
                          placeholder.id,
                          placeholder.is_featured
                        )
                      }
                    >
                      <Star className="mr-1.5 h-3.5 w-3.5" />
                      {placeholder.is_featured ? "Unfeature" : "Feature"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        handleRemovePlaceholder(
                          placeholder.id,
                          placeholder.display_name
                        )
                      }
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      ) : null}

      {isManager ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="h-4 w-4" />
              Departments
            </CardTitle>
            <CardDescription>
              Organize members and placeholders into departments for your team page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {departmentError ? <FormAlert message={departmentError} /> : null}
            {departments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No departments yet.</p>
            ) : (
              <div className="space-y-2">
                {departments.map((department) => (
                  <div
                    key={department.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2"
                  >
                    {editingDepartmentId === department.id ? (
                      <div className="flex flex-1 items-center gap-2">
                        <Input
                          autoFocus
                          value={editingDepartmentName}
                          onChange={(e) => setEditingDepartmentName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              void handleSaveRenameDepartment();
                            }
                            if (e.key === "Escape") setEditingDepartmentId(null);
                          }}
                          className="h-8"
                        />
                        <Button
                          size="icon-sm"
                          variant="outline"
                          type="button"
                          onClick={handleSaveRenameDepartment}
                          aria-label="Save department name"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          type="button"
                          onClick={() => setEditingDepartmentId(null)}
                          aria-label="Cancel rename"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{department.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {department.member_count + department.placeholder_count} people
                          </p>
                        </div>
                        <div className="flex gap-1.5">
                          <Button
                            size="icon-sm"
                            variant="outline"
                            type="button"
                            onClick={() =>
                              startRenameDepartment(department.id, department.name)
                            }
                            aria-label={`Rename ${department.name}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            type="button"
                            onClick={() =>
                              handleDeleteDepartment(department.id, department.name)
                            }
                            aria-label={`Delete ${department.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
            <form onSubmit={handleCreateDepartment} className="flex gap-2">
              <Input
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
                placeholder="e.g. Engineering"
                aria-label="New department name"
              />
              <Button
                type="submit"
                variant="outline"
                disabled={isAddingDepartment || newDepartmentName.trim().length < 1}
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {isManager ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              Embed your team page
            </CardTitle>
            <CardDescription>
              Paste this snippet into your own website to embed a compact view of
              your team page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <pre className="overflow-x-auto rounded-lg border bg-muted/50 p-3 text-xs">
              <code>{`<iframe src="${company.public_url ?? ""}/embed" width="100%" height="600" style="border:0;" loading="lazy" title="${company.name} team"></iframe>`}</code>
            </pre>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={handleCopyEmbedSnippet}>
                {embedCopied ? (
                  <Check className="mr-1.5 h-3.5 w-3.5" />
                ) : (
                  <Copy className="mr-1.5 h-3.5 w-3.5" />
                )}
                {embedCopied ? "Copied" : "Copy snippet"}
              </Button>
              <Link
                href={`/companies/${company.slug}/embed`}
                target="_blank"
                className={cn(buttonVariants({ size: "sm", variant: "ghost" }), "gap-1.5")}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Preview embed
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {isManager ? (
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <div>
              <CardTitle>Invites</CardTitle>
              <CardDescription>
                Pending invites. Copy the link or revoke access anytime.
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setInviteSheetOpen(true)}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add invite
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {inviteError ? <FormAlert message={inviteError} /> : null}
            {pendingInvites.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending invites.</p>
            ) : (
              pendingInvites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{invite.email}</p>
                      <Badge variant="secondary" className="capitalize">
                        {invite.role}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Expires {new Date(invite.expires_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {invite.invite_url ? (
                      <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        onClick={async () => {
                          await navigator.clipboard.writeText(invite.invite_url!);
                          notifySuccess("Invite link copied");
                        }}
                      >
                        <Copy className="mr-1.5 h-3.5 w-3.5" />
                        Copy link
                      </Button>
                    ) : null}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={async () => {
                        try {
                          await revokeInvite({
                            companyId,
                            inviteId: invite.id,
                          }).unwrap();
                          notifySuccess("Invite revoked");
                        } catch (err) {
                          setInviteError(
                            getApiErrorMessage(err, "Could not revoke invite")
                          );
                        }
                      }}
                    >
                      Revoke
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      ) : null}

      {isManager ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activity log
            </CardTitle>
            <CardDescription>Recent changes made to this organization.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {auditLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
            ) : (
              auditLogs.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-col gap-1 rounded-lg border px-3 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <span className="font-medium">
                      {entry.actor_name ?? "Someone"}
                    </span>{" "}
                    <span className="text-muted-foreground">
                      {entry.action.replace(/_/g, " ")}
                      {entry.target_type ? ` · ${entry.target_type}` : ""}
                    </span>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {new Date(entry.created_at).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      ) : null}

      {isOwner ? (
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Danger zone</CardTitle>
            <CardDescription>
              Deleting the organization cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" disabled={deleting} onClick={handleDeleteOrg}>
              <Trash2 className="mr-2 h-4 w-4" />
              {deleting ? "Deleting…" : "Delete organization"}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <OrganizationFormSheet
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        company={company}
        isOwnerPro={usage?.is_pro_owner ?? false}
        onSubmit={handleSave}
      />
      <OrganizationInviteFormSheet
        open={inviteSheetOpen}
        onOpenChange={setInviteSheetOpen}
        canInviteAdmin={isOwner}
        onSubmit={handleInvite}
      />
      <OrganizationPlaceholderFormSheet
        open={placeholderSheetOpen}
        onOpenChange={setPlaceholderSheetOpen}
        canInviteAdmin={isOwner}
        departments={departments}
        onSubmit={handleAddPlaceholder}
      />
      <OrganizationMemberPortfolioSheet
        open={Boolean(portfolioSheetMemberId)}
        onOpenChange={(open) => {
          if (!open) setPortfolioSheetMemberId(null);
        }}
        companyId={companyId}
        memberUserId={portfolioSheetMemberId}
        memberName={portfolioSheetMember?.full_name}
        onSubmit={handleSaveMemberPortfolio}
      />
    </div>
  );
}
