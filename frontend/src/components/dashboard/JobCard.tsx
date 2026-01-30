import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, Star, Banknote, Phone } from "lucide-react";

export type JobStatus = "pending" | "accepted" | "in-progress" | "in_progress" | "completed" | "cancelled";

interface JobCardProps {
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;

  duration: string;
  budget?: number; // Optional as not all cards might have it yet, or make it required if guaranteed
  status: JobStatus;
  requester?: {
    name: string;
    avatar?: string;
    rating?: number;
    phone?: string;
  };
  worker?: {
    name: string;
    avatar?: string;
    rating?: number;
    phone?: string;
  };
  onAccept?: () => void;
  onDecline?: () => void;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onComplete?: () => void;
  onBid?: () => void;
  onViewBids?: () => void;
  variant?: "requester" | "worker" | "broker";
  className?: string;
}

export function JobCard({
  title,
  description,
  location,
  date,
  time,

  duration,
  budget,
  status,
  requester,
  worker,
  onAccept,
  onDecline,
  onView,
  onEdit,
  onDelete,
  onComplete,
  onBid,
  onViewBids,
  variant = "requester",
  className,
}: JobCardProps) {
  const statusConfig = {
    pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
    accepted: { label: "Accepted", className: "bg-info/10 text-info border-info/20" },
    "in-progress": { label: "In Progress", className: "bg-primary/10 text-primary border-primary/20" },
    "in_progress": { label: "In Progress", className: "bg-primary/10 text-primary border-primary/20" },
    completed: { label: "Completed", className: "bg-success/10 text-success border-success/20" },
    cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive border-destructive/20" },
  };

  const person = variant === "requester" ? worker : requester;

  return (
    <div
      className={cn(
        "bg-card rounded-xl border border-border p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
        <Badge variant="outline" className={statusConfig[status].className}>
          {statusConfig[status].label}
        </Badge>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="truncate">{location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{duration}</span>
        </div>
        {budget && (
          <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
            <Banknote className="h-4 w-4" />
            <span>LKR {budget}</span>
          </div>
        )}
      </div>

      {/* Person info */}
      {person && (
        <div className="flex items-center gap-3 py-3 border-t border-border">
          <Avatar className="h-9 w-9">
            <AvatarImage src={person.avatar} />
            <AvatarFallback>{person.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">{person.name}</p>
            {person.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-warning text-warning" />
                <span className="text-xs text-muted-foreground">{person.rating}</span>
              </div>
            )}
            {person.phone && (
              <div className="flex items-center gap-1 mt-1">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{person.phone}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-border">
        {onView && (
          <Button variant="outline" size="sm" className="flex-1" onClick={onView}>
            View Details
          </Button>
        )}
        {onEdit && (
          <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
            Edit
          </Button>
        )}
        {status === "pending" && onDelete && (
          <Button variant="destructive" size="sm" className="flex-1" onClick={onDelete}>
            Delete
          </Button>
        )}
        {status === "pending" && onAccept && (
          <Button size="sm" className="flex-1 bg-success hover:bg-success/90" onClick={onAccept}>
            Accept
          </Button>
        )}
        {status === "pending" && onDecline && (
          <Button variant="destructive" size="sm" className="flex-1" onClick={onDecline}>
            Decline
          </Button>
        )}
        {(status === "in-progress" || status === "in_progress") && onComplete && (
          <Button size="sm" className="flex-1 bg-success hover:bg-success/90" onClick={onComplete}>
            Mark Completed
          </Button>
        )}
        {status === "pending" && onBid && (
          <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90" onClick={onBid}>
            Place Bid
          </Button>
        )}
        {onViewBids && (
          <Button variant="outline" size="sm" className="flex-1" onClick={onViewBids}>
            View Bids
          </Button>
        )}
      </div>
    </div>
  );
}
