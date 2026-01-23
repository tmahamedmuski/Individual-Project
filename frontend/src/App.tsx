import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CreateRequest from "./pages/CreateRequest";
import EditRequest from "./pages/EditRequest";
import MyRequests from "./pages/MyRequests";
import RequesterDashboard from "./pages/RequesterDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import BrokerDashboard from "./pages/BrokerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

import { ThemeProvider } from "@/components/theme-provider";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute requiredRole="requester" />}>
                <Route path="/requester/create-request" element={<CreateRequest />} />
                <Route path="/requester/edit-request/:id" element={<EditRequest />} />
                <Route path="/requester/requests" element={<MyRequests />} />
                <Route path="/requester/*" element={<RequesterDashboard />} />
              </Route>

              <Route element={<ProtectedRoute requiredRole="worker" />}>
                <Route path="/worker/*" element={<WorkerDashboard />} />
              </Route>

              <Route element={<ProtectedRoute requiredRole="broker" />}>
                <Route path="/broker/*" element={<BrokerDashboard />} />
              </Route>

              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/admin/*" element={<AdminDashboard />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
