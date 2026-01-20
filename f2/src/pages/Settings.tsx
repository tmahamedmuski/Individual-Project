
import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Monitor, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
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

const Settings = () => {
    const { setTheme, theme } = useTheme();
    const { toast } = useToast();
    const { logout } = useAuth(); // Assuming auth context exposes token or user details? 
    // Wait, axios instance handles token. Logout clears local state.
    const navigate = useNavigate();

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);

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

        setLoading(true);
        try {
            await axios.put('/auth/password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            toast({
                title: "Success",
                description: "Password updated successfully",
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

    const onDeleteAccount = async () => {
        try {
            await axios.delete('/auth/delete');
            toast({
                title: "Account Deleted",
                description: "Your account has been permanently deleted.",
            });
            logout(); // Log out in frontend
            navigate('/login');
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to delete account",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            <Tabs defaultValue="appearance" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
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
                                        value={passwords.currentPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        value={passwords.newPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={passwords.confirmPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Updating..." : "Update Password"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="danger">
                    <Card className="border-destructive/50">
                        <CardHeader>
                            <CardTitle className="text-destructive">Delete Account</CardTitle>
                            <CardDescription>
                                Permanently remove your account and all of its data from our servers. This action is not reversible.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive">
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete My Account
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={onDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                            Yes, delete my account
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Settings;
