export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    createdAt: string;
    updatedAt?: string;
    _count?: {
        applications: number;
    };
}

export type ApplicationStatus =
    | 'WISHLIST'
    | 'APPLIED'
    | 'PHONE_SCREEN'
    | 'INTERVIEW'
    | 'OFFER'
    | 'REJECTED'
    | 'ACCEPTED';

export interface Application {
    id: string;
    userId: string;
    company: string;
    role: string;
    status: ApplicationStatus;
    salary?: string | null;
    notes?: string | null;
    location?: string | null;
    jobUrl?: string | null;
    appliedAt?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    pagination?: Pagination;
    errors?: { field: string; message: string }[];
}

export interface AuthResponse {
    user: User;
    accessToken: string;
}

export interface ApplicationStats {
    total: number;
    byStatus: Record<ApplicationStatus, number>;
}

export interface ApplicationFilters {
    status?: ApplicationStatus;
    search?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'appliedAt' | 'company' | 'status';
    sortOrder?: 'asc' | 'desc';
}

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
    WISHLIST: 'Wishlist',
    APPLIED: 'Applied',
    PHONE_SCREEN: 'Phone Screen',
    INTERVIEW: 'Interview',
    OFFER: 'Offer',
    REJECTED: 'Rejected',
    ACCEPTED: 'Accepted',
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
    WISHLIST: 'bg-slate-500',
    APPLIED: 'bg-blue-500',
    PHONE_SCREEN: 'bg-purple-500',
    INTERVIEW: 'bg-amber-500',
    OFFER: 'bg-green-500',
    REJECTED: 'bg-red-500',
    ACCEPTED: 'bg-emerald-500',
};
