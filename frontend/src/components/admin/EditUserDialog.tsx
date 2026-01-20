import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";

interface User {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    nic: string;
    phone: string;
}

interface EditUserDialogProps {
    user: User | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUserUpdated: () => void;
}

export function EditUserDialog({ user, open, onOpenChange, onUserUpdated }: EditUserDialogProps) {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        role: "",
        nic: "",
        phone: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || "",
                email: user.email || "",
                role: user.role || "requester",
                nic: user.nic || "",
                phone: user.phone || ""
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (value: string) => {
        setFormData(prev => ({ ...prev, role: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.put(`/admin/users/${user?._id}`, formData);
            toast({
                title: "User Updated",
                description: "User details have been successfully updated.",
            });
            onUserUpdated();
            onOpenChange(false);
        } catch (error: any) {
            console.error("Error updating user:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update user.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select onValueChange={handleRoleChange} defaultValue={formData.role}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="requester">Requester</SelectItem>
                                <SelectItem value="worker">Worker</SelectItem>
                                <SelectItem value="broker">Broker</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nic">NIC</Label>
                        <Input id="nic" name="nic" value={formData.nic} onChange={handleChange} />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
