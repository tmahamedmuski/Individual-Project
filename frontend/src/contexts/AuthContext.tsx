import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/axios';

interface User {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
    role: string;
    accountStatus: string;
    isApproved: boolean;
    averageRating?: number;
    reviewCount?: number;
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
            // Check if there's a file to upload
            if (userData.nicPhoto instanceof File || (userData.workingPhotos && userData.workingPhotos.length > 0) || (userData.gpLetters && userData.gpLetters.length > 0)) {
                // Create FormData for file upload
                const formData = new FormData();

                // Append all form fields
                formData.append('fullName', userData.fullName);
                formData.append('email', userData.email);
                formData.append('password', userData.password);
                formData.append('role', userData.role || 'requester');
                formData.append('phone', userData.phone);
                formData.append('nic', userData.nic);
                formData.append('address', userData.address || '');

                // Append location as JSON string
                if (userData.location) {
                    formData.append('location', JSON.stringify({
                        type: 'Point',
                        coordinates: [userData.location.lng, userData.location.lat],
                        address: userData.location.address
                    }));
                }

                // Append skills as JSON string
                if (userData.skills && Array.isArray(userData.skills)) {
                    formData.append('skills', JSON.stringify(userData.skills));
                }

                // Append NIC photo
                if (userData.nicPhoto instanceof File) {
                    formData.append('nicPhoto', userData.nicPhoto);
                }

                // Append working photos (for workers)
                if (userData.workingPhotos && Array.isArray(userData.workingPhotos)) {
                    userData.workingPhotos.forEach((file: File) => {
                        formData.append('workingPhotos', file);
                    });
                }

                // Append GP letters (for workers)
                if (userData.gpLetters && Array.isArray(userData.gpLetters)) {
                    userData.gpLetters.forEach((file: File) => {
                        formData.append('gpLetters', file);
                    });
                }

                // Send with multipart/form-data header
                const response = await api.post('/auth/register', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                return response.data;
            } else {
                // Fallback to JSON if no file
                const response = await api.post('/auth/register', userData);
                return response.data;
            }
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
