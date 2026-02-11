
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { JobCard } from "@/components/dashboard/JobCard";
import { BidList } from "@/components/dashboard/BidList";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requesterNavItems, brokerNavItems, adminNavItems } from "@/config/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

import { ReviewModal } from "@/components/ReviewModal";
import { JobDetailsModal } from "@/components/JobDetailsModal";
import { reviewService } from "@/api/reviewService";

export default function MyRequests() {
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [myRequests, setMyRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isBidListOpen, setIsBidListOpen] = useState(false);
    const [selectedJobForBids, setSelectedJobForBids] = useState<{ id: string, title: string } | null>(null);

    // Job Details Modal State
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedJobDetails, setSelectedJobDetails] = useState<any>(null);

    // Review Modal State
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [selectedJobForReview, setSelectedJobForReview] = useState<{ id: string, workerId: string, workerName: string } | null>(null);

    const getNavItems = () => {
        switch (user?.role) {
            case 'broker':
                return brokerNavItems;
            case 'admin':
                return adminNavItems;
            default:
                return requesterNavItems;
        }
    };

    const getCreateRequestPath = () => {
        switch (user?.role) {
            case 'broker':
                return '/broker/create-request';
            case 'admin':
                return '/admin/create-request';
            default:
                return '/requester/create-request';
        }
    };

    const getEditRequestPath = (id: string) => {
        switch (user?.role) {
            case 'broker':
                return `/broker/edit-request/${id}`;
            case 'admin':
                return `/admin/edit-request/${id}`;
            default:
                return `/requester/edit-request/${id}`;
        }
    };

    const getMessagesPath = () => {
        switch (user?.role) {
            case 'broker':
                return '/broker/messages';
            case 'admin':
                return '/requester/messages';
            default:
                return '/requester/messages';
        }
    };

    const handleRateWorker = async (rating: number, comment: string) => {
        if (!selectedJobForReview) return;

        try {
            await reviewService.createReview({
                revieweeId: selectedJobForReview.workerId,
                serviceRequestId: selectedJobForReview.id,
                rating,
                comment
            });

            toast({
                title: "Review Submitted",
                description: "Thank you for your feedback!",
            });
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
        const fetchRequests = async () => {
            try {
                const { data } = await api.get('/services/my');
                const formattedRequests = data.map((req: any) => ({
                    id: req._id,
                    title: req.serviceType,
                    description: req.description,
                    location: req.location,
                    date: req.date,
                    time: req.time,
                    budget: req.budget,
                    duration: "N/A",
                    status: req.status,
                    worker: req.worker ? { id: req.worker._id, name: req.worker.fullName, rating: req.worker.rating || 0 } : undefined,
                }));
                setMyRequests(formattedRequests);
            } catch (error) {
                console.error("Error fetching requests:", error);
                toast({
                    title: "Error",
                    description: "Failed to load your requests.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [toast]);

    return (
        <DashboardLayout
            navItems={getNavItems()}
            role={(user?.role as "broker" | "admin" | "requester" | "worker") || "requester"}
            userName={user?.fullName || "User"}
            userEmail={user?.email || "user@example.com"}
        >
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">My Requests</h1>
                        <p className="text-muted-foreground">
                            View and manage the service requests you have posted.
                        </p>
                    </div>
                    <Button onClick={() => navigate(getCreateRequestPath())}>
                        <Plus className="h-4 w-4 mr-2" />
                        Post New Request
                    </Button>
                </div>

                <div className="flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search your requests..." className="pl-10" />
                    </div>
                </div>

                <Tabs defaultValue="all" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>

                    {["all", "pending", "in-progress", "completed"].map((tab) => (
                        <TabsContent key={tab} value={tab} className="space-y-4">
                            {loading ? (
                                <div className="text-center py-12">Loading...</div>
                            ) : myRequests.filter(r => tab === 'all' || r.status === (tab === 'in-progress' ? 'in_progress' : tab)).length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    No {tab === 'all' ? '' : tab} requests found.
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {myRequests
                                        .filter(r => tab === 'all' || r.status === (tab === 'in-progress' ? 'in_progress' : tab))
                                        .map((job) => (
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
                                                onViewBids={() => {
                                                    setSelectedJobForBids({ id: job.id, title: job.title });
                                                    setIsBidListOpen(true);
                                                }}
                                                onView={() => {
                                                    setSelectedJobDetails(job);
                                                    setIsDetailsOpen(true);
                                                }}
                                                onEdit={() => navigate(getEditRequestPath(job.id))}
                                                onDelete={async () => {
                                                    if (window.confirm("Are you sure you want to delete this request?")) {
                                                        try {
                                                            await api.delete(`/services/${job.id}`);
                                                            setMyRequests(prev => prev.filter(req => req.id !== job.id));
                                                            toast({
                                                                title: "Request Deleted",
                                                                description: "The service request has been deleted.",
                                                            });
                                                        } catch (error) {
                                                            console.error("Error deleting request:", error);
                                                            toast({
                                                                title: "Error",
                                                                description: "Failed to delete request.",
                                                                variant: "destructive",
                                                            });
                                                        }
                                                    }
                                                }}
                                                onComplete={async () => {
                                                    if (window.confirm("Mark this job as completed?")) {
                                                        try {
                                                            await api.put(`/services/${job.id}`, { status: 'completed' });
                                                            setMyRequests(prev => prev.map(req => req.id === job.id ? { ...req, status: 'completed' } : req));
                                                            toast({
                                                                title: "Job Completed",
                                                                description: "The job has been marked as completed.",
                                                            });
                                                        } catch (error) {
                                                            console.error("Error completing request:", error);
                                                            toast({
                                                                title: "Error",
                                                                description: "Failed to update status.",
                                                                variant: "destructive",
                                                            });
                                                        }
                                                    }
                                                }}
                                                onRate={() => {
                                                    if (job.worker) {
                                                        setSelectedJobForReview({
                                                            id: job.id,
                                                            workerId: job.worker.id,
                                                            workerName: job.worker.name
                                                        });
                                                        setIsReviewOpen(true);
                                                    } else {
                                                        toast({
                                                            title: "Info",
                                                            description: "No worker assigned to rate.",
                                                        });
                                                    }
                                                }}
                                                onMessage={() => {
                                                    if (job.worker) {
                                                        navigate(`${getMessagesPath()}?userId=${job.worker.id}&userName=${encodeURIComponent(job.worker.name)}`);
                                                    }
                                                }}
                                            />
                                        ))}
                                </div>
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
            {selectedJobForBids && (
                <BidList
                    isOpen={isBidListOpen}
                    onClose={() => setIsBidListOpen(false)}
                    jobId={selectedJobForBids.id}
                    jobTitle={selectedJobForBids.title}
                    onMessage={(workerId, workerName) => {
                        navigate(`${getMessagesPath()}?userId=${workerId}&userName=${encodeURIComponent(workerName)}`);
                    }}
                    onAcceptBid={async (bidId, workerId, workerName) => {
                        if (window.confirm("Are you sure you want to accept this bid? This will assign the job to the worker.")) {
                            try {
                                await api.put(`/bids/${bidId}/accept`);

                                toast({
                                    title: "Bid Accepted",
                                    description: "The worker has been assigned. You can message them now.",
                                });
                                setIsBidListOpen(false);

                                // Re-fetch requests to update the UI with assigned worker details
                                const { data } = await api.get('/services/my');
                                const formattedRequests = data.map((req: any) => ({
                                    id: req._id,
                                    title: req.serviceType,
                                    description: req.description,
                                    location: req.location,
                                    date: req.date,
                                    time: req.time,
                                    budget: req.budget,
                                    duration: "N/A",
                                    status: req.status,
                                    worker: req.worker ? { id: req.worker._id, name: req.worker.fullName, rating: req.worker.rating || 0 } : undefined,
                                }));
                                setMyRequests(formattedRequests);

                                // Redirect to Messages with the worker so requester can send first message
                                navigate(`${getMessagesPath()}?userId=${workerId}&userName=${encodeURIComponent(workerName)}`);
                            } catch (error: any) {
                                console.error("Error accepting bid:", error);
                                const errorMessage = error.response?.data?.message || "Failed to accept bid.";
                                toast({
                                    title: "Error",
                                    description: errorMessage,
                                    variant: "destructive",
                                });
                            }
                        }
                    }}
                />
            )}

            {selectedJobForReview && (
                <ReviewModal
                    isOpen={isReviewOpen}
                    onClose={() => setIsReviewOpen(false)}
                    onSubmit={handleRateWorker}
                    userName={selectedJobForReview.workerName}
                />
            )}
            {selectedJobDetails && (
                <JobDetailsModal
                    isOpen={isDetailsOpen}
                    onClose={() => setIsDetailsOpen(false)}
                    job={selectedJobDetails}
                    viewerRole="requester"
                />
            )}
        </DashboardLayout>
    );
}
