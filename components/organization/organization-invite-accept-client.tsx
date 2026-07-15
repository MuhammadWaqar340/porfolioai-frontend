"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Building2 } from "lucide-react";
import { FormAlert } from "@/components/ui/form-alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getApiErrorMessage } from "@/lib/api/form-errors";
import { notifySuccess } from "@/lib/toast";
import { useIsAuthenticated } from "@/store/hooks";
import {
  useAcceptCompanyInviteMutation,
  usePreviewCompanyInviteQuery,
} from "@/store/api/portfolioApi";

interface OrganizationInviteAcceptClientProps {
  token: string;
}

export function OrganizationInviteAcceptClient({
  token,
}: OrganizationInviteAcceptClientProps) {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const { data, isLoading, isError, error } = usePreviewCompanyInviteQuery(token);
  const [acceptInvite, { isLoading: accepting }] = useAcceptCompanyInviteMutation();
  const [acceptError, setAcceptError] = useState<string | null>(null);

  async function handleAccept() {
    setAcceptError(null);
    try {
      const company = await acceptInvite(token).unwrap();
      notifySuccess("Welcome to the organization");
      router.push(`/organization/${company.id}`);
    } catch (err) {
      setAcceptError(getApiErrorMessage(err, "Could not accept invite"));
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20">
        <p className="text-center text-sm text-muted-foreground">Loading invite…</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20">
        <Card>
          <CardContent className="space-y-4 py-10 text-center">
            <p className="text-sm text-destructive">
              {getApiErrorMessage(error, "This invite is invalid or has expired.")}
            </p>
            <Link href="/login" className={buttonVariants({ variant: "outline" })}>
              Go to login
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:py-24">
      <Card>
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-muted">
            {data.company_logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.company_logo_url}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <CardTitle className="text-2xl">Join {data.company_name}</CardTitle>
            <CardDescription className="mt-2">
              You were invited as a {data.role}. Sign in with{" "}
              <span className="font-medium text-foreground">{data.email}</span> to accept.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {acceptError ? <FormAlert message={acceptError} /> : null}
          {data.status !== "pending" ? (
            <p className="text-center text-sm text-muted-foreground">
              This invite is {data.status}.
            </p>
          ) : null}

          {!isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <Link href="/login" className={buttonVariants()}>
                Sign in to accept
              </Link>
              <Link href="/signup" className={buttonVariants({ variant: "outline" })}>
                Create account
              </Link>
            </div>
          ) : (
            <Button
              className="w-full"
              disabled={accepting || data.status !== "pending"}
              onClick={handleAccept}
            >
              {accepting ? "Accepting…" : "Accept invite"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
