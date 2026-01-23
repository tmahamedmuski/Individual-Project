import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Button } from "./button";

interface RoleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  variant: "requester" | "worker" | "broker" | "admin";
  onClick: () => void;
  className?: string;
}

export function RoleCard({
  title,
  description,
  icon: Icon,
  variant,
  onClick,
  className,
}: RoleCardProps) {
  const iconColors = {
    requester: "bg-requester/10 text-requester",
    worker: "bg-worker/10 text-worker",
    broker: "bg-broker/10 text-broker",
    admin: "bg-admin/10 text-admin",
  };

  const buttonColors = {
    requester: "bg-requester hover:bg-requester/90",
    worker: "bg-worker hover:bg-worker/90",
    broker: "bg-broker hover:bg-broker/90",
    admin: "bg-admin hover:bg-admin/90",
  };

  return (
    <div
      className={cn(
        "role-card flex flex-col items-center text-center",
        variant,
        className
      )}
      onClick={onClick}
    >
      <div className={cn("rounded-2xl p-5 mb-5", iconColors[variant])}>
        <Icon className="h-10 w-10" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-6 flex-1">{description}</p>
      <Button
        className={cn("w-full text-white font-medium", buttonColors[variant])}
        size="lg"
      >
        Continue as {title}
      </Button>
    </div>
  );
}
