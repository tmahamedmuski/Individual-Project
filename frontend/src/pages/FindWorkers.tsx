import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { WorkerCard } from "@/components/dashboard/WorkerCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    MapPin,
    Search,
    Users,
    AlertTriangle,
    Settings,
} from "lucide-react";
import { requesterNavItems } from "@/config/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function FindWorkers() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { toast } = useToast();

    const initialNearMe = searchParams.get('view') !== 'all';
    const [isNearMe, setIsNearMe] = useState(initialNearMe);
    const [workers, setWorkers] = useState<any[]>([]);
    const [workerGroups, setWorkerGroups] = useState<{ [key: string]: any[] }>({});
    const [loading, setLoading] = useState(true);

    // Fetch workers
    useEffect(() => {
        const fetchWorkers = async () => {
            setLoading(true);
            try {
                let url = `/services/workers`;
                if (isNearMe && user?.location?.coordinates) {
                    const [lng, lat] = user.location.coordinates;
                    url += `?lat=${lat}&lng=${lng}&maxDistance=50`;
                }

                const { data } = await api.get(url);
                setWorkers(data);

                // Group by distance
                const groups: { [key: string]: any[] } = {
                    "Within 1km": [],
                    "Within 2km": [],
                    "Within 5km": [],
                    "Within 10km": [],
                    "Other Available Workers": []
                };

                data.forEach((worker: any) => {
                    if (worker.distance) {
                        const distKm = worker.distance / 1000;
                        if (distKm <= 1) groups["Within 1km"].push(worker);
                        else if (distKm <= 2) groups["Within 2km"].push(worker);
                        else if (distKm <= 5) groups["Within 5km"].push(worker);
                        else if (distKm <= 10) groups["Within 10km"].push(worker);
                        else groups["Other Available Workers"].push(worker);
                    } else {
                        groups["Other Available Workers"].push(worker);
                    }
                });

                // Filter out empty groups
                const activeGroups = Object.keys(groups).reduce((acc: any, key) => {
                    if (groups[key].length > 0) acc[key] = groups[key];
                    return acc;
                }, {});

                setWorkerGroups(activeGroups);
            } catch (error) {
                console.error("Error fetching workers:", error);
                toast({
                    title: "Error",
                    description: "Failed to load workers.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchWorkers();
    }, [user, isNearMe, toast]);

    const toggleView = (nearMe: boolean) => {
        setIsNearMe(nearMe);
        setSearchParams({ view: nearMe ? 'nearby' : 'all' });
    };

    return (
        <DashboardLayout
            navItems={requesterNavItems}
            role="requester"
            userName={user?.fullName || "User"}
            userEmail={user?.email || ""}
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Users className="h-6 w-6 text-primary" />
                            Find Workers
                        </h1>
                        <p className="text-muted-foreground">
                            Search and connect with skilled workers in your area
                        </p>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search workers by skill..." className="pl-10" />
                    </div>
                    <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border">
                        <Button
                            variant={isNearMe ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => toggleView(true)}
                            className="gap-2"
                        >
                            <MapPin className="h-4 w-4" />
                            Near Me
                        </Button>
                        <Button
                            variant={!isNearMe ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => toggleView(false)}
                            className="gap-2"
                        >
                            <Search className="h-4 w-4" />
                            All Workers
                        </Button>
                    </div>
                </div>

                {/* Worker Groups */}
                <div className="space-y-8">
                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-[200px] rounded-xl bg-muted animate-pulse" />
                            ))}
                        </div>
                    ) : Object.keys(workerGroups).length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-2xl bg-muted/5">
                            <MapPin className="h-16 w-16 mx-auto mb-6 opacity-20 text-primary" />
                            <h3 className="text-xl font-semibold text-foreground mb-2">No Nearby Workers Found</h3>
                            <p className="max-w-md mx-auto mb-8">
                                {isNearMe
                                    ? "We couldn't find any workers near your current location. Try increasing the search radius or checking 'All Workers'."
                                    : "No workers match your search criteria. Try a different skill or keyword."}
                            </p>
                            {isNearMe && !user?.location?.coordinates && (
                                <div className="space-y-4">
                                    <p className="text-sm font-medium text-warning flex items-center justify-center gap-2">
                                        <AlertTriangle className="h-4 w-4" />
                                        Your location is not set
                                    </p>
                                    <Button onClick={() => navigate('/profile')} className="gap-2">
                                        <Settings className="h-4 w-4" />
                                        Add Address in Profile
                                    </Button>
                                </div>
                            )}
                            <div className="flex justify-center gap-4 mt-4">
                                <Button variant="outline" onClick={() => toggleView(false)}>
                                    View All Workers
                                </Button>
                            </div>
                        </div>
                    ) : (
                        Object.entries(workerGroups).map(([groupName, groupWorkers]) => (
                            <div key={groupName} className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-bold">{groupName}</h2>
                                    <div className="h-px flex-1 bg-border" />
                                    <Badge variant="secondary">{groupWorkers.length} available</Badge>
                                </div>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {groupWorkers.map((worker) => (
                                        <WorkerCard
                                            key={worker._id}
                                            name={worker.fullName}
                                            skills={worker.skills || []}
                                            rating={worker.averageRating || 0}
                                            reviewCount={worker.reviewCount || 0}
                                            location={worker.location?.address || "Unknown"}
                                            isVerified={worker.accountStatus === 'approved'}
                                            isAvailable={true}
                                            distance={worker.distance ? `${(worker.distance / 1000).toFixed(1)} km` : undefined}
                                            onViewProfile={() => navigate(`/worker-profile/${worker._id}`)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
