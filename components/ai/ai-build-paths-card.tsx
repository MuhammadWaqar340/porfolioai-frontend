import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BUILD_PATHS } from "@/lib/ai/copilot";
import { cn } from "@/lib/utils";

export function AIBuildPathsCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-primary" />
          Choose your path
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Pick how you want to build — you can switch anytime.
        </p>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        {BUILD_PATHS.map((path) => (
          <a
            key={path.id}
            href={path.href}
            className={cn(
              "group flex min-w-0 flex-col rounded-lg border p-3 transition-colors",
              "hover:border-primary/30 hover:bg-muted/50",
              path.id === "hybrid" && "border-primary/25 bg-primary/5"
            )}
          >
            <p className="text-sm font-medium group-hover:text-primary">{path.title}</p>
            <p className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground">
              {path.description}
            </p>
          </a>
        ))}
      </CardContent>
    </Card>
  );
}
