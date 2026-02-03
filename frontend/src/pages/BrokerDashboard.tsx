
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Briefcase,
  CheckCircle,
  Clock,
  Eye,
  MoreVertical,
  Plus,
  Search,
  Star,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { brokerNavItems } from "@/config/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { JobCard } from "@/components/dashboard/JobCard";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";



const pendingApplications = [
  {
    id: 1,
    worker: "Sunil Perera",
    job: "Kitchen Plumbing",
    requester: "ABC Company",
    date: "Jan 26, 2026",
    status: "pending",
  },
  {
    id: 2,
    worker: "Nishantha Silva",
    job: "Furniture Repair",
    requester: "Hotel Grand",
    date: "Jan 27, 2026",
    status: "accepted",
  },
];

export default function BrokerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [managedWorkers, setManagedWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Managed Workers
  useEffect(() => {
    const fetchManagedUsers = async () => {
      try {
        const { data } = await api.get('/auth/managed-users');
        const formattedWorkers = data.map((worker: any) => ({
          id: worker._id,
          name: worker.fullName,
          skills: worker.skills || [],
          status: worker.accountStatus,
          activeJobs: 0, // Placeholder
          rating: 0, // Placeholder or fetch if available
          earnings: "Rs. 0", // Placeholder
        }));
        setManagedWorkers(formattedWorkers);
      } catch (error) {
        console.error("Error fetching managed users:", error);
      }
    };
    fetchManagedUsers();
  }, []);

  // Fetch data for "My Requests" (Requester View)
  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const { data } = await api.get('/services/my');
        const formattedRequests = data.map((req: any) => ({
          id: req._id,
          title: req.serviceType,
          description: req.description,
          location: req.location,
          date: req.date,
          time: req.time,
          duration: "N/A",
          budget: req.budget,
          status: req.status,
          worker: req.worker ? { name: req.worker.fullName, rating: req.worker.rating || 0 } : undefined,
        }));
        setMyRequests(formattedRequests);
      } catch (error) {
        console.error("Error fetching my requests:", error);
      }
    };

    fetchMyRequests();
  }, []);

  // Fetch data for "Marketplace" (Worker View - Available Jobs)
  useEffect(() => {
    const fetchAvailableJobs = async () => {
      try {
        const { data } = await api.get('/services/available');
        const formattedJobs = data.map((job: any) => ({
          id: job._id,
          title: job.serviceType,
          description: job.description,
          location: job.location,
          date: job.date,
          time: job.time,
          duration: "N/A",
          budget: job.budget,
          status: job.status,
          requester: {
            name: job.requester?.fullName || "Unknown",
            rating: 0,
            phone: job.phoneNumber
          },
        }));
        setAvailableJobs(formattedJobs);
      } catch (error) {
        console.error("Error fetching available jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableJobs();
  }, []);

  return (
    <DashboardLayout
      navItems={brokerNavItems}
      role="broker"
      userName={user?.fullName || "Broker User"}
      userEmail={user?.email || "broker@example.com"}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Broker Dashboard</h1>
            <p className="text-muted-foreground">
              Manage workers, post requests, and find work
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="w-fit" variant="outline" onClick={() => navigate('/broker/create-request')}>
              <Plus className="h-4 w-4 mr-2" />
              Post Request
            </Button>

          </div>
        </div>

        {/* Stats Row - Mixed Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Managed Workers"
            value={managedWorkers.length}
            icon={Users}
            variant="broker"
          />
          <StatCard
            title="Active Requests"
            value={myRequests.filter(r => r.status === 'pending' || r.status === 'in_progress').length}
            icon={Clock}
            variant="requester"
          />
          <StatCard
            title="Market Opps"
            value={availableJobs.length}
            icon={Briefcase}
            variant="worker"
          />
          <StatCard
            title="Total Earnings"
            value="Rs. 150k"
            icon={CheckCircle}
            variant="broker"
          />
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requests">My Requests</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Workers Table (Existing Broker View) */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Managed Workers</CardTitle>
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search workers..." className="pl-10 h-9" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Worker</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Active Jobs</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Earnings</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {managedWorkers.map((worker) => (
                          <TableRow key={worker.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                  <AvatarFallback className="bg-broker/10 text-broker">
                                    {worker.name.slice(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{worker.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {worker.skills.join(", ")}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  worker.status === "verified"
                                    ? "bg-success/10 text-success border-success/20"
                                    : "bg-warning/10 text-warning border-warning/20"
                                }
                              >
                                {worker.status === "verified" ? "Verified" : "Pending"}
                              </Badge>
                            </TableCell>
                            <TableCell>{worker.activeJobs}</TableCell>
                            <TableCell>
                              {worker.rating > 0 ? (
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-warning text-warning" />
                                  {worker.rating}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell>{worker.earnings}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Apply for Job
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Applications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pendingApplications.map((app) => (
                    <div key={app.id} className="p-3 rounded-lg bg-muted/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{app.job}</span>
                        <Badge
                          variant="outline"
                          className={
                            app.status === "accepted"
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-warning/10 text-warning border-warning/20"
                          }
                        >
                          {app.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Worker: {app.worker}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Client: {app.requester}
                      </p>
                      <p className="text-xs text-muted-foreground">{app.date}</p>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full">
                    View All Applications
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">My Service Requests</h2>
              <Button onClick={() => navigate('/broker/create-request')}>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myRequests.length === 0 ? (
                <p className="text-muted-foreground col-span-full text-center py-8">
                  No requests posted yet.
                </p>
              ) : (
                myRequests.map((job) => (
                  <JobCard
                    key={job.id}
                    title={job.title}
                    description={job.description}
                    location={job.location}
                    date={job.date}
                    time={job.time}
                    duration={job.duration}
                    budget={job.budget}
                    status={job.status}
                    worker={job.worker}
                    variant="requester"
                    onView={() => { }}
                    onEdit={() => navigate(`/broker/edit-request/${job.id}`)}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Marketplace (Available Jobs)</h2>
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableJobs.length === 0 ? (
                <p className="text-muted-foreground col-span-full text-center py-8">
                  No jobs available at the moment.
                </p>
              ) : (
                availableJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    title={job.title}
                    description={job.description}
                    location={job.location}
                    date={job.date}
                    time={job.time}
                    duration={job.duration}
                    budget={job.budget} // JobCard might need budget prop update if not there
                    status={job.status}
                    requester={job.requester}
                    variant="worker"
                    onView={() => { }}
                    onBid={() => {
                      // Logic to bid on behalf of a worker?
                      // For now, simpler implementation
                      toast({ description: "Bidding functionality coming soon" })
                    }}
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </DashboardLayout>
  );
}
