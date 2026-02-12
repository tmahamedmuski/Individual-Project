import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, Clock, Star, Phone, Banknote, User } from "lucide-react";
import { useEffect, useState } from "react";
import { reviewService } from "@/api/reviewService";

interface JobDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: any;
    viewerRole: "worker" | "requester" | "broker";
}

export function JobDetailsModal({
    isOpen,
    onClose,
    job,
    viewerRole
}: JobDetailsModalProps) {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(false);

    // Identify the "other person" to show reviews for
    const otherPerson = viewerRole === "worker" ? job.requester : job.worker;
    const personId = otherPerson?.id || otherPerson?._id;

    useEffect(() => {
        if (isOpen && personId) {
            const fetchReviews = async () => {
                setLoadingReviews(true);
                try {
                    const data = await reviewService.getUserReviews(personId);
                    setReviews(data);
                } catch (error) {
                    console.error("Failed to fetch reviews", error);
                } finally {
                    setLoadingReviews(false);
                }
            };
            fetchReviews();
        } else {
            setReviews([]);
        }
    }, [isOpen, personId]);

    if (!job) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{job.title}</DialogTitle>
                    <DialogDescription>
                        Details and feedback
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-6">
                        {/* Job Status & Description */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <Badge variant="outline" className="capitalize">
                                    {job.status.replace('_', ' ')}
                                </Badge>
                                {job.budget && (
                                    <div className="flex items-center gap-1 text-green-600 font-semibold">
                                        <Banknote className="h-4 w-4" />
                                        <span>LKR {job.budget}</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">{job.description}</p>
                        </div>

                        {/* Job Metadata */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{job.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{job.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{job.duration || "N/A"}</span>
                            </div>
                        </div>

                        <Separator />

                        {/* Counterpart Profile */}
                        {otherPerson && (
                            <div className="space-y-4">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    About the {viewerRole === "worker" ? "Requester" : "Worker"}
                                </h4>
                                <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-lg">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={otherPerson.avatar} />
                                        <AvatarFallback>{otherPerson.name?.slice(0, 2).toUpperCase() || "??"}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-medium">{otherPerson.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex items-center text-xs text-muted-foreground">
                                                <Star className="h-3 w-3 fill-warning text-warning mr-1" />
                                                {otherPerson.rating ? Number(otherPerson.rating).toFixed(1) : "New"}
                                            </div>
                                            {otherPerson.phone && (
                                                <div className="flex items-center text-xs text-muted-foreground">
                                                    <Phone className="h-3 w-3 mr-1" />
                                                    {otherPerson.phone}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Reviews List */}
                                <div className="space-y-3">
                                    <h5 className="text-sm font-medium">Recent Reviews</h5>
                                    {loadingReviews ? (
                                        <p className="text-sm text-muted-foreground">Loading reviews...</p>
                                    ) : reviews.length > 0 ? (
                                        <div className="space-y-3">
                                            {reviews.slice(0, 5).map((review) => (
                                                <div key={review._id} className="border p-3 rounded-md text-sm">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="font-medium">{review.reviewer?.fullName || "Anonymous"}</span>
                                                        <div className="flex items-center gap-1">
                                                            <Star className="h-3 w-3 fill-warning text-warning" />
                                                            <span className="font-bold">{review.rating}/5</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-muted-foreground text-xs">{review.comment}</p>
                                                    <span className="text-[10px] text-muted-foreground mt-2 block">
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">No reviews yet.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
