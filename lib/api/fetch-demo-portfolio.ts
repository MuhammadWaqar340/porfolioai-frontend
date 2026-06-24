import type { PublicPortfolio } from "@/lib/api/types";

export async function fetchDemoPortfolio(): Promise<PublicPortfolio | null> {
  const base =
    process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8001/api/v1";

  try {
    const response = await fetch(`${base}/demo/portfolio`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return null;
    const json = (await response.json()) as { data: PublicPortfolio };
    return json.data;
  } catch {
    return null;
  }
}
