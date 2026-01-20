import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Note: This is a placeholder auth context. 
// Real authentication requires Lovable Cloud backend with proper JWT tokens.
// DO NOT use this in production without implementing server-side authentication.

import api from "@/lib/axios";

type Role = "requester" | "worker" | "broker" | "admin" | null;


interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; role?: string }>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  nic: string;
  phone: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  role: Role;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        try {
          const { data } = await api.get("/auth/me");
          // Backend returns _id, map to id if needed, or just use data if interface matches
          // Our User interface expects id, backend has _id. 
          setUser({ ...data, id: data._id });
        } catch (error) {
          console.error("Session verification failed:", error);
          localStorage.removeItem("auth_token");
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });

      const userWithId = { ...data, id: data._id };
      setUser(userWithId);
      localStorage.setItem("auth_token", data.token);

      return { success: true };
    } catch (error: any) {
      console.error("Login error:", error);
      const message = error.response?.data?.message || "Login failed";
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Backend expects: fullName, email, password, role
      const payload = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role,
        nic: data.nic,
        phone: data.phone,
        location: data.location,
      };

      const { data: responseData } = await api.post("/auth/register", payload);

      // Do not set user or token here, as approval is needed

      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_token");
    // Also remove old key if it exists
    localStorage.removeItem("auth_user");
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    // WARNING: This is a placeholder implementation
    // Real implementation must validate on backend and update password securely

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      console.warn(
        "⚠️ Auth Warning: Using placeholder password update. " +
        "Enable Lovable Cloud for real password management."
      );

      // In production, this would:
      // 1. Send current + new password to backend
      // 2. Validate current password
      // 3. Hash and store new password
      // 4. Invalidate other sessions if needed

      return true;
    } catch (error) {
      console.error("Password update error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
