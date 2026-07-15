import { OrganizationInviteAcceptClient } from "@/components/organization/organization-invite-accept-client";

export const metadata = {
  title: "Organization invite",
};

export default async function OrganizationInvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <OrganizationInviteAcceptClient token={token} />;
}
