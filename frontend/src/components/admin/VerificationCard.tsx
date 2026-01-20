import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PendingUser {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    nic: string;
    createdAt: string;
}

interface VerificationCardProps {
    user: PendingUser;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    onViewDetails: (user: PendingUser) => void;
}

export function VerificationCard({ user, onApprove, onReject, onViewDetails }: VerificationCardProps) {
    return (
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
            {/* Avatar */}
            <Avatar className="w-16 h-16">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`} />
                <AvatarFallback>{user.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>

            {/* Details */}
            <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                    <AvatarFallback className="w-8 h-8 rounded-full bg-muted text-xs flex items-center justify-center">
                        {user.fullName.charAt(0)}
                    </AvatarFallback>
                    <h3 className="text-lg font-bold text-foreground">{user.fullName}</h3>
                </div>

                <p className="text-muted-foreground font-medium flex items-center gap-2">
                    <span className="capitalize">{user.role}</span>
                    <span className="text-border">•</span>
                    <span>NIC: {user.nic}</span>
                </p>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                    <Clock className="w-3 h-3" />
                    <span>Submitted {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
                <Button variant="outline" size="sm" onClick={() => onViewDetails(user)}>
                    View Details
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onReject(user._id)}
                >
                    Reject
                </Button>
                <Button
                    variant="default" // Using default (primary) for Approve
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => onApprove(user._id)}
                >
                    Approve
                </Button>
            </div>
        </div>
    );
}
