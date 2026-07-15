"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Building2, ExternalLink, Pencil, Plus, Trash2, Users } from "lucide-react";
import { OrganizationFormSheet } from "@/components/organization/organization-form-sheet";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormAlert } from "@/components/ui/form-alert";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { useSubscription } from "@/hooks/use-subscription";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import type { Company, CompanyCreatePayload } from "@/lib/api/types";
import { notifySuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";
import {
  useCreateCompanyMutation,
  useDeleteCompanyMutation,
  useGetMyCompaniesQuery,
  useUpdateCompanyMutation,
} from "@/store/api/portfolioApi";

export function OrganizationListClient() {
  const router = useRouter();
  const { confirm, confirmDialog } = useConfirmDialog();
  const { isPro } = useSubscription();
  const { data: companies = [], isLoading, isError, refetch } = useGetMyCompaniesQuery();
  const [createCompany] = useCreateCompanyMutation();
  const [updateCompany] = useUpdateCompanyMutation();
  const [deleteCompany] = useDeleteCompanyMutation();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);

  function openAddSheet() {
    setError(null);
    setEditingCompany(null);
    setSheetOpen(true);
  }

  function openEditSheet(company: Company) {
    setError(null);
    setEditingCompany(company);
    setSheetOpen(true);
  }

  function handleSheetOpenChange(open: boolean) {
    setSheetOpen(open);
    if (!open) setEditingCompany(null);
  }

  async function handleSubmit(payload: CompanyCreatePayload) {
    try {
      if (editingCompany) {
        await updateCompany({
          companyId: editingCompany.id,
          body: payload,
        }).unwrap();
        notifySuccess("Organization updated");
        refetch();
        return;
      }

      const company = await createCompany(payload).unwrap();
      notifySuccess("Organization created");
      router.push(`/organization/${company.id}`);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save organization"));
      throw err;
    }
  }

  function handleDelete(company: Company) {
    confirm({
      title: "Delete organization?",
      description:
        `This permanently deletes "${company.name}", its memberships, and invites. Member portfolios are kept.`,
      confirmLabel: "Delete",
      variant: "destructive",
      onConfirm: async () => {
        await deleteCompany(company.id).unwrap();
        notifySuccess("Organization deleted");
        refetch();
      },
    });
  }

  return (
    <div className="space-y-8">
      {confirmDialog}
      <PageHeader
        title="Organizations"
        description="Create a company hub and manage employee portfolios under one brand."
      >
        <Button onClick={openAddSheet}>
          <Plus className="mr-2 h-4 w-4" />
          Add Organization
        </Button>
      </PageHeader>

      {error ? <FormAlert message={error} /> : null}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading organizations…</p>
      ) : null}

      {isError ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-destructive">
            Could not load organizations. Make sure the backend is running.
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !isError && companies.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <Building2 className="h-10 w-10 text-muted-foreground" />
            <div className="space-y-1">
              <p className="font-medium">No organizations yet</p>
              <p className="max-w-md text-sm text-muted-foreground">
                Add your first organization, invite teammates, and publish a team page
                that links to each member&apos;s portfolio.
              </p>
            </div>
            <Button onClick={openAddSheet}>
              <Plus className="mr-2 h-4 w-4" />
              Add Organization
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {companies.map((company) => {
          const isOwner = company.my_role === "owner";
          const isManager = isOwner || company.my_role === "admin";
          return (
            <Card key={company.id} className="overflow-hidden">
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-muted">
                      {company.logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={company.logo_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <CardDescription>/{company.slug}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary">{company.my_role ?? "member"}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {company.about || "No description yet."}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {company.member_count} member
                  {company.member_count === 1 ? "" : "s"}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/organization/${company.id}`}
                    className={buttonVariants({ size: "sm" })}
                  >
                    Open
                  </Link>
                  <Link
                    href={`/companies/${company.slug}`}
                    target="_blank"
                    className={cn(
                      buttonVariants({ size: "sm", variant: "outline" }),
                      "gap-1.5"
                    )}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Team page
                  </Link>
                  {isManager ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditSheet(company)}
                    >
                      <Pencil className="mr-1.5 h-3.5 w-3.5" />
                      Edit
                    </Button>
                  ) : null}
                  {isOwner ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(company)}
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                      Delete
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <OrganizationFormSheet
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
        company={editingCompany}
        isOwnerPro={isPro && editingCompany?.my_role === "owner"}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
