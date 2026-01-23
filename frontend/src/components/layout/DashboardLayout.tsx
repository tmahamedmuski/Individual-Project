import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  Settings,
  User,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

interface DashboardLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  role: "requester" | "worker" | "broker" | "admin";
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

export function DashboardLayout({
  children,
  navItems,
  role,
  userName = "John Doe",
  userEmail = "john@example.com",
  userAvatar,
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const roleColors = {
    requester: "bg-requester",
    worker: "bg-worker",
    broker: "bg-broker",
    admin: "bg-admin",
  };

  const roleLabels = {
    requester: "Service Requester",
    worker: "Service Worker",
    broker: "Broker/Manager",
    admin: "Administrator",
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen bg-sidebar transition-all duration-300 flex flex-col",
          sidebarCollapsed ? "w-20" : "w-64",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-3">
            <div className={cn("rounded-xl p-2", roleColors[role])}>
              <span className="text-white font-bold text-lg">SSP</span>
            </div>
            {!sidebarCollapsed && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-sidebar-foreground text-sm">
                  Smart Service
                </h1>
                <p className="text-xs text-sidebar-foreground/60">Platform</p>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 font-medium text-sm">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="h-5 px-2 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex items-center justify-center p-3 border-t border-sidebar-border text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5 mr-2" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-card border-b border-border px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <Badge variant="outline" className={cn("text-xs", `border-${role}`)}>
                {roleLabels[role]}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userAvatar} />
                    <AvatarFallback className={roleColors[role]}>
                      {userName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-muted-foreground">{userEmail}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/" className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
