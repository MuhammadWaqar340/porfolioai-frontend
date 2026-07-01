import {
  Briefcase,
  FileText,
  Mic,
  Search,
  Upload,
  User,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AIFeature } from "@/types";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  user: User,
  briefcase: Briefcase,
  upload: Upload,
  search: Search,
  "file-text": FileText,
  mic: Mic,
};

interface AIFeatureCardProps {
  feature: AIFeature;
  className?: string;
}

export function AIFeatureCard({ feature, className }: AIFeatureCardProps) {
  const Icon = iconMap[feature.icon] ?? User;

  return (
    <Card className={cn("transition-shadow hover:shadow-md", className)}>
      <CardHeader>
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <CardTitle className="text-lg">{feature.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{feature.description}</p>
        {feature.example && (
          <div className="rounded-lg border bg-muted/50 p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Example output
            </p>
            <p className="text-sm leading-relaxed">{feature.example}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
