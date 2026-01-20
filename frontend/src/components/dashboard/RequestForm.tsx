import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have this or need to create it
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";
import { Plus } from "lucide-react";

const requestSchema = z.object({
    serviceType: z.string().min(1, "Please select a service type"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    location: z.string().min(3, "Please enter a valid location"),
    date: z.string().min(1, "Please select a date"),
    time: z.string().min(1, "Please select a time"),
});

type RequestFormData = z.infer<typeof requestSchema>;

interface RequestFormProps {
    onSuccess: () => void;
}

export function RequestForm({ onSuccess }: RequestFormProps) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<RequestFormData>({
        resolver: zodResolver(requestSchema),
    });

    const onSubmit = async (data: RequestFormData) => {
        try {
            await api.post("/services", data);
            toast({
                title: "Request Created",
                description: "Your service request has been posted successfully.",
            });
            setOpen(false);
            onSuccess();
        } catch (error) {
            console.error("Error creating request:", error);
            toast({
                title: "Error",
                description: "Failed to create service request. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="accent">
                    <Plus className="w-5 h-5 mr-2" />
                    New Request
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Service Request</DialogTitle>
                    <DialogDescription>
                        Describe what you need help with. Workers will be able to see this request.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="serviceType">Service Type</Label>
                        <Select onValueChange={(value) => setValue("serviceType", value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Plumbing">Plumbing</SelectItem>
                                <SelectItem value="Electrical">Electrical</SelectItem>
                                <SelectItem value="Cleaning">Cleaning</SelectItem>
                                <SelectItem value="Carpentry">Carpentry</SelectItem>
                                <SelectItem value="Painting">Painting</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.serviceType && (
                            <p className="text-sm text-destructive">{errors.serviceType.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Describe the issue in detail..."
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" placeholder="e.g., Colombo 03" {...register("location")} />
                        {errors.location && (
                            <p className="text-sm text-destructive">{errors.location.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" type="date" {...register("date")} />
                            {errors.date && (
                                <p className="text-sm text-destructive">{errors.date.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="time">Time</Label>
                            <Input id="time" type="time" {...register("time")} />
                            {errors.time && (
                                <p className="text-sm text-destructive">{errors.time.message}</p>
                            )}
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Post Request"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
