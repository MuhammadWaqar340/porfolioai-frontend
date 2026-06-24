import { cn } from "@/lib/utils";

interface AIPageSectionProps {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function AIPageSection({
  id,
  title,
  description,
  children,
  className,
  contentClassName,
}: AIPageSectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-6 space-y-4", className)}>
      <div className="space-y-1">
        <h2 className="font-heading text-lg font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      <div className={cn("space-y-4", contentClassName)}>{children}</div>
    </section>
  );
}
