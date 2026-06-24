import {
  Briefcase,
  Building2,
  ChartPie,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  wrench: Wrench,
  building: Building2,
  chart: ChartPie,
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  change?: string;
  className?: string;
}

export function StatCard({ label, value, icon, change, className }: StatCardProps) {
  const Icon = iconMap[icon] ?? Briefcase;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-violet-500/10 ring-1 ring-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight tabular-nums">
          {value}
        </div>
        {change && (
          <p className="mt-1 text-xs text-muted-foreground">{change}</p>
        )}
      </CardContent>
    </Card>
  );
}
