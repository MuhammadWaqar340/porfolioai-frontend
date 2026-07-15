import { OrganizationDetailClient } from "@/components/organization/organization-detail-client";

export const metadata = {
  title: "Organization",
};

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrganizationDetailClient companyId={id} />;
}
