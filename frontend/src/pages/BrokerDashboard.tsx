import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    MapPin,
    Home,
    Users,
    Settings,
    LogOut,
    Briefcase
} from "lucide-react";
import PasswordChangeForm from "@/components/settings/PasswordChangeForm";
import { useAuth } from "@/contexts/AuthContext";

const BrokerDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
                <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-display font-bold text-lg leading-none text-primary">Smart Service</span>
                            <span className="text-[10px] text-muted-foreground leading-none">Broker Portal</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => setActiveTab("overview")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "overview" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}>
                        <Home className="w-5 h-5" />
                        Overview
                    </button>
                    <button onClick={() => setActiveTab("workers")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "workers" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}>
                        <Users className="w-5 h-5" />
                        Manage Workers
                    </button>
                    <button onClick={() => setActiveTab("requests")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "requests" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}>
                        <Briefcase className="w-5 h-5" />
                        All Requests
                    </button>
                    <button onClick={() => setActiveTab("settings")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "settings" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}>
                        <Settings className="w-5 h-5" />
                        Settings
                    </button>
                </nav>

                <div className="p-4 border-t border-border">
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground" asChild>
                        <Link to="/">
                            <LogOut className="w-5 h-5 mr-3" />
                            Sign Out
                        </Link>
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
                    <div>
                        <h1 className="font-display font-semibold text-lg text-foreground">Broker Dashboard</h1>
                        <p className="text-sm text-muted-foreground">Welcome back, {user?.fullName}!</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">
                            {user?.fullName?.charAt(0) || 'B'}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-auto">
                    {activeTab === "overview" && (
                        <div className="space-y-6">
                            <div className="p-6 rounded-2xl bg-card border border-border">
                                <h2 className="text-xl font-bold mb-2">Broker Overview</h2>
                                <p className="text-muted-foreground">Manage your fleet of workers and view all service requests here.</p>
                            </div>
                        </div>
                    )}
                    {activeTab === "workers" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold">Manage Workers</h2>
                            <p className="text-muted-foreground">List of workers under your management will appear here.</p>
                        </div>
                    )}
                    {activeTab === "requests" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold">All Requests</h2>
                            <p className="text-muted-foreground">Marketplace of requests will appear here.</p>
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <div className="animate-fade-in">
                            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Settings</h2>
                            <div className="bg-card border border-border rounded-2xl p-6">
                                <PasswordChangeForm />
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default BrokerDashboard;
