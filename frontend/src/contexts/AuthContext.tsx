import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import api from '@/lib/axios';
import { useLanguage } from '@/contexts/LanguageContext';

export interface User {
    profilePicture?: string | null;
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
    role: string;
    accountStatus: string;
    isApproved: boolean;
    averageRating?: number;
    reviewCount?: number;
    skills?: string[];
    location?: {
        type: string;
        coordinates: number[];
        address: string;
    };
    preferredLanguage?: string;
    nic?: string;
    nicPhoto?: string | null;
    workingPhotos?: string[];
    gpLetters?: string[];
    createdAt?: string | Date;
    rejectionTimestamp?: string | Date | null;
}

export interface LoginData {
    email?: string;
    password?: string;
    [key: string]: unknown;
}

export interface RegisterData {
    fullName?: string;
    email?: string;
    password?: string;
    role?: string;
    phone?: string;
    nic?: string;
    address?: string;
    preferredLanguage?: string;
    location?: {
        lat: number;
        lng: number;
        address?: string;
    } | null;
    skills?: string[];
    nicPhoto?: File | string | null;
    workingPhotos?: (File | string)[];
    gpLetters?: (File | string)[];
    [key: string]: unknown;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: LoginData) => Promise<{ success: boolean; message?: string; role?: string }>;
    register: (data: RegisterData) => Promise<unknown>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { setLanguage } = useLanguage();

    const checkUserLoggedIn = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const { data } = await api.get('/auth/me'); // Ensure backend has this endpoint or similar
                setUser(data);
                if (data.preferredLanguage) {
                    setLanguage(data.preferredLanguage as 'en' | 'si' | 'ta');
                }
            } catch (error) {
                console.error("Session check failed:", error);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, [setLanguage]);

    useEffect(() => {
        checkUserLoggedIn();
    }, [checkUserLoggedIn]);

    const login = async (userData: LoginData) => {
        try {
            const { data } = await api.post('/auth/login', userData);
            localStorage.setItem('token', data.token);
            setUser(data.user || null); // Ideally backend returns user info on login
            // Fetch full user details if not returned in login
            if (!data.user) {
                const me = await api.get('/auth/me');
                setUser(me.data);
                if (me.data.preferredLanguage) {
                    setLanguage(me.data.preferredLanguage as 'en' | 'si' | 'ta');
                }
                return { success: true, role: me.data.role };
            }
            if (data.user && data.user.preferredLanguage) {
                setLanguage(data.user.preferredLanguage as 'en' | 'si' | 'ta');
            }
            return { success: true, role: data.user.role };
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            return {
                success: false,
                message: err.response?.data?.message || 'Login failed',
            };
        }
    };

    const register = async (userData: RegisterData) => {
        try {
            // Check if there's a file to upload
            if (userData.nicPhoto instanceof File || (userData.workingPhotos && userData.workingPhotos.length > 0) || (userData.gpLetters && userData.gpLetters.length > 0)) {
                // Create FormData for file upload
                const formData = new FormData();

                // Append all form fields
                formData.append('fullName', userData.fullName || '');
                formData.append('email', userData.email || '');
                formData.append('password', userData.password || '');
                formData.append('role', userData.role || 'requester');
                formData.append('phone', userData.phone || '');
                formData.append('nic', userData.nic || '');
                formData.append('address', userData.address || '');
                if (userData.preferredLanguage) {
                    formData.append('preferredLanguage', userData.preferredLanguage);
                }

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
                    userData.workingPhotos.forEach((file: File | string) => {
                        if (file instanceof File) {
                            formData.append('workingPhotos', file);
                        }
                    });
                }

                // Append GP letters (for workers)
                if (userData.gpLetters && Array.isArray(userData.gpLetters)) {
                    userData.gpLetters.forEach((file: File | string) => {
                        if (file instanceof File) {
                            formData.append('gpLetters', file);
                        }
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
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            throw new Error(err.response?.data?.message || 'Registration failed');
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
