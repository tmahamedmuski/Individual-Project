import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";
import { ArrowLeft, Loader2, Clock } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<"email" | "otp">("email");
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [otpSent, setOtpSent] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const navigate = useNavigate();
    const { toast } = useToast();

    // Timer effect for OTP expiration
    useEffect(() => {
        if (step === "otp" && otpSent) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [step, otpSent]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.post('/auth/forgot-password', { email });
            
            setStep("otp");
            setOtpSent(true);
            setTimeLeft(600); // Reset to 10 minutes
            toast({
                title: "OTP Sent",
                description: "If an account exists with this email, you will receive a 6-digit OTP. Valid for 10 minutes.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to send OTP.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOTPSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (otp.length !== 6) {
            toast({
                title: "Invalid OTP",
                description: "Please enter a 6-digit OTP.",
                variant: "destructive",
            });
            return;
        }

        if (timeLeft === 0) {
            toast({
                title: "OTP Expired",
                description: "The OTP has expired. Please request a new one.",
                variant: "destructive",
            });
            setStep("email");
            setOtp("");
            setOtpSent(false);
            setTimeLeft(600);
            return;
        }

        setIsLoading(true);

        try {
            const { data } = await api.post('/auth/verify-otp', { email, otp });
            
            // Clear timer
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            
            // Store reset token and navigate to reset password page
            localStorage.setItem('resetToken', data.resetToken);
            navigate('/reset-password');
            
            toast({
                title: "OTP Verified",
                description: "Please enter your new password.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Invalid or expired OTP.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setIsLoading(true);
        setOtp("");
        setTimeLeft(600);
        
        try {
            await api.post('/auth/forgot-password', { email });
            toast({
                title: "OTP Resent",
                description: "A new 6-digit OTP has been sent to your email. Valid for 10 minutes.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to resend OTP.",
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
                    <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
                    <CardDescription className="text-center">
                        {step === "email" 
                            ? "Enter your email address and we'll send you a 6-digit OTP code valid for 10 minutes."
                            : "Enter the 6-digit OTP code sent to your email. The OTP is valid for 10 minutes."
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === "email" ? (
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <input type="text" name="username" autoComplete="username" style={{ display: 'none' }} tabIndex={-1} />
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    autoComplete="email"
                                />
                            </div>
                            <Button className="w-full" type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Send OTP
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleOTPSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="otp">Enter 6-Digit OTP</Label>
                                <div className="flex justify-center">
                                    <InputOTP
                                        maxLength={6}
                                        value={otp}
                                        onChange={(value) => setOtp(value)}
                                        disabled={isLoading || timeLeft === 0}
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className={`font-medium ${timeLeft < 60 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                        {timeLeft > 0 ? `Valid for ${formatTime(timeLeft)}` : 'OTP Expired'}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground text-center">
                                    Check your email ({email}) for the OTP code.
                                </p>
                            </div>
                            <Button 
                                className="w-full" 
                                type="submit" 
                                disabled={isLoading || otp.length !== 6 || timeLeft === 0}
                            >
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {timeLeft === 0 ? "OTP Expired" : "Verify OTP"}
                            </Button>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={handleResendOTP}
                                    disabled={isLoading || timeLeft > 0}
                                >
                                    Resend OTP
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                        setStep("email");
                                        setOtp("");
                                        setOtpSent(false);
                                        setTimeLeft(600);
                                        if (timerRef.current) {
                                            clearInterval(timerRef.current);
                                        }
                                    }}
                                    disabled={isLoading}
                                >
                                    Change Email
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link
                        to="/login"
                        className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ForgotPassword;
