import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/axios';

interface User {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    accountStatus: string;
    isApproved: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: any) => Promise<{ success: boolean; message?: string; role?: string }>;
    register: (data: any) => Promise<any>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const { data } = await api.get('/auth/me'); // Ensure backend has this endpoint or similar
                setUser(data);
            } catch (error) {
                console.error("Session check failed:", error);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    };

    const login = async (userData: any) => {
        try {
            const { data } = await api.post('/auth/login', userData);
            localStorage.setItem('token', data.token);
            setUser(data.user || null); // Ideally backend returns user info on login
            // Fetch full user details if not returned in login
            if (!data.user) {
                const me = await api.get('/auth/me');
                setUser(me.data);
                return { success: true, role: me.data.role };
            }
            return { success: true, role: data.user.role };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed',
            };
        }
    };

    const register = async (userData: any) => {
        try {
            // Updated to use the correct endpoint
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
