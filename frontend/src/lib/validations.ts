
import { z } from "zod";

export const registerSchema = z.object({
    fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(10, { message: "Phone number must be at least 10 characters" }),
    nic: z.string().min(10, { message: "NIC must be valid" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
