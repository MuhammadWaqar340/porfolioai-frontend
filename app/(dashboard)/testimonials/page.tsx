import { TestimonialsGrid, TestimonialsManagerActions } from "@/components/testimonials/testimonials-grid";
import { PageHeader } from "@/components/layout/page-header";

export const metadata = {
  title: "Testimonials",
};

export default function TestimonialsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Testimonials"
        description="Manage quotes shown on your public portfolio. Approve visitor submissions before publishing."
      >
        <TestimonialsManagerActions />
      </PageHeader>
      <TestimonialsGrid />
    </div>
  );
}
