import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    requiredRole?: string;
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
        // Admin usually has access to everything, or strictly enforce roles
        // If strict enforcement is needed: if (requiredRole && user.role !== requiredRole)
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
