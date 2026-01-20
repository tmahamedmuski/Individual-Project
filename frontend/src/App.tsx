import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import RequesterDashboard from "./pages/RequesterDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import BrokerDashboard from "./pages/BrokerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  {/* Default dashboard redirect currently happening in ProtectedRoute or component logic could be improved here, 
                      but for now let's keep Dashboard as a generic fallback or specific role one */}
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/requester"
              element={
                <ProtectedRoute requiredRole="requester">
                  <RequesterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/worker"
              element={
                <ProtectedRoute requiredRole="worker">
                  <WorkerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/broker"
              element={
                <ProtectedRoute requiredRole="broker">
                  <BrokerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
