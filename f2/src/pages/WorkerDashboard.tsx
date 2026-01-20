import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { JobCard } from "@/components/dashboard/JobCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  CheckCircle,
  Clock,
  DollarSign,
  Home,
  MessageSquare,
  Star,
  TrendingUp,
  User,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/worker", icon: Home },
  { label: "Job Requests", href: "/worker/jobs", icon: Briefcase, badge: 5 },
  { label: "My Profile", href: "/worker/profile", icon: User },
  { label: "Messages", href: "/worker/messages", icon: MessageSquare, badge: 3 },
];

const pendingJobs = [
  {
    id: 1,
    title: "Plumbing Repair",
    description: "Fix leaking pipe in kitchen sink",
    location: "Colombo 07",
    date: "Jan 26, 2026",
    time: "10:00 AM",
    duration: "2 hours",
    status: "pending" as const,
    requester: { name: "ABC Company", rating: 4.9 },
  },
  {
    id: 2,
    title: "Bathroom Installation",
    description: "Install new shower and bathroom fittings",
    location: "Colombo 03",
    date: "Jan 27, 2026",
    time: "08:00 AM",
    duration: "Full day",
    status: "pending" as const,
    requester: { name: "University of Moratuwa", rating: 5.0 },
  },
];

const activeJobs = [
  {
    id: 3,
    title: "Water Heater Repair",
    description: "Service and repair water heater",
    location: "Colombo 05",
    date: "Jan 24, 2026",
    time: "02:00 PM",
    duration: "3 hours",
    status: "in-progress" as const,
    requester: { name: "Sarah Jayasinghe", rating: 4.8 },
  },
];

const recentReviews = [
  { requester: "ABC Company", rating: 5, comment: "Excellent work! Very professional and on time." },
  { requester: "Sarah J.", rating: 4, comment: "Good job, would recommend." },
  { requester: "University", rating: 5, comment: "Quick and efficient service." },
];

export default function WorkerDashboard() {
  return (
    <DashboardLayout
      navItems={navItems}
      role="worker"
      userName="Ajith Bandara"
      userEmail="ajith@gmail.com"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome, Ajith!</h1>
            <p className="text-muted-foreground">
              You have 5 new job requests waiting
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-success text-success-foreground">
              Verified Worker
            </Badge>
            <Badge variant="outline" className="bg-worker/10 text-worker border-worker/20">
              Available
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Pending Requests"
            value={5}
            icon={Clock}
            variant="worker"
          />
          <StatCard
            title="Jobs Completed"
            value={127}
            icon={CheckCircle}
            variant="worker"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Your Rating"
            value="4.8"
            subtitle="127 reviews"
            icon={Star}
            variant="worker"
          />
          <StatCard
            title="This Month"
            value="Rs. 45,000"
            icon={DollarSign}
            variant="worker"
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="pending" className="space-y-4">
              <TabsList>
                <TabsTrigger value="pending">
                  Pending
                  <Badge variant="secondary" className="ml-2">
                    {pendingJobs.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {pendingJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    title={job.title}
                    description={job.description}
                    location={job.location}
                    date={job.date}
                    time={job.time}
                    duration={job.duration}
                    status={job.status}
                    requester={job.requester}
                    variant="worker"
                    onAccept={() => {}}
                    onDecline={() => {}}
                    onView={() => {}}
                  />
                ))}
              </TabsContent>

              <TabsContent value="active" className="space-y-4">
                {activeJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    title={job.title}
                    description={job.description}
                    location={job.location}
                    date={job.date}
                    time={job.time}
                    duration={job.duration}
                    status={job.status}
                    requester={job.requester}
                    variant="worker"
                    onView={() => {}}
                  />
                ))}
              </TabsContent>

              <TabsContent value="completed">
                <div className="text-center py-12 text-muted-foreground">
                  View all 127 completed jobs
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Profile Completion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>85% Complete</span>
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
                <Progress value={85} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Add more skills to attract more clients
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Complete Profile
                </Button>
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="h-4 w-4 text-warning" />
                  Recent Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentReviews.map((review, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{review.requester}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-warning text-warning" />
                        <span className="text-sm">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
