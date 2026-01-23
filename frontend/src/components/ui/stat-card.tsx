import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "requester" | "worker" | "broker" | "admin";
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  const iconBgColors = {
    default: "bg-primary/10 text-primary",
    requester: "bg-requester-light text-requester",
    worker: "bg-worker-light text-worker",
    broker: "bg-broker-light text-broker",
    admin: "bg-admin-light text-admin",
  };

  return (
    <div className={cn("stat-card group", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}
              >
                {trend.isPositive ? "+" : "-"}{trend.value}%
              </span>
              <span className="text-sm text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "rounded-xl p-3 transition-transform duration-200 group-hover:scale-110",
            iconBgColors[variant]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
