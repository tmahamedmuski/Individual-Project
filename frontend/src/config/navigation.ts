import {
    Home,
    ShieldCheck,
    AlertTriangle,
    Users,
    Activity,
    Settings,
    Briefcase,
    User,
    MessageSquare,
    LucideIcon,
    Search
} from "lucide-react";

export interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
    badge?: number;
}

export const adminNavItems: NavItem[] = [
    { label: "Dashboard", href: "/admin", icon: Home },
    { label: "Verification", href: "/admin/verification", icon: ShieldCheck },
    { label: "Disputes", href: "/admin/disputes", icon: AlertTriangle, badge: 0 },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Activity Logs", href: "/admin/logs", icon: Activity },
    { label: "Settings", href: "/settings", icon: Settings },
];

export const workerNavItems: NavItem[] = [
    { label: "Dashboard", href: "/worker", icon: Home },
    { label: "Job Requests", href: "/worker/jobs", icon: Briefcase, badge: 5 },
    { label: "My Profile", href: "/worker/profile", icon: User },
    { label: "Messages", href: "/worker/messages", icon: MessageSquare, badge: 3 },
    { label: "Settings", href: "/settings", icon: Settings },
];

export const requesterNavItems: NavItem[] = [
    { label: "Dashboard", href: "/requester", icon: Home },
    { label: "My Requests", href: "/requester/requests", icon: Briefcase, badge: 3 },
    { label: "Find Workers", href: "/requester/workers", icon: Users },
    { label: "Messages", href: "/requester/messages", icon: MessageSquare, badge: 2 },
    { label: "Settings", href: "/settings", icon: Settings },
];

export const brokerNavItems: NavItem[] = [
    { label: "Dashboard", href: "/broker", icon: Home },
    { label: "My Requests (Works)", href: "/broker/requests", icon: Briefcase },
    { label: "All Available Jobs", href: "/broker?tab=marketplace", icon: Search },
    { label: "My Workers' Jobs", href: "/broker?tab=workers-jobs", icon: Briefcase },
    { label: "My Workers", href: "/broker?tab=overview", icon: Users },
    { label: "Messages", href: "/broker/messages", icon: MessageSquare },
    { label: "Settings", href: "/settings", icon: Settings },
];
