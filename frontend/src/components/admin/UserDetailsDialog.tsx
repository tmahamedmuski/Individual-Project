import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, CreditCard, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    nic: string;
    phone: string;
    accountStatus: string;
    isApproved: boolean;
    createdAt: string;
    location?: {
        address?: string;
    };
}

interface UserDetailsDialogProps {
    user: User | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

export function UserDetailsDialog({ user, open, onOpenChange, onApprove, onReject }: UserDetailsDialogProps) {
    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>User Details</DialogTitle>
                    <DialogDescription>
                        Review user information before approval.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Header with Avatar */}
                    <div className="flex items-center gap-4">
                        <Avatar className="w-20 h-20">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`} />
                            <AvatarFallback>{user.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-xl font-bold">{user.fullName}</h3>
                            <Badge variant="outline" className="capitalize mt-1">{user.role}</Badge>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center gap-3 text-sm">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{user.phone || "No phone provided"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                            <span className="font-mono">{user.nic || "No NIC provided"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="line-clamp-1" title={user.location?.address}>{user.location?.address || "No location provided"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>Registered on {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            onReject(user._id);
                            onOpenChange(false);
                        }}
                    >
                        Reject
                    </Button>
                    <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                            onApprove(user._id);
                            onOpenChange(false);
                        }}
                    >
                        Approve
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
