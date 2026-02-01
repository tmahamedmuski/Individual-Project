
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

export default function EditRequest() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const [formData, setFormData] = useState({
        serviceType: "",
        description: "",
        location: "",
        date: "",
        time: "",
        phoneNumber: "",
        budget: "",
        status: "",
    });

    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

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

    const getRequestsPath = () => {
        switch (user?.role) {
            case 'broker':
                return '/broker/requests';
            case 'admin':
                return '/admin/requests';
            default:
                return '/requester/requests';
        }
    };

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const { data } = await api.get(`/services/${id}`);
                setFormData({
                    serviceType: data.serviceType,
                    description: data.description,
                    location: data.location,
                    date: data.date,
                    time: data.time,
                    phoneNumber: data.phoneNumber || "",
                    budget: data.budget || "",
                    status: data.status,
                });
            } catch (error) {
                console.error("Error fetching request:", error);
                toast({
                    title: "Error",
                    description: "Failed to load request details.",
                    variant: "destructive",
                });
                navigate(getRequestsPath());
            } finally {
                setIsFetching(false);
            }
        };

        if (id) {
            fetchRequest();
        }
    }, [id, navigate, toast]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({ ...prev, serviceType: value }));
    };

    const handleStatusChange = (value: string) => {
        setFormData((prev) => ({ ...prev, status: value }));
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
            await api.put(`/services/${id}`, {
                ...formData,
                latitude: selectedLocation?.lat,
                longitude: selectedLocation?.lng,
            });
            toast({
                title: "Request Updated",
                description: "Your service request has been successfully updated.",
            });
            navigate(getRequestsPath());
        } catch (error: any) {
            console.error("Error updating request:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update request. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <DashboardLayout
                navItems={getNavItems()}
                role={(user?.role as "broker" | "admin" | "requester" | "worker") || "requester"}
                userName={user?.fullName || "User"}
                userEmail={user?.email || "user@example.com"}
            >
                <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout
            navItems={getNavItems()}
            role={(user?.role as "broker" | "admin" | "requester" | "worker") || "requester"}
            userName={user?.fullName || "User"}
            userEmail={user?.email || "user@example.com"}
        >
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Edit Request</h1>
                    <p className="text-muted-foreground">
                        Update the details of your service request.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Service Details</CardTitle>
                        <CardDescription>
                            Make necessary changes to your request.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="serviceType">Service Type</Label>
                                <Select onValueChange={handleSelectChange} value={formData.serviceType}>
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
                                <Input
                                    id="location"
                                    name="location"
                                    placeholder="e.g., 123 Main St, Colombo 03"
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

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select onValueChange={handleStatusChange} value={formData.status}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="pt-4 flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate(getRequestsPath())}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Request"
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
