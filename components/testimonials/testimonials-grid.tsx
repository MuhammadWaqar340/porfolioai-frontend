"use client";

import { Plus, Quote, Trash2 } from "lucide-react";
import { useState } from "react";
import { TestimonialFormSheet } from "@/components/testimonials/testimonial-form-sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollableCardBody } from "@/components/ui/scrollable-card-body";
import { Switch } from "@/components/ui/switch";
import type { PortfolioTestimonial } from "@/lib/api/types";
import { confirmDeleteDescription } from "@/lib/confirm-dialog-copy";
import { cn } from "@/lib/utils";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import {
  useDeleteTestimonialMutation,
  useGetTestimonialsQuery,
  useUpdateTestimonialMutation,
} from "@/store/api/portfolioApi";

function authorSubtitle(item: PortfolioTestimonial) {
  const parts = [item.author_role, item.author_company].filter(Boolean);
  return parts.join(" · ");
}

export function TestimonialsGrid() {
  const { data: testimonials = [], isLoading } = useGetTestimonialsQuery();
  const [updateTestimonial] = useUpdateTestimonialMutation();
  const [deleteTestimonial] = useDeleteTestimonialMutation();
  const { confirm, confirmDialog } = useConfirmDialog();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<PortfolioTestimonial | null>(null);

  function openAdd() {
    setEditing(null);
    setSheetOpen(true);
  }

  function openEdit(item: PortfolioTestimonial) {
    setEditing(item);
    setSheetOpen(true);
  }

  async function togglePublished(item: PortfolioTestimonial, published: boolean) {
    await updateTestimonial({ id: item.id, is_published: published }).unwrap();
  }

  function requestDelete(item: PortfolioTestimonial) {
    confirm({
      title: "Delete testimonial?",
      description: confirmDeleteDescription(
        item.author_name,
        "from your testimonials"
      ),
      confirmLabel: "Delete",
      variant: "destructive",
      onConfirm: async () => {
        await deleteTestimonial(item.id).unwrap();
      },
    });
  }

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-xl border bg-muted/40" />;
  }

  if (testimonials.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <Quote className="h-10 w-10 text-muted-foreground/60" />
          <p className="text-muted-foreground">
            No testimonials yet. Add quotes from clients, managers, or colleagues.
          </p>
          <Button onClick={openAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add testimonial
          </Button>
        </CardContent>
        <TestimonialFormSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          testimonial={editing}
        />
        {confirmDialog}
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {testimonials.map((item) => (
          <Card
            key={item.id}
            className={cn(
              "min-w-0 overflow-hidden transition-shadow hover:shadow-md",
              !item.is_published && "border-dashed bg-muted/10"
            )}
          >
            <CardHeader className="space-y-3 border-b bg-muted/20 pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="text-base">{item.author_name}</CardTitle>
                  {authorSubtitle(item) ? (
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {authorSubtitle(item)}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 flex-wrap justify-end gap-1">
                  {item.source === "visitor" ? (
                    <Badge variant="outline" className="text-[10px]">
                      Visitor
                    </Badge>
                  ) : null}
                  {!item.is_published ? (
                    <Badge variant="secondary" className="text-[10px]">
                      Draft
                    </Badge>
                  ) : (
                    <Badge className="bg-primary/15 text-[10px] text-primary hover:bg-primary/15">
                      Live
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="min-w-0 space-y-4 pt-4">
              <ScrollableCardBody>
                <blockquote className="break-words [overflow-wrap:anywhere] whitespace-pre-wrap border-l-2 border-primary/40 pl-3 text-sm leading-relaxed text-muted-foreground">
                  “{item.quote}”
                </blockquote>
              </ScrollableCardBody>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={item.is_published}
                    onCheckedChange={(value) => void togglePublished(item, value)}
                    aria-label={`Publish testimonial from ${item.author_name}`}
                  />
                  <span className="text-xs text-muted-foreground">Published</span>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => openEdit(item)}>
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => requestDelete(item)}
                    aria-label="Delete testimonial"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <TestimonialFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        testimonial={editing}
      />
      {confirmDialog}
    </>
  );
}

export function TestimonialsManagerActions() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setSheetOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add testimonial
      </Button>
      <TestimonialFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        testimonial={null}
      />
    </>
  );
}
