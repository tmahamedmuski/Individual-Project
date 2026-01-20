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
  Plus,
  Search,
  Bell,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  ChevronRight,
  Calendar,
  MapPinned
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

interface Worker {
  _id: string;
  fullName: string;
  role: string; // skill is not in User model, we might need to assume role=worker or add skill field later
  rating?: number; // User model doesn't have rating yet, defaulting
  location?: {
    address?: string;
  };
}

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requestsRes, workersRes] = await Promise.all([
          api.get("/services/my"),
          api.get("/services/workers")
        ]);
        setRequests(requestsRes.data);
        setWorkers(workersRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
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
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg leading-none text-primary">
                Smart Service
              </span>
              <span className="text-[10px] text-muted-foreground leading-none">
                Platform
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "overview" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
              }`}
          >
            <Home className="w-5 h-5" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "requests" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
              }`}
          >
            <Briefcase className="w-5 h-5" />
            My Requests
          </button>
          <button
            onClick={() => setActiveTab("workers")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "workers" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
              }`}
          >
            <Search className="w-5 h-5" />
            Find Workers
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "profile" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
              }`}
          >
            <User className="w-5 h-5" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "settings" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
              }`}
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
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <div>
            <h1 className="font-display font-semibold text-lg text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {user?.fullName || "User"} <span className="capitalize">({user?.role || "Guest"})</span>!</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-secondary transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </button>
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">
              U
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fade-in">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-display font-bold text-foreground">1</p>
                      <p className="text-sm text-muted-foreground">Pending Requests</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-display font-bold text-foreground">1</p>
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
                      <p className="text-2xl font-display font-bold text-foreground">1</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Action */}
              <div className="p-6 rounded-2xl gradient-primary text-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl font-bold mb-1">Need help with something?</h3>
                    <p className="text-white/80">Post a new service request and get matched with workers</p>
                  </div>
                  <RequestForm onSuccess={() => window.location.reload()} />
                </div>
              </div>

              {/* Recent Requests */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-semibold text-foreground">Recent Requests</h2>
                  <Button variant="ghost" size="sm">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {requests.map((request) => (
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
                              <span className="flex items-center gap-1">
                                <MapPinned className="w-3 h-3" />
                                {request.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {request.date}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(request.status)}
                          {request.worker && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {request.worker.fullName}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nearby Workers */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-semibold text-foreground">Nearby Workers</h2>
                  <Button variant="ghost" size="sm">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {workers.map((worker) => (
                    <div key={worker._id} className="p-4 rounded-xl bg-card border border-border hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">
                          {worker.fullName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground flex items-center gap-1">
                            {worker.fullName}
                          </h4>
                          <p className="text-sm text-muted-foreground">Service Provider</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPinned className="w-4 h-4" />
                          Nearby
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-accent fill-accent" />
                          <span className="font-medium text-foreground">5.0</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                            <span className="flex items-center gap-1">
                              <MapPinned className="w-4 h-4" />
                              {request.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {request.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {request.time}
                            </span>
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
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-accent fill-accent" />
                                <span className="text-xs text-muted-foreground">5.0</span>
                              </div>
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

          {activeTab === "workers" && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">Find Workers</h2>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search by skill, name, or location..."
                      className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-border bg-card focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <Button variant="default" size="lg">
                    Search
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workers.map((worker) => (
                  <div key={worker._id} className="p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-white text-xl font-bold">
                        {worker.fullName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-lg text-foreground flex items-center gap-1">
                          {worker.fullName}
                        </h4>
                        <p className="text-muted-foreground">Service Provider</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPinned className="w-4 h-4" />
                        Nearby
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span className="font-medium text-foreground">5.0</span>
                        <span className="text-muted-foreground">(New)</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      View Profile
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="animate-fade-in">
              <div className="max-w-2xl mx-auto text-center py-12">
                <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  U
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  Your Profile
                </h2>
                <p className="text-muted-foreground">
                  This section will be available after connecting to the backend.
                </p>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground">Settings</h2>
                <p className="text-muted-foreground">Manage your account settings and preferences</p>
              </div>

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

export default Dashboard;
