import { TemplatesGrid } from "@/components/templates/templates-grid";
import { PageHeader } from "@/components/layout/page-header";

export const metadata = {
  title: "Templates",
};

export default function TemplatesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Templates"
        description="Choose a template that best represents your personal brand."
      />

      <TemplatesGrid />
    </div>
  );
}
