import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, MapPin, Star } from "lucide-react";

interface WorkerCardProps {
  name: string;
  avatar?: string;
  skills: string[];
  rating: number;
  reviewCount: number;
  location: string;
  isVerified: boolean;
  isAvailable: boolean;
  distance?: string;
  onSelect?: () => void;
  onViewProfile?: () => void;
  className?: string;
}

export function WorkerCard({
  name,
  avatar,
  skills,
  rating,
  reviewCount,
  location,
  isVerified,
  isAvailable,
  distance,
  onSelect,
  onViewProfile,
  className,
}: WorkerCardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-xl border border-border p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <Avatar className="h-14 w-14">
            <AvatarImage src={avatar} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {isAvailable && (
            <span className="absolute -bottom-1 -right-1 h-4 w-4 bg-success rounded-full border-2 border-card" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg truncate">{name}</h3>
            {isVerified && (
              <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({reviewCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {skills.slice(0, 3).map((skill) => (
          <Badge key={skill} variant="secondary" className="font-normal">
            {skill}
          </Badge>
        ))}
        {skills.length > 3 && (
          <Badge variant="outline" className="font-normal">
            +{skills.length - 3} more
          </Badge>
        )}
      </div>

      {/* Location */}
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
        {distance && <span>{distance} away</span>}
      </div>

      {/* Availability */}
      <div className="mb-4">
        <Badge
          variant="outline"
          className={cn(
            isAvailable
              ? "bg-success/10 text-success border-success/20"
              : "bg-muted text-muted-foreground"
          )}
        >
          {isAvailable ? "Available Now" : "Unavailable"}
        </Badge>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {onViewProfile && (
          <Button variant="outline" size="sm" className="flex-1" onClick={onViewProfile}>
            View Profile
          </Button>
        )}
        {onSelect && isAvailable && (
          <Button size="sm" className="flex-1" onClick={onSelect}>
            Select Worker
          </Button>
        )}
      </div>
    </div>
  );
}
