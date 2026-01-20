import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, AlertCircle, CheckCircle, Lock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePasswordSchema, ChangePasswordFormData } from "@/lib/validations";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const PasswordChangeForm = () => {
  const { updatePassword, isLoading } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const passwordStrength = useMemo(() => {
    if (!newPassword) return { score: 0, label: "Enter password", color: "bg-muted", width: "0%" };
    
    let score = 0;
    if (newPassword.length >= 12) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[a-z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;

    const levels = [
      { label: "Very weak", color: "bg-destructive", width: "20%" },
      { label: "Weak", color: "bg-orange-500", width: "40%" },
      { label: "Fair", color: "bg-amber-500", width: "60%" },
      { label: "Strong", color: "bg-green-500", width: "80%" },
      { label: "Very strong", color: "bg-green-600", width: "100%" },
    ];

    return { score, ...levels[Math.min(score, 4)] };
  }, [newPassword]);

  const onSubmit = async (data: ChangePasswordFormData) => {
    const success = await updatePassword(data.currentPassword, data.newPassword);
    if (success) {
      toast.success("Password updated successfully!");
      reset();
    } else {
      toast.error("Failed to update password. Please check your current password.");
    }
  };

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold text-foreground">Change Password</h3>
          <p className="text-sm text-muted-foreground">Update your password to keep your account secure</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Current Password */}
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Enter your current password"
              {...register("currentPassword")}
              className={`h-12 pl-10 pr-12 ${errors.currentPassword ? "border-destructive" : ""}`}
              aria-invalid={errors.currentPassword ? "true" : "false"}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showCurrentPassword ? "Hide password" : "Show password"}
            >
              {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter your new password"
              {...register("newPassword")}
              className={`h-12 pl-10 pr-12 ${errors.newPassword ? "border-destructive" : ""}`}
              aria-invalid={errors.newPassword ? "true" : "false"}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {newPassword && (
            <div className="space-y-1">
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${passwordStrength.color} transition-all duration-300`}
                  style={{ width: passwordStrength.width }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Password strength: <span className="font-medium">{passwordStrength.label}</span>
              </p>
            </div>
          )}
          {errors.newPassword && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.newPassword.message}
            </p>
          )}
          
          {/* Password Requirements */}
          <div className="p-3 rounded-lg bg-secondary/50 border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">Password requirements:</p>
            <ul className="space-y-1 text-xs">
              {[
                { met: newPassword?.length >= 12, text: "At least 12 characters" },
                { met: /[A-Z]/.test(newPassword || ""), text: "One uppercase letter" },
                { met: /[a-z]/.test(newPassword || ""), text: "One lowercase letter" },
                { met: /[0-9]/.test(newPassword || ""), text: "One number" },
                { met: /[^A-Za-z0-9]/.test(newPassword || ""), text: "One special character" },
              ].map((req, idx) => (
                <li key={idx} className={`flex items-center gap-2 ${req.met ? "text-green-600" : "text-muted-foreground"}`}>
                  <CheckCircle className={`w-3.5 h-3.5 ${req.met ? "opacity-100" : "opacity-30"}`} />
                  {req.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="confirmNewPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your new password"
              {...register("confirmNewPassword")}
              className={`h-12 pl-10 pr-12 ${errors.confirmNewPassword ? "border-destructive" : ""}`}
              aria-invalid={errors.confirmNewPassword ? "true" : "false"}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmNewPassword && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.confirmNewPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full h-12" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              Updating Password...
            </>
          ) : (
            "Update Password"
          )}
        </Button>
      </form>
    </div>
  );
};

export default PasswordChangeForm;
