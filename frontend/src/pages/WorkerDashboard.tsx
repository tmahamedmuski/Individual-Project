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
    MapPinned
} from "lucide-react";
import PasswordChangeForm from "@/components/settings/PasswordChangeForm";
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
    requester: {
        fullName: string;
    }
}

const WorkerDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("overview");
    const [assignedJobs, setAssignedJobs] = useState<ServiceRequest[]>([]);
    const [availableJobs, setAvailableJobs] = useState<ServiceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Fetch jobs assigned to this worker
                const assignedRes = await api.get("/services/my-jobs");
                setAssignedJobs(assignedRes.data);

                // Fetch available jobs (pending requests in the area or general pool)
                // For now, let's assume we have an endpoint for this or reuse something
                const availableRes = await api.get("/services/available");
                setAvailableJobs(availableRes.data);

            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobs();
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
                            <span className="text-[10px] text-muted-foreground leading-none">Worker Portal</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => setActiveTab("overview")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "overview" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}>
                        <Home className="w-5 h-5" />
                        Overview
                    </button>
                    <button onClick={() => setActiveTab("my-jobs")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "my-jobs" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}>
                        <CheckCircle className="w-5 h-5" />
                        My Jobs
                    </button>
                    <button onClick={() => setActiveTab("find-jobs")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "find-jobs" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}>
                        <Briefcase className="w-5 h-5" />
                        Find Jobs
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
                        <h1 className="font-display font-semibold text-lg text-foreground">Worker Dashboard</h1>
                        <p className="text-sm text-muted-foreground">Welcome back, {user?.fullName}!</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">
                            {user?.fullName?.charAt(0) || 'W'}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-auto">
                    {activeTab === "overview" && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-6 rounded-2xl bg-card border border-border">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                            <Briefcase className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-display font-bold text-foreground">{assignedJobs.length}</p>
                                            <p className="text-sm text-muted-foreground">Active Jobs</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 rounded-2xl bg-card border border-border">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                            <CheckCircle className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-display font-bold text-foreground">0</p>
                                            <p className="text-sm text-muted-foreground">Completed This Week</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h2 className="font-display text-xl font-semibold text-foreground">Current Jobs</h2>
                            <div className="space-y-3">
                                {assignedJobs.map((job) => (
                                    <div key={job._id} className="p-4 rounded-xl bg-card border border-border">
                                        <div className="flex justify-between">
                                            <div>
                                                <h4 className="font-bold">{job.serviceType}</h4>
                                                <p className="text-sm text-muted-foreground">{job.description}</p>
                                                <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1"><MapPinned className="w-3 h-3" /> {job.location}</span>
                                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {job.date} {job.time}</span>
                                                </div>
                                            </div>
                                            <div>
                                                {getStatusBadge(job.status)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {assignedJobs.length === 0 && <p className="text-muted-foreground">No active jobs assigned.</p>}
                            </div>
                        </div>
                    )}

                    {activeTab === "my-jobs" && (
                        <div className="space-y-4">
                            <h2 className="font-display text-2xl font-bold text-foreground">My Jobs</h2>
                            {assignedJobs.map((job) => (
                                <div key={job._id} className="p-4 rounded-xl bg-card border border-border">
                                    {/* Job Details Card */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-lg">{job.serviceType}</h4>
                                            <p className="text-muted-foreground">{job.description}</p>
                                            <p className="text-sm mt-1">Requester: {job.requester?.fullName}</p>
                                        </div>
                                        <Button size="sm">Update Status</Button>
                                    </div>
                                </div>
                            ))}
                            {assignedJobs.length === 0 && <p className="text-muted-foreground">No jobs found.</p>}
                        </div>
                    )}

                    {activeTab === "find-jobs" && (
                        <div className="space-y-4">
                            <h2 className="font-display text-2xl font-bold text-foreground">Available Jobs</h2>
                            {availableJobs.map((job) => (
                                <div key={job._id} className="p-4 rounded-xl bg-card border border-border">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold">{job.serviceType}</h4>
                                            <p className="text-sm text-muted-foreground">{job.description}</p>
                                            <p className="text-xs text-muted-foreground mt-1"><MapPinned className="w-3 h-3 inline mr-1" />{job.location}</p>
                                        </div>
                                        <Button size="sm" variant="secondary">Accept Job</Button>
                                    </div>
                                </div>
                            ))}
                            {availableJobs.length === 0 && <p className="text-muted-foreground">No available jobs at the moment.</p>}
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

export default WorkerDashboard;
