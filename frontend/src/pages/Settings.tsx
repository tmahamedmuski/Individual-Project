
import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Monitor, Trash2, Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axios";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { adminNavItems, workerNavItems, requesterNavItems, brokerNavItems } from "@/config/navigation";
import { getImageUrl } from "@/lib/imageUtils";

const Settings = () => {
    const { setTheme, theme } = useTheme();
    const { toast } = useToast();
    const { user, logout } = useAuth();

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [workingPhotos, setWorkingPhotos] = useState<string[]>([]);
    const [gpLetters, setGpLetters] = useState<string[]>([]);
    const [deletionReason, setDeletionReason] = useState("");
    const [requestingDeletion, setRequestingDeletion] = useState(false);

    const getNavItems = () => {
        switch (user?.role) {
            case 'admin': return adminNavItems;
            case 'worker': return workerNavItems;
            case 'broker': return brokerNavItems;
            case 'requester': return requesterNavItems;
            default: return requesterNavItems;
        }
    };

    useEffect(() => {
        if (user?.role === 'worker') {
            fetchUserDocuments();
        }
    }, [user]);

    const fetchUserDocuments = async () => {
        try {
            const { data } = await api.get('/auth/me');
            setWorkingPhotos(data.workingPhotos || []);
            setGpLetters(data.gpLetters || []);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    const handleWorkingPhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            const formData = new FormData();
            Array.from(files).forEach(file => {
                formData.append('photos', file);
            });

            await api.post('/admin/worker/working-photos', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast({
                title: "Success",
                description: "Working photos uploaded successfully",
            });
            fetchUserDocuments();
            e.target.value = ''; // Reset input
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to upload photos",
                variant: "destructive"
            });
        } finally {
            setUploading(false);
        }
    };

    const handleGPLettersUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            const formData = new FormData();
            Array.from(files).forEach(file => {
                formData.append('letters', file);
            });

            await api.post('/admin/worker/gp-letters', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast({
                title: "Success",
                description: "GP letters uploaded successfully",
            });
            fetchUserDocuments();
            e.target.value = ''; // Reset input
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to upload GP letters",
                variant: "destructive"
            });
        } finally {
            setUploading(false);
        }
    };

    const deleteWorkingPhoto = async (photoPath: string) => {
        try {
            // Extract filename from both full URL and path formats
            let filename = photoPath;
            if (photoPath.includes('/')) {
                filename = photoPath.split('/').pop() || '';
            }
            // Remove any query parameters if present
            filename = filename.split('?')[0];
            
            await api.delete(`/admin/worker/working-photos/${encodeURIComponent(filename)}`);
            toast({
                title: "Success",
                description: "Photo deleted successfully",
            });
            fetchUserDocuments();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to delete photo",
                variant: "destructive"
            });
        }
    };

    const deleteGPLetter = async (letterPath: string) => {
        try {
            // Extract filename from both full URL and path formats
            let filename = letterPath;
            if (letterPath.includes('/')) {
                filename = letterPath.split('/').pop() || '';
            }
            // Remove any query parameters if present
            filename = filename.split('?')[0];
            
            await api.delete(`/admin/worker/gp-letters/${encodeURIComponent(filename)}`);
            toast({
                title: "Success",
                description: "GP letter deleted successfully",
            });
            fetchUserDocuments();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to delete GP letter",
                variant: "destructive"
            });
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const onUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast({
                title: "Error",
                description: "New passwords do not match",
                variant: "destructive"
            });
            return;
        }

        if (passwords.newPassword.length < 6) {
            toast({
                title: "Error",
                description: "Password must be at least 6 characters long",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);
        try {
            await axios.put('/auth/password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            toast({
                title: "Success",
                description: "Password updated successfully",
                duration: 5000,
            });
            setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update password",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const onRequestAccountDeletion = async () => {
        if (!deletionReason.trim()) {
            toast({
                title: "Error",
                description: "Please provide a reason for account deletion",
                variant: "destructive"
            });
            return;
        }

        setRequestingDeletion(true);
        try {
            await axios.post('/auth/request-deletion', { reason: deletionReason });
            toast({
                title: "Deletion Request Submitted",
                description: "Your account deletion request has been submitted. Admin will review your request.",
                duration: 5000,
            });
            setDeletionReason("");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to submit deletion request",
                variant: "destructive"
            });
        } finally {
            setRequestingDeletion(false);
        }
    };

    if (!user) return null; // Should be handled by protected route, but safe guard

    return (
        <DashboardLayout
            navItems={getNavItems()}
            role={user.role as any || 'requester'}
            userName={user.fullName}
            userEmail={user.email}
        >
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Settings</h1>

                <Tabs defaultValue="appearance" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="appearance">Appearance</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                        {user?.role === 'worker' && <TabsTrigger value="documents">Documents</TabsTrigger>}
                        <TabsTrigger value="danger">Danger Zone</TabsTrigger>
                    </TabsList>

                    <TabsContent value="appearance">
                        <Card>
                            <CardHeader>
                                <CardTitle>Appearance</CardTitle>
                                <CardDescription>
                                    Customize the look and feel of the application.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between border p-4 rounded-lg">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Theme Mode</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Select your preferred theme.
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2 bg-secondary p-1 rounded-md">
                                        <Button
                                            variant={theme === 'light' ? 'default' : 'ghost'}
                                            size="sm"
                                            onClick={() => setTheme("light")}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Sun className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant={theme === 'dark' ? 'default' : 'ghost'}
                                            size="sm"
                                            onClick={() => setTheme("dark")}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Moon className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant={theme === 'system' ? 'default' : 'ghost'}
                                            size="sm"
                                            onClick={() => setTheme("system")}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Monitor className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="security">
                        <Card>
                            <CardHeader>
                                <CardTitle>Change Password</CardTitle>
                                <CardDescription>
                                    Update your password to keep your account secure.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={onUpdatePassword} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">Current Password</Label>
                                        <Input
                                            id="currentPassword"
                                            name="currentPassword"
                                            type="password"
                                            autoComplete="current-password"
                                            value={passwords.currentPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <Input
                                            id="newPassword"
                                            name="newPassword"
                                            type="password"
                                            autoComplete="new-password"
                                            value={passwords.newPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            autoComplete="new-password"
                                            value={passwords.confirmPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <Button type="submit" disabled={loading}  className="bg-blue-600 text-white hover:bg-blue-900">
                                        {loading ? "Updating..." : "Update Password"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {user?.role === 'worker' && (
                        <TabsContent value="documents">
                            <div className="space-y-6">
                                {/* Working Photos */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Working Photos</CardTitle>
                                        <CardDescription>
                                            Upload photos of your completed work to showcase your skills and experience.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="working-photos">Upload Working Photos</Label>
                                            <Input
                                                id="working-photos"
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleWorkingPhotosUpload}
                                                disabled={uploading}
                                                className="cursor-pointer"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                You can upload multiple images (Max 10MB each)
                                            </p>
                                        </div>
                                        {workingPhotos.length > 0 && (
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                                {workingPhotos.map((photo, idx) => (
                                                    <div key={idx} className="relative border rounded-md p-2">
                                                        <img
                                                            src={getImageUrl(photo)}
                                                            alt={`Working Photo ${idx + 1}`}
                                                            className="w-full h-32 object-cover rounded-md"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = '/placeholder-image.png';
                                                            }}
                                                        />
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            className="absolute top-2 right-2 h-6 w-6 p-0"
                                                            onClick={() => deleteWorkingPhoto(photo)}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* GP Letters */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>GP Letters</CardTitle>
                                        <CardDescription>
                                            Upload GP (General Practitioner) letters or medical certificates as proof of health status.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="gp-letters">Upload GP Letters</Label>
                                            <Input
                                                id="gp-letters"
                                                type="file"
                                                accept="image/*,application/pdf"
                                                multiple
                                                onChange={handleGPLettersUpload}
                                                disabled={uploading}
                                                className="cursor-pointer"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                You can upload images or PDF files (Max 10MB each)
                                            </p>
                                        </div>
                                        {gpLetters.length > 0 && (
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                                {gpLetters.map((letter, idx) => {
                                                    // Check if file is PDF by checking filename
                                                    const filename = letter.split('/').pop() || '';
                                                    const isPDF = filename.toLowerCase().endsWith('.pdf');
                                                    
                                                    return (
                                                        <div key={idx} className="relative border rounded-md p-2">
                                                            {isPDF ? (
                                                                <div className="w-full h-32 flex items-center justify-center bg-muted rounded-md">
                                                                    <FileText className="h-8 w-8 text-muted-foreground" />
                                                                    <a
                                                                        href={getImageUrl(letter)}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="ml-2 text-sm text-primary hover:underline"
                                                                    >
                                                                        View PDF
                                                                    </a>
                                                                </div>
                                                            ) : (
                                                                <img
                                                                    src={getImageUrl(letter)}
                                                                    alt={`GP Letter ${idx + 1}`}
                                                                    className="w-full h-32 object-cover rounded-md"
                                                                    onError={(e) => {
                                                                        (e.target as HTMLImageElement).src = '/placeholder-image.png';
                                                                    }}
                                                                />
                                                            )}
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                className="absolute top-2 right-2 h-6 w-6 p-0"
                                                                onClick={() => deleteGPLetter(letter)}
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    )}

                    <TabsContent value="danger">
                        <Card className="border-destructive/50">
                            <CardHeader>
                                <CardTitle className="text-destructive">Request Account Deletion</CardTitle>
                                <CardDescription>
                                    Submit a request to permanently remove your account and all of its data. Admin will review your request before deletion.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="deletion-reason">Reason for Deletion (Required)</Label>
                                    <Textarea
                                        id="deletion-reason"
                                        placeholder="Please provide a reason for account deletion..."
                                        value={deletionReason}
                                        onChange={(e) => setDeletionReason(e.target.value)}
                                        disabled={requestingDeletion}
                                        required
                                        rows={4}
                                    />
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" disabled={requestingDeletion || !deletionReason.trim()}>
                                            <Trash2 className="mr-2 h-4 w-4" /> 
                                            {requestingDeletion ? "Submitting..." : "Request Account Deletion"}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Submit Account Deletion Request?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Your account deletion request will be sent to the admin for review. Once approved, your account and all data will be permanently deleted. This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={onRequestAccountDeletion} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                Yes, submit request
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
