import { LayoutDashboard, UserCheck, ShieldAlert, Users, Star, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

interface SidebarButtonProps {
    active: boolean;
    onClick: () => void;
    icon: any;
    children: React.ReactNode;
}

function SidebarButton({ active, onClick, icon: Icon, children }: SidebarButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
        >
            <Icon className="w-5 h-5" />
            {children}
        </button>
    );
}

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
    return (
        <div className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
            <div className="p-6 border-b border-border">
                <h1 className="font-display font-bold text-xl text-primary">Admin Panel</h1>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <SidebarButton
                    active={activeTab === 'verification'}
                    onClick={() => onTabChange('verification')}
                    icon={UserCheck}
                >
                    Verification
                </SidebarButton>
                <SidebarButton
                    active={activeTab === 'users'}
                    onClick={() => onTabChange('users')}
                    icon={Users}
                >
                    All Users
                </SidebarButton>
                <SidebarButton
                    active={activeTab === 'reviews'}
                    onClick={() => onTabChange('reviews')}
                    icon={Star}
                >
                    Reviews
                </SidebarButton>
                <SidebarButton
                    active={activeTab === 'overview'}
                    onClick={() => onTabChange('overview')}
                    icon={LayoutDashboard}
                >
                    Overview
                </SidebarButton>
                <SidebarButton
                    active={activeTab === 'disputes'}
                    onClick={() => onTabChange('disputes')}
                    icon={ShieldAlert}
                >
                    Disputes
                </SidebarButton>
            </nav>

            <div className="p-4 border-t border-border">
                <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" asChild>
                    <Link to="/">
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign Out
                    </Link>
                </Button>
            </div>
        </div>
    );
}
