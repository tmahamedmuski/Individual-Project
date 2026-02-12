import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { JobCard } from "@/components/dashboard/JobCard";
import { BidDialog } from "@/components/dashboard/BidDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  CheckCircle,
  Clock,
  DollarSign,
  Home,
  MessageSquare,
  Search,
  Settings,
  Star,
  TrendingUp,
  User,
} from "lucide-react";
import { workerNavItems } from "@/config/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ReviewModal } from "@/components/ReviewModal";
import { JobDetailsModal } from "@/components/JobDetailsModal";
import { reviewService } from "@/api/reviewService";

export default function WorkerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [pendingJobs, setPendingJobs] = useState<any[]>([]);
  const [completedJobs, setCompletedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBidDialogOpen, setIsBidDialogOpen] = useState(false);
  const [selectedJobForBid, setSelectedJobForBid] = useState<{ id: string, title: string } | null>(null);

  // Job Details Modal State
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedJobDetails, setSelectedJobDetails] = useState<any>(null);

  // Review Modal State
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedJobForReview, setSelectedJobForReview] = useState<{ id: string, requesterId: string, requesterName: string } | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [myStats, setMyStats] = useState({ rating: 0, reviewCount: 0 });

  const handleRateRequester = async (rating: number, comment: string) => {
    if (!selectedJobForReview) return;

    try {
      await reviewService.createReview({
        revieweeId: selectedJobForReview.requesterId,
        serviceRequestId: selectedJobForReview.id,
        rating,
        comment
      });

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });
      setIsReviewOpen(false); // Close modal on success
    } catch (error: any) {
      console.error("Error submitting review:", error);
      const errorMessage = error.response?.data?.message || "Failed to submit review.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch available jobs (pending)
        const { data: availableData } = await api.get('/services/available');
        const formattedPending = availableData.map((job: any) => ({
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
            id: job.requester?._id,
            name: job.requester?.fullName || "Unknown",
            rating: job.requester?.averageRating || 0,
            phone: job.phoneNumber
          },
        }));
        setPendingJobs(formattedPending);

        // Fetch my jobs (assigned/completed)
        const { data: myData } = await api.get('/services/worker/my');
        const formattedMyJobs = myData.map((job: any) => ({
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
            id: job.requester?._id,
            name: job.requester?.fullName || "Unknown",
            rating: job.requester?.averageRating || 0,
            phone: job.phoneNumber
          },
        }));
        setCompletedJobs(formattedMyJobs);

        // Fetch my reviews
        if (user?._id) {
          try {
            const myReviews = await reviewService.getUserReviews(user._id);
            setReviews(myReviews);
            setMyStats({
              rating: user.averageRating || 0,
              reviewCount: user.reviewCount || 0
            });
          } catch (e) {
            console.error("Error fetching reviews", e);
          }
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast, user]);

  return (
    <DashboardLayout
      navItems={workerNavItems}
      role="worker"
      userName={user?.fullName || "Worker User"}
      userEmail={user?.email || "worker@example.com"}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Worker Dashboard</h1>
            <p className="text-muted-foreground">
              Find jobs and manage your work
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="w-fit">
              <Search className="h-4 w-4 mr-2" />
              Find Work
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Jobs Completed"
            value={completedJobs.filter(j => j.status === 'completed').length}
            icon={Briefcase}
            variant="worker"
          />
          <StatCard
            title="Active Jobs"
            value={completedJobs.filter(j => j.status === 'assigned' || j.status === 'in_progress').length}
            icon={Clock}
            variant="worker"
          />
          <StatCard
            title="Your Rating"
            value={myStats.reviewCount ? `${myStats.rating.toFixed(1)}/5` : "—"}
            subtitle={myStats.reviewCount ? `${myStats.reviewCount} reviews` : "No reviews yet"}
            icon={Star}
            variant="worker"
          />
          <StatCard
            title="Total Earnings"
            value="Rs. 12.5k"
            icon={CheckCircle}
            variant="worker"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="marketplace" className="space-y-4">
              <TabsList>
                <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                <TabsTrigger value="my-jobs">My Jobs</TabsTrigger>
                <TabsTrigger value="reviews">My Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="marketplace">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Available Jobs */}
                  {pendingJobs.map((job) => (
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
                      requester={job.requester}
                      variant="worker"
                      onView={() => {
                        setSelectedJobDetails(job);
                        setIsDetailsOpen(true);
                      }}
                      onBid={() => {
                        setSelectedJobForBid({ id: job.id, title: job.title });
                        setIsBidDialogOpen(true);
                      }}
                    />
                  ))}
                  {pendingJobs.length === 0 && (
                    <p className="text-center col-span-full py-8 text-muted-foreground">No available jobs found.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="my-jobs">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedJobs.length === 0 ? (
                    <p className="text-center col-span-full py-8 text-muted-foreground">No jobs assigned or completed yet.</p>
                  ) : (
                    completedJobs.map((job) => (
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
                        requester={job.requester}
                        variant="worker"
                        onView={() => {
                          setSelectedJobDetails(job);
                          setIsDetailsOpen(true);
                        }}
                        onRate={() => {
                          if (job.requester) {
                            setSelectedJobForReview({
                              id: job.id,
                              requesterId: job.requester.id,
                              requesterName: job.requester.name
                            });
                            setIsReviewOpen(true);
                          }
                        }}
                        onMessage={() => {
                          if (job.requester) {
                            navigate(`/worker/messages?userId=${job.requester.id}&userName=${encodeURIComponent(job.requester.name)}`);
                          }
                        }}
                      />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="space-y-4">
                  {/* Recent Reviews (Full List in Tab) */}
                  {reviews.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No reviews yet.</p>
                  ) : (
                    reviews.map((review, index) => (
                      <div key={index} className="space-y-1 border p-3 rounded-md">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{review.reviewer?.fullName || 'Anonymous'}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-warning text-warning" />
                            <span className="text-sm">{review.rating}/5</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{review.comment}</p>
                      </div>
                    ))
                  )}
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

            {/* Sidebar Recent Reviews Snippet */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="h-4 w-4 text-warning" />
                  Recent Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviews.slice(0, 3).map((review, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{review.reviewer?.fullName || 'Anonymous'}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-warning text-warning" />
                        <span className="text-sm">{review.rating}/5</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{review.comment}</p>
                  </div>
                ))}
                {reviews.length === 0 && <p className="text-sm text-muted-foreground">No reviews yet.</p>}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {selectedJobForBid && (
        <BidDialog
          isOpen={isBidDialogOpen}
          onClose={() => setIsBidDialogOpen(false)}
          jobId={selectedJobForBid.id}
          jobTitle={selectedJobForBid.title}
        />
      )}
      {selectedJobForReview && (
        <ReviewModal
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          onSubmit={handleRateRequester}
          userName={selectedJobForReview.requesterName}
        />
      )}
      {
        selectedJobDetails && (
          <JobDetailsModal
            isOpen={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
            job={selectedJobDetails}
            viewerRole="worker"
          />
        )
      }
    </DashboardLayout >
  );
}
