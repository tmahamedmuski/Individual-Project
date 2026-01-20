import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { JobCard } from "@/components/dashboard/JobCard";
import { WorkerCard } from "@/components/dashboard/WorkerCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  CheckCircle,
  Clock,
  Home,
  MapPin,
  MessageSquare,
  Plus,
  Search,
  Star,
  Users,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/requester", icon: Home },
  { label: "My Requests", href: "/requester/requests", icon: Briefcase, badge: 3 },
  { label: "Find Workers", href: "/requester/workers", icon: Users },
  { label: "Messages", href: "/requester/messages", icon: MessageSquare, badge: 2 },
  { label: "Settings", href: "/settings", icon: Settings },
];

const mockJobs = [
  {
    id: 1,
    title: "Plumbing Repair",
    description: "Need to fix a leaking pipe in the bathroom",
    location: "Colombo 07",
    date: "Jan 25, 2026",
    time: "09:00 AM",
    duration: "2-3 hours",
    status: "pending" as const,
    worker: { name: "Ajith Bandara", rating: 4.8 },
  },
  {
    id: 2,
    title: "Electrical Work",
    description: "Install new ceiling fans in 3 rooms",
    location: "Colombo 03",
    date: "Jan 24, 2026",
    time: "02:00 PM",
    duration: "4 hours",
    status: "in-progress" as const,
    worker: { name: "Kumara Silva", rating: 4.9 },
  },
  {
    id: 3,
    title: "Garden Maintenance",
    description: "Monthly lawn mowing and hedge trimming",
    location: "Colombo 05",
    date: "Jan 20, 2026",
    time: "07:00 AM",
    duration: "3 hours",
    status: "completed" as const,
    worker: { name: "Nimal Perera", rating: 4.7 },
  },
];

const mockWorkers = [
  {
    id: 1,
    name: "Ajith Bandara",
    skills: ["Plumbing", "Pipe Fitting", "Water Heater"],
    rating: 4.8,
    reviewCount: 127,
    location: "Colombo 07",
    isVerified: true,
    isAvailable: true,
    distance: "2.3 km",
  },
  {
    id: 2,
    name: "Kumara Silva",
    skills: ["Electrical", "Wiring", "AC Repair"],
    rating: 4.9,
    reviewCount: 89,
    location: "Colombo 03",
    isVerified: true,
    isAvailable: true,
    distance: "1.8 km",
  },
  {
    id: 3,
    name: "Nimal Perera",
    skills: ["Gardening", "Landscaping", "Tree Trimming"],
    rating: 4.7,
    reviewCount: 56,
    location: "Colombo 05",
    isVerified: true,
    isAvailable: false,
    distance: "3.1 km",
  },
];

export default function RequesterDashboard() {
  return (
    <DashboardLayout
      navItems={navItems}
      role="requester"
      userName="Sarah Jayasinghe"
      userEmail="sarah@university.lk"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, Sarah!</h1>
            <p className="text-muted-foreground">
              Manage your service requests and find workers
            </p>
          </div>
          <Button className="w-fit">
            <Plus className="h-4 w-4 mr-2" />
            Post New Request
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Requests"
            value={5}
            icon={Clock}
            variant="requester"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Completed Jobs"
            value={23}
            icon={CheckCircle}
            variant="requester"
          />
          <StatCard
            title="Workers Hired"
            value={18}
            icon={Users}
            variant="requester"
          />
          <StatCard
            title="Avg. Rating Given"
            value="4.6"
            icon={Star}
            variant="requester"
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="requests" className="space-y-4">
          <TabsList>
            <TabsTrigger value="requests">My Requests</TabsTrigger>
            <TabsTrigger value="workers">Nearby Workers</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search requests..." className="pl-10" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockJobs.map((job) => (
                <JobCard
                  key={job.id}
                  title={job.title}
                  description={job.description}
                  location={job.location}
                  date={job.date}
                  time={job.time}
                  duration={job.duration}
                  status={job.status}
                  worker={job.worker}
                  variant="requester"
                  onView={() => { }}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="workers" className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search workers by skill..." className="pl-10" />
              </div>
              <Button variant="outline">
                <MapPin className="h-4 w-4 mr-2" />
                Near Me
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockWorkers.map((worker) => (
                <WorkerCard
                  key={worker.id}
                  name={worker.name}
                  skills={worker.skills}
                  rating={worker.rating}
                  reviewCount={worker.reviewCount}
                  location={worker.location}
                  isVerified={worker.isVerified}
                  isAvailable={worker.isAvailable}
                  distance={worker.distance}
                  onViewProfile={() => { }}
                  onSelect={() => { }}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
