import { Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProBadgeProps {
  className?: string;
}

export function ProBadge({ className }: ProBadgeProps) {
  return (
    <Badge
      className={cn(
        "gap-1 border-amber-500/30 bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-800 dark:text-amber-200",
        className
      )}
    >
      <Crown className="h-3 w-3" />
      Pro
    </Badge>
  );
}
