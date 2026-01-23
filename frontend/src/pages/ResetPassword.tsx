import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";
import { Loader2 } from "lucide-react";

const ResetPassword = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [passwords, setPasswords] = useState({
        password: "",
        confirmPassword: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [resetToken, setResetToken] = useState<string | null>(null);

    useEffect(() => {
        // Get reset token from localStorage (set after OTP verification)
        const token = localStorage.getItem('resetToken');
        if (!token) {
            toast({
                title: "Invalid Access",
                description: "Please start the password reset process from the beginning.",
                variant: "destructive",
            });
            navigate("/forgot-password");
            return;
        }
        setResetToken(token);
    }, [navigate, toast]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!resetToken) {
            toast({
                title: "Error",
                description: "Reset token is missing. Please start over.",
                variant: "destructive",
            });
            navigate("/forgot-password");
            return;
        }

        if (passwords.password !== passwords.confirmPassword) {
            toast({
                title: "Passwords do not match",
                variant: "destructive",
            });
            return;
        }

        if (passwords.password.length < 6) {
            toast({
                title: "Password too short",
                description: "Password must be at least 6 characters.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            await api.post('/auth/reset-password', {
                resetToken,
                newPassword: passwords.password,
                confirmPassword: passwords.confirmPassword,
            });

            // Clear reset token from localStorage
            localStorage.removeItem('resetToken');

            toast({
                title: "Password Reset Successful",
                description: "You can now login with your new password.",
            });
            navigate("/login");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to reset password.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md shadow-lg border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
                    <CardDescription className="text-center">
                        Your OTP has been verified. Please enter your new password below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {resetToken ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" name="username" autoComplete="username" style={{ display: 'none' }} tabIndex={-1} />
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="******"
                                    value={passwords.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    autoComplete="new-password"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="******"
                                    value={passwords.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    autoComplete="new-password"
                                />
                            </div>
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Reset Password
                        </Button>
                    </form>
                    ) : (
                        <div className="text-center">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-4" />
                            <p className="text-muted-foreground">Loading...</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link to="/login" className="text-sm text-primary hover:underline">
                        Back to Login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ResetPassword;
