
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { requesterNavItems, brokerNavItems, adminNavItems } from "@/config/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";
import { Loader2 } from "lucide-react";
import { MapPicker } from "@/components/ui/MapPicker";

interface Location {
    lat: number;
    lng: number;
    address?: string;
}

export default function CreateRequest() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        serviceType: "",
        description: "",
        location: "",
        date: "",
        time: "",
        phoneNumber: user?.phone || "",
        budget: "",
    });

    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({ ...prev, serviceType: value }));
    };

    const handleLocationSelect = (loc: Location) => {
        setSelectedLocation(loc);
        setFormData((prev) => ({
            ...prev,
            location: loc.address || `${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!formData.serviceType || !formData.description || !formData.location || !formData.date || !formData.time || !formData.phoneNumber || !formData.budget) {
            toast({
                title: "Missing Fields",
                description: "Please fill in all fields.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        try {
            await api.post("/services", {
                ...formData,
                // include raw coordinates for backend if needed
                latitude: selectedLocation?.lat,
                longitude: selectedLocation?.lng,
            });
            toast({
                title: "Request Posted",
                description: "Your service request has been successfully posted.",
            });
            if (user?.role === 'broker') {
                navigate("/broker/requests");
            } else {
                navigate("/requester");
            }
        } catch (error: any) {
            console.error("Error posting request:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to post request. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

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

    const getDashboardPath = () => {
        switch (user?.role) {
            case 'broker':
                return '/broker';
            case 'worker':
                return '/worker';
            case 'admin':
                return '/admin';
            default:
                return '/requester';
        }
    };

    return (
        <DashboardLayout
            navItems={getNavItems()}
            role={(user?.role as "broker" | "admin" | "requester" | "worker") || "requester"}
            userName={user?.fullName || "User"}
            userEmail={user?.email || "user@example.com"}
        >
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Post New Request</h1>
                    <p className="text-muted-foreground">
                        Fill in the details below to find a worker for your task.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Service Details</CardTitle>
                        <CardDescription>
                            Provide clear information to get the best matches.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="serviceType">Service Type</Label>
                                <Select onValueChange={handleSelectChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a service type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Plumbing">Plumbing</SelectItem>
                                        <SelectItem value="Electrical">Electrical</SelectItem>
                                        <SelectItem value="Cleaning">Cleaning</SelectItem>
                                        <SelectItem value="Gardening">Gardening</SelectItem>
                                        <SelectItem value="Carpentry">Carpentry</SelectItem>
                                        <SelectItem value="Painting">Painting</SelectItem>
                                        <SelectItem value="Moving">Moving</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Describe the issue or task in detail..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                {/* Read-only address filled from map pin */}
                                <Input
                                    id="location"
                                    name="location"
                                    placeholder="Pin your location on the map below"
                                    value={formData.location}
                                    onChange={handleChange}
                                    readOnly
                                />
                                <div className="mt-3">
                                    <MapPicker onLocationSelect={handleLocationSelect} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    placeholder="e.g., 0771234567"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="budget">Budget (LKR)</Label>
                                <Input
                                    id="budget"
                                    name="budget"
                                    type="number"
                                    placeholder="e.g., 5000"
                                    value={formData.budget}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input
                                        id="date"
                                        name="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split("T")[0]}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="time">Time</Label>
                                    <Input
                                        id="time"
                                        name="time"
                                        type="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate(getDashboardPath())}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Posting...
                                        </>
                                    ) : (
                                        "Post Request"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
