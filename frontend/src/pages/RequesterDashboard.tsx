import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    MapPin,
    Home,
    Briefcase,
    User,
    Settings,
    LogOut,
    Bell,
    Clock,
    CheckCircle,
    Calendar,
    MapPinned,
    Star
} from "lucide-react";
import PasswordChangeForm from "@/components/settings/PasswordChangeForm";
import { RequestForm } from "@/components/dashboard/RequestForm";
import api from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";

interface ServiceRequest {
    _id: string;
    serviceType: string;
    description: string;
    location: string;
    date: string;
    time: string;
    status: "pending" | "in_progress" | "completed";
    worker?: {
        fullName: string;
        rating?: number;
    };
}

const RequesterDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("overview");
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get("/services/my");
                setRequests(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">Pending</span>;
            case "in_progress":
                return <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">In Progress</span>;
            case "completed":
                return <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">Completed</span>;
            default:
                return null;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return <Clock className="w-5 h-5 text-amber-500" />;
            case "in_progress":
                return <Clock className="w-5 h-5 text-blue-500" />;
            case "completed":
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            default:
                return null;
        }
    };

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
                            <span className="text-[10px] text-muted-foreground leading-none">Requester Portal</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "overview" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
                    >
                        <Home className="w-5 h-5" />
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("requests")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "requests" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
                    >
                        <Briefcase className="w-5 h-5" />
                        My Requests
                    </button>
                    <button
                        onClick={() => setActiveTab("settings")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "settings" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
                    >
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
                        <h1 className="font-display font-semibold text-lg text-foreground">Dashboard</h1>
                        <p className="text-sm text-muted-foreground">Welcome back, {user?.fullName}!</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">
                            {user?.fullName?.charAt(0) || 'U'}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-auto">
                    {activeTab === "overview" && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="p-6 rounded-2xl gradient-primary text-white">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="font-display text-xl font-bold mb-1">Need help with something?</h3>
                                        <p className="text-white/80">Post a new service request and get matched with workers</p>
                                    </div>
                                    <RequestForm onSuccess={() => window.location.reload()} />
                                </div>
                            </div>

                            <h2 className="font-display text-xl font-semibold text-foreground">Recent Requests</h2>
                            <div className="space-y-3">
                                {requests.slice(0, 3).map((request) => (
                                    <div key={request._id} className="p-4 rounded-xl bg-card border border-border hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                                                    {getStatusIcon(request.status)}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-foreground">{request.serviceType}</h4>
                                                    <p className="text-sm text-muted-foreground">{request.description}</p>
                                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1"><MapPinned className="w-3 h-3" />{request.location}</span>
                                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{request.date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {getStatusBadge(request.status)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {requests.length === 0 && <p className="text-muted-foreground">No requests found.</p>}
                            </div>
                        </div>
                    )}

                    {activeTab === "requests" && (
                        <div className="animate-fade-in">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-display text-2xl font-bold text-foreground">My Service Requests</h2>
                                <RequestForm onSuccess={() => window.location.reload()} />
                            </div>
                            <div className="space-y-4">
                                {requests.map((request) => (
                                    <div key={request._id} className="p-6 rounded-2xl bg-card border border-border">
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-4">
                                                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center">
                                                    {getStatusIcon(request.status)}
                                                </div>
                                                <div>
                                                    <h4 className="font-display font-semibold text-lg text-foreground">{request.serviceType}</h4>
                                                    <p className="text-muted-foreground mb-3">{request.description}</p>
                                                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1"><MapPinned className="w-4 h-4" />{request.location}</span>
                                                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{request.date}</span>
                                                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{request.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {getStatusBadge(request.status)}
                                                {request.worker && (
                                                    <div className="mt-3 flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm">
                                                            {request.worker.fullName.charAt(0)}
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-sm font-medium text-foreground">{request.worker.fullName}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
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

export default RequesterDashboard;
