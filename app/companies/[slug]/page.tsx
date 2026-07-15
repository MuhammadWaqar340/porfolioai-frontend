import type { Metadata } from "next";
import { PublicCompanyPageClient } from "@/components/organization/public-company-page-client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

interface PublicCompanySummary {
  name: string;
  seo_title: string;
  seo_description: string;
  about: string;
  logo_url: string;
  industry: string;
}

async function fetchPublicCompany(slug: string): Promise<PublicCompanySummary | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/companies/public/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company = await fetchPublicCompany(slug);

  if (!company) {
    return {
      title: "Organization",
      robots: { index: false, follow: false },
    };
  }

  const title = company.seo_title || `${company.name} · Team`;
  const description =
    company.seo_description ||
    company.about ||
    `Meet the ${company.name} team and explore their portfolios.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: company.logo_url ? [{ url: company.logo_url }] : undefined,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function PublicCompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PublicCompanyPageClient slug={slug} />;
}
