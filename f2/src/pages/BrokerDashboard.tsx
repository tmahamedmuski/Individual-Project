import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Home,
  MessageSquare,
  MoreVertical,
  Plus,
  Search,
  Star,
  UserPlus,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Dashboard", href: "/broker", icon: Home },
  { label: "My Workers", href: "/broker/workers", icon: Users },
  { label: "Job Applications", href: "/broker/jobs", icon: Briefcase, badge: 8 },
  { label: "Messages", href: "/broker/messages", icon: MessageSquare },
];

const managedWorkers = [
  {
    id: 1,
    name: "Sunil Perera",
    skills: ["Plumbing", "Pipe Fitting"],
    status: "verified",
    activeJobs: 2,
    rating: 4.7,
    earnings: "Rs. 32,000",
  },
  {
    id: 2,
    name: "Kamal Fernando",
    skills: ["Electrical", "Wiring"],
    status: "pending",
    activeJobs: 0,
    rating: 0,
    earnings: "Rs. 0",
  },
  {
    id: 3,
    name: "Nishantha Silva",
    skills: ["Carpentry", "Woodwork"],
    status: "verified",
    activeJobs: 1,
    rating: 4.9,
    earnings: "Rs. 48,000",
  },
  {
    id: 4,
    name: "Ruwan Jayasena",
    skills: ["Painting", "Wall Work"],
    status: "verified",
    activeJobs: 3,
    rating: 4.5,
    earnings: "Rs. 25,000",
  },
];

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
  return (
    <DashboardLayout
      navItems={navItems}
      role="broker"
      userName="Anura Kumara"
      userEmail="anura.broker@gmail.com"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Broker Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your workers and their job applications
            </p>
          </div>
          <Button className="w-fit bg-broker hover:bg-broker/90">
            <UserPlus className="h-4 w-4 mr-2" />
            Add New Worker
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Managed Workers"
            value={12}
            icon={Users}
            variant="broker"
          />
          <StatCard
            title="Pending Verification"
            value={3}
            icon={Clock}
            variant="broker"
          />
          <StatCard
            title="Active Jobs"
            value={8}
            icon={Briefcase}
            variant="broker"
          />
          <StatCard
            title="Total Placements"
            value={156}
            icon={CheckCircle}
            variant="broker"
            trend={{ value: 12, isPositive: true }}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Workers Table */}
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
      </div>
    </DashboardLayout>
  );
}
