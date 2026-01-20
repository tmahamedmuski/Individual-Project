import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Eye, EyeOff, AlertCircle } from "lucide-react";
import { loginSchema, LoginFormData } from "@/lib/validations";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await login(data.email, data.password);

    if (result.success) {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      let targetPath = "/dashboard";
      if (result.role === "admin") targetPath = "/admin";
      else if (result.role === "requester") targetPath = "/requester";
      else if (result.role === "worker") targetPath = "/worker";
      else if (result.role === "broker") targetPath = "/broker";

      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || targetPath;
      navigate(from, { replace: true });
    } else {
      toast({
        title: "Sign in failed",
        description: result.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-primary">SSP</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-up">
          <div className="bg-card rounded-2xl border border-border p-8 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Welcome Back
              </h1>
              <p className="text-muted-foreground">
                Sign in to Smart Service Platform
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email / Phone</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your email or phone"
                  {...register("email")}
                  className={`h-12 ${errors.email ? "border-destructive" : ""}`}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    className={`h-12 pr-12 ${errors.password ? "border-destructive" : ""}`}
                    aria-invalid={errors.password ? "true" : "false"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-8">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
