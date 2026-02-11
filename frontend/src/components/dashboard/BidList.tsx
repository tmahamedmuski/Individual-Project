
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Phone, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface Bid {
    _id: string;
    worker: {
        _id: string;
        fullName: string;
        email: string;
        phone: string;
        rating?: number;
        avatar?: string;
    };
    amount: number;
    createdAt: string;
    status: 'pending' | 'accepted' | 'rejected';
}

interface BidListProps {
    isOpen: boolean;
    onClose: () => void;
    jobId: string;
    jobTitle: string;
    onAcceptBid?: (bidId: string, workerId: string, workerName: string) => void;
    onMessage?: (workerId: string, workerName: string) => void;
}

export function BidList({ isOpen, onClose, jobId, jobTitle, onAcceptBid, onMessage }: BidListProps) {
    const [bids, setBids] = useState<Bid[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && jobId) {
            const fetchBids = async () => {
                setLoading(true);
                try {
                    const { data } = await api.get(`/bids/${jobId}`);
                    setBids(data);
                } catch (error) {
                    console.error("Error fetching bids:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchBids();
        }
    }, [isOpen, jobId]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Bids for "{jobTitle}"</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading bids...</div>
                ) : bids.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No bids received yet.</div>
                ) : (
                    <div className="space-y-4 py-4">
                        {bids.map((bid) => (
                            <div key={bid._id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={bid.worker.avatar} />
                                        <AvatarFallback>{bid.worker.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="font-semibold">{bid.worker.fullName}</h4>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Star className="h-3 w-3 fill-warning text-warning" />
                                                <span>{bid.worker.rating || "N/A"}</span>
                                            </div>
                                            <span>•</span>
                                            <div className="flex items-center gap-1">
                                                <Phone className="h-3 w-3" />
                                                <span>{bid.worker.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                    <div className="flex flex-col items-end gap-2">
                                    <div className="text-lg font-bold text-green-600">
                                        Rs. {bid.amount}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(bid.createdAt).toLocaleDateString()}
                                        </span>
                                        {onMessage && (
                                            <Button size="sm" variant="outline" onClick={() => { onClose(); onMessage(bid.worker._id, bid.worker.fullName); }}>
                                                <MessageSquare className="h-3 w-3 mr-1" />
                                                Message
                                            </Button>
                                        )}
                                        {onAcceptBid && bid.status === 'pending' && (
                                            <Button size="sm" onClick={() => onAcceptBid(bid._id, bid.worker._id, bid.worker.fullName)}>
                                                Accept
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
