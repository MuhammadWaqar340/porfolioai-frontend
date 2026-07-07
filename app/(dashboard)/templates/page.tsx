import { TemplatesGrid } from "@/components/templates/templates-grid";
import { PageHeader } from "@/components/layout/page-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Templates",
};

export default function TemplatesPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Templates"
        description="Browse layouts, preview live demos, and apply the one that fits your brand. Changes appear instantly in Preview."
      >
        <Button variant="outline" render={<Link href="/preview" />} nativeButton={false}>
          Open preview
        </Button>
      </PageHeader>

      <TemplatesGrid selectable />
    </div>
  );
}
