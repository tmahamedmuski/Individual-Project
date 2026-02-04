import { JobStatus } from "./JobCard";


export interface JobCardProps {
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
    onViewBids?: () => void;
    onRate?: () => void;
    onMessage?: () => void;
    variant?: "requester" | "worker" | "broker";
    className?: string;
}
