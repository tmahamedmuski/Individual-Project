import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Eye, EyeOff, ArrowLeft, UserCircle, Wrench, Users, Shield, AlertCircle } from "lucide-react";
import { registerSchema, RegisterFormData } from "@/lib/validations";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { MapPicker } from "@/components/ui/MapPicker";

type Role = "requester" | "worker" | "broker" | "admin";

const roles = [
  {
    id: "requester" as Role,
    icon: UserCircle,
    title: "Service Requester",
    description: "I need to find workers for my tasks",
    color: "bg-blue-500"
  },
  {
    id: "worker" as Role,
    icon: Wrench,
    title: "Service Provider",
    description: "I want to offer my services",
    color: "bg-green-500"
  },
  {
    id: "broker" as Role,
    icon: Users,
    title: "Broker / Manager",
    description: "I manage workers and help them find jobs",
    color: "bg-purple-500"
  },
  {
    id: "admin" as Role,
    icon: Shield,
    title: "Administrator",
    description: "Platform administration and verification",
    color: "bg-amber-500"
  }
];

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<"role" | "form">("role");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | undefined>(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setStep("form");
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (!selectedRole) {
      toast({
        title: "Error",
        description: "Please select a role first.",
        variant: "destructive",
      });
      return;
    }

    // For worker and broker roles, location is required
    if ((selectedRole === "worker" || selectedRole === "broker") && !location) {
      toast({
        title: "Location Required",
        description: "Please select your location on the map.",
        variant: "destructive",
      });
      return;
    }

    const success = await registerUser({
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      phone: data.phone,
      nic: data.nic,
      location: location,
      role: selectedRole,
    });

    if (success) {
      toast({
        title: "Registration successful!",
        description: "Your account has been created. Please wait for admin approval before logging in.",
      });

      // Navigate to login page
      navigate("/login", { replace: true });
    } else {
      toast({
        title: "Registration failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Password strength indicator
  const getPasswordStrength = (pwd: string): { label: string; color: string; width: string } => {
    if (!pwd) return { label: "", color: "bg-muted", width: "0%" };

    let strength = 0;
    if (pwd.length >= 12) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    const levels = [
      { label: "Very weak", color: "bg-red-500", width: "20%" },
      { label: "Weak", color: "bg-orange-500", width: "40%" },
      { label: "Fair", color: "bg-yellow-500", width: "60%" },
      { label: "Good", color: "bg-lime-500", width: "80%" },
      { label: "Strong", color: "bg-green-500", width: "100%" },
    ];

    return levels[Math.min(strength - 1, 4)] || levels[0];
  };

  const passwordStrength = getPasswordStrength(password || "");

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
        <div className="w-full max-w-lg animate-fade-up">
          {step === "role" ? (
            /* Role Selection */
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                  Create Account
                </h1>
                <p className="text-muted-foreground">
                  Choose how you want to use Smart Service Platform
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className="group p-6 rounded-2xl bg-card border-2 border-border hover:border-primary hover:shadow-lg transition-all text-left"
                  >
                    <div className={`w-12 h-12 rounded-xl ${role.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <role.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-display font-semibold text-foreground mb-1">
                      {role.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {role.description}
                    </p>
                  </button>
                ))}
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          ) : (
            /* Registration Form */
            <div className="bg-card rounded-2xl border border-border p-8 shadow-xl">
              <button
                onClick={() => setStep("role")}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to role selection
              </button>

              <div className="mb-6">
                <h1 className="font-display text-2xl font-bold text-foreground mb-1">
                  Register as {roles.find(r => r.id === selectedRole)?.title}
                </h1>
                <p className="text-muted-foreground text-sm">
                  Fill in your details to get started
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    {...register("fullName")}
                    className={`h-12 ${errors.fullName ? "border-destructive" : ""}`}
                    aria-invalid={errors.fullName ? "true" : "false"}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
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
                  <Label htmlFor="nic">National Identity Card (NIC)</Label>
                  <Input
                    id="nic"
                    type="text"
                    placeholder="Enter your NIC number"
                    {...register("nic")}
                    className={`h-12 ${errors.nic ? "border-destructive" : ""}`}
                    aria-invalid={errors.nic ? "true" : "false"}
                  />
                  {errors.nic && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.nic.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+94 XX XXX XXXX"
                    {...register("phone")}
                    className={`h-12 ${errors.phone ? "border-destructive" : ""}`}
                    aria-invalid={errors.phone ? "true" : "false"}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <MapPicker onLocationSelect={setLocation} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
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
                  {password && (
                    <div className="space-y-1">
                      <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{ width: passwordStrength.width }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Password strength: {passwordStrength.label}
                      </p>
                    </div>
                  )}
                  {errors.password && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    {...register("confirmPassword")}
                    className={`h-12 ${errors.confirmPassword ? "border-destructive" : ""}`}
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.confirmPassword.message}
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
                  {isSubmitting || isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Register;
