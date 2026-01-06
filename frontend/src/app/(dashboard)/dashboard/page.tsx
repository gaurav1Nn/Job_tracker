'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ApplicationCard } from '@/components/dashboard/ApplicationCard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Application, ApplicationStats, ApiResponse } from '@/types';
import api from '@/lib/api';
import {
    Plus, ArrowRight, Briefcase, Clock, CheckCircle2, XCircle,
    TrendingUp, Calendar, Zap, BarChart3, Target
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<ApplicationStats>({ total: 0, byStatus: {} as any });
    const [recentApplications, setRecentApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);

    const fetchData = async () => {
        try {
            const [statsRes, appsRes] = await Promise.all([
                api.get<ApiResponse<ApplicationStats>>('/applications/stats'),
                api.get<ApiResponse<Application[]>>('/applications?limit=5'),
            ]);

            if (statsRes.data.data) setStats(statsRes.data.data);
            if (appsRes.data.data) setRecentApplications(appsRes.data.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = () => router.push('/applications');

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await api.delete(`/applications/${deleteTarget.id}`);
            toast.success('Application deleted');
            setDeleteTarget(null);
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete');
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    const inProgress = (stats.byStatus.APPLIED || 0) + (stats.byStatus.PHONE_SCREEN || 0) + (stats.byStatus.INTERVIEW || 0);
    const offers = (stats.byStatus.OFFER || 0) + (stats.byStatus.ACCEPTED || 0);
    const successRate = stats.total > 0 ? Math.round((offers / stats.total) * 100) : 0;

    const statCards = [
        {
            label: 'Total Applications',
            value: stats.total,
            icon: Briefcase,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10',
            textColor: 'text-blue-600 dark:text-blue-400'
        },
        {
            label: 'In Progress',
            value: inProgress,
            icon: Clock,
            color: 'from-amber-500 to-orange-500',
            bgColor: 'bg-amber-500/10',
            textColor: 'text-amber-600 dark:text-amber-400'
        },
        {
            label: 'Offers Received',
            value: offers,
            icon: CheckCircle2,
            color: 'from-emerald-500 to-green-500',
            bgColor: 'bg-emerald-500/10',
            textColor: 'text-emerald-600 dark:text-emerald-400'
        },
        {
            label: 'Rejected',
            value: stats.byStatus.REJECTED || 0,
            icon: XCircle,
            color: 'from-rose-500 to-red-500',
            bgColor: 'bg-rose-500/10',
            textColor: 'text-rose-600 dark:text-rose-400'
        },
    ];

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-48 rounded-3xl bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 animate-pulse" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6 lg:p-8">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
                    <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-float-delayed" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-transparent rounded-full blur-3xl" />
                </div>

                <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                                <Zap className="w-4 h-4 text-yellow-300" />
                                <span className="text-sm font-medium text-white/90">Job Search Dashboard</span>
                            </div>

                            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                                {getGreeting()}, <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">{user?.firstName}</span>!
                            </h1>

                            <p className="text-white/80 text-lg max-w-md">
                                You've applied to <span className="font-bold text-white">{stats.total}</span> positions.
                                {stats.total > 0 ? " Keep up the great work!" : " Start your journey today!"}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link href="/applications">
                                <Button className="group bg-white text-indigo-600 hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold px-6">
                                    <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                                    New Application
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Mini stats in hero */}
                    {stats.total > 0 && (
                        <div className="mt-8 pt-6 border-t border-white/20">
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <BarChart3 className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{successRate}%</p>
                                        <p className="text-sm text-white/70">Success Rate</p>
                                    </div>
                                </div>
                                <div className="w-px h-10 bg-white/20 hidden sm:block" />
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <Target className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{inProgress}</p>
                                        <p className="text-sm text-white/70">Active Applications</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Stats Grid */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Progress</h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((stat, index) => (
                        <div
                            key={stat.label}
                            className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all duration-500 hover:-translate-y-1"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Gradient overlay on hover */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                                        <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                                    </div>
                                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${stat.color}`} />
                                </div>

                                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                    {stat.value}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {stat.label}
                                </p>
                            </div>

                            {/* Bottom accent line */}
                            <div className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full`} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Recent Activity */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                        <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full">
                            {recentApplications.length} latest
                        </span>
                    </div>
                    <Link
                        href="/applications"
                        className="group flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
                    >
                        View all
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    {recentApplications.length === 0 ? (
                        <div className="text-center py-16 px-6">
                            <div className="relative mx-auto w-24 h-24 mb-6">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl opacity-20 blur-xl animate-pulse" />
                                <div className="relative w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/30">
                                    <Briefcase className="w-10 h-10 text-white" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                Start Your Journey
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                                Track your first job application and organize your career path
                            </p>
                            <Link href="/applications">
                                <Button className="group shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all">
                                    <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                                    Add Your First Application
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50 dark:divide-gray-800">
                            {recentApplications.map((app, index) => (
                                <div
                                    key={app.id}
                                    className="p-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                                >
                                    <ApplicationCard
                                        application={app}
                                        onEdit={handleEdit}
                                        onDelete={(application) => setDeleteTarget(application)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Delete Modal */}
            <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Application" size="sm">
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Are you sure you want to delete <strong className="text-gray-900 dark:text-white">{deleteTarget?.role}</strong> at <strong className="text-gray-900 dark:text-white">{deleteTarget?.company}</strong>?
                </p>
                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </div>
            </Modal>

            {/* Custom animations */}
            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-20px) scale(1.05); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-15px) scale(1.03); }
                }
                .animate-float { animation: float 8s ease-in-out infinite; }
                .animate-float-delayed { animation: float-delayed 10s ease-in-out infinite 2s; }
            `}</style>
        </div>
    );
}
