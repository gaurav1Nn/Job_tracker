'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, ApiResponse, AuthResponse } from '@/types';
import api, { setAccessToken, getAccessToken } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (data: SignupData) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

interface SignupData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const refreshUser = useCallback(async () => {
        try {
            const response = await api.get<ApiResponse<User>>('/users/profile');
            if (response.data.success && response.data.data) {
                setUser(response.data.data);
            }
        } catch {
            setUser(null);
            setAccessToken(null);
        }
    }, []);

    // Check auth status on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Try to refresh token first
                const response = await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh');
                if (response.data.success && response.data.data) {
                    setAccessToken(response.data.data.accessToken);
                    await refreshUser();
                }
            } catch {
                // Not authenticated
                setUser(null);
                setAccessToken(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [refreshUser]);

    const login = async (email: string, password: string) => {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
            email,
            password,
        });

        if (response.data.success && response.data.data) {
            setAccessToken(response.data.data.accessToken);
            setUser(response.data.data.user);
            router.push('/dashboard');
        }
    };

    const signup = async (data: SignupData) => {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/signup', data);

        if (response.data.success && response.data.data) {
            setAccessToken(response.data.data.accessToken);
            setUser(response.data.data.user);
            router.push('/dashboard');
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch {
            // Ignore errors during logout
        } finally {
            setUser(null);
            setAccessToken(null);
            router.push('/login');
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                signup,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
