import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const editIconButtonClassName =
  "text-sky-500 hover:bg-sky-500/10 hover:text-sky-600 dark:text-sky-400 dark:hover:bg-sky-500/15 dark:hover:text-sky-300";

export const editLinkClassName =
  "inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 hover:underline dark:text-sky-400 dark:hover:text-sky-300";

export const editActionButtonClassName =
  "border-sky-500/30 text-sky-600 hover:bg-sky-500/10 hover:text-sky-700 dark:border-sky-500/40 dark:text-sky-400 dark:hover:bg-sky-500/10 dark:hover:text-sky-300";

type EditIconButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "variant" | "size" | "children"
>;

export function EditIconButton({ className, ...props }: EditIconButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={cn(editIconButtonClassName, className)}
      {...props}
    >
      <Pencil className="h-4 w-4" />
    </Button>
  );
}
