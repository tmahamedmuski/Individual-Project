import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { t } = useLanguage();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await login({ email, password });

            if (result.success) {
                toast({
                    title: t("Welcome back!"),
                    description: t("Login successful."),
                });

                // Role-based redirection
                switch (result.role) {
                    case 'admin':
                        navigate('/admin');
                        break;
                    case 'worker':
                        navigate('/worker');
                        break;
                    case 'broker':
                        navigate('/broker');
                        break;
                    case 'requester':
                        navigate('/requester');
                        break;
                    default:
                        navigate('/');
                }
            } else {
                toast({
                    title: t("Login Failed"),
                    description: result.message || t("Invalid credentials."),
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: t("Error"),
                description: t("An unexpected error occurred."),
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
                    <CardTitle className="text-2xl font-bold font-display text-center">{t("Welcome Back")}</CardTitle>
                    <CardDescription className="text-center">
                        {t("Enter your email to sign in to your account")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" name="username" autoComplete="username" style={{ display: 'none' }} tabIndex={-1} />
                        <div className="space-y-2">
                            <Label htmlFor="email">{t("Email")}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                autoComplete="username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">{t("Password")}</Label>
                            <Input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-sm font-medium text-primary hover:underline bg-background px-1"
                            >
                                {t("Forgot password?")}
                            </Link>
                        </div>
 
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? t("Signing in...") : t("Sign In")}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 text-center">
                    <div className="text-sm text-muted-foreground">
                        {t("Don't have an account?")}{" "}
                        <Link to="/register" className="text-primary hover:underline font-medium">
                            {t("Sign up")}
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div >
    );
};

export default Login;
