import { z } from "zod";

// Password validation requirements
const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

// Email validation
const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .max(254, "Email is too long");

// Phone validation (flexible for international formats)
const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
    "Please enter a valid phone number"
  )
  .min(7, "Phone number is too short")
  .max(20, "Phone number is too long");

// Full name validation
const nameSchema = z
  .string()
  .min(1, "Full name is required")
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name is too long")
  .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens and apostrophes");

// Login form schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email or phone is required")
    .max(254, "Input is too long"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Registration form schema
export const registerSchema = z
  .object({
    fullName: nameSchema,
    email: emailSchema,
    nic: z.string().min(10, "NIC must be at least 10 characters").max(12, "NIC must be at most 12 characters"),
    phone: phoneSchema,
    location: z.object({
      lat: z.number(),
      lng: z.number(),
      address: z.string().optional(),
    }).optional(),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// Password reset/change schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// Utility to sanitize string input (prevent XSS)
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}
