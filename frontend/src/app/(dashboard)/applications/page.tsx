'use client';

import { useEffect, useState, useCallback } from 'react';
import { Application, ApplicationStatus, ApiResponse, Pagination } from '@/types';
import { ApplicationCard } from '@/components/dashboard/ApplicationCard';
import { ApplicationForm } from '@/components/forms/ApplicationForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ApplicationInput } from '@/lib/validations';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Plus, ChevronLeft, ChevronRight, Search, Filter, Briefcase, X } from 'lucide-react';

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<ApplicationStatus | ''>('');
    const [page, setPage] = useState(1);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingApplication, setEditingApplication] = useState<Application | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Delete confirmation
    const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);

    const fetchApplications = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', '10');
            if (search) params.append('search', search);
            if (status) params.append('status', status);

            const response = await api.get<ApiResponse<Application[]> & { pagination: Pagination }>(
                `/applications?${params.toString()}`
            );

            if (response.data.data) {
                setApplications(response.data.data);
                setPagination(response.data.pagination || null);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Failed to load applications');
        } finally {
            setIsLoading(false);
        }
    }, [page, search, status]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const handleCreate = async (data: ApplicationInput) => {
        setIsSubmitting(true);
        try {
            await api.post('/applications', data);
            toast.success('Application added successfully');
            setIsModalOpen(false);
            fetchApplications();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add application');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (data: ApplicationInput) => {
        if (!editingApplication) return;
        setIsSubmitting(true);
        try {
            await api.put(`/applications/${editingApplication.id}`, data);
            toast.success('Application updated successfully');
            setEditingApplication(null);
            fetchApplications();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update application');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await api.delete(`/applications/${deleteTarget.id}`);
            toast.success('Application deleted');
            setDeleteTarget(null);
            fetchApplications();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete application');
        }
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('');
        setPage(1);
    };

    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: 'SAVED', label: 'Saved' },
        { value: 'APPLIED', label: 'Applied' },
        { value: 'PHONE_SCREEN', label: 'Phone Screen' },
        { value: 'INTERVIEW', label: 'Interview' },
        { value: 'OFFER', label: 'Offer' },
        { value: 'ACCEPTED', label: 'Accepted' },
        { value: 'REJECTED', label: 'Rejected' },
        { value: 'WITHDRAWN', label: 'Withdrawn' },
    ];

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                        Applications
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Track and manage your job applications
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="group shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all">
                    <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    New Application
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by company or role..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        />
                    </div>

                    {/* Status filter */}
                    <div className="relative">
                        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <select
                            value={status}
                            onChange={(e) => { setStatus(e.target.value as ApplicationStatus | ''); setPage(1); }}
                            className="appearance-none pl-11 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all min-w-[160px] cursor-pointer"
                        >
                            {statusOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Clear button */}
                    {(search || status) && (
                        <Button variant="ghost" onClick={clearFilters} className="flex-shrink-0">
                            <X className="w-4 h-4 mr-1.5" />
                            Clear
                        </Button>
                    )}
                </div>

                {/* Active filters display */}
                {(search || status) && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                        <span className="text-sm text-gray-500">Filtering by:</span>
                        {search && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm">
                                Search: {search}
                            </span>
                        )}
                        {status && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg text-sm">
                                Status: {statusOptions.find(s => s.value === status)?.label}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Results count */}
            {!isLoading && pagination && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing <span className="font-medium text-gray-900 dark:text-white">{applications.length}</span> of <span className="font-medium text-gray-900 dark:text-white">{pagination.total}</span> applications
                </p>
            )}

            {/* Applications list */}
            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-28 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse" />
                    ))}
                </div>
            ) : applications.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="relative mx-auto w-20 h-20 mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl opacity-20 blur-lg" />
                        <div className="relative w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                            <Briefcase className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {search || status ? 'No matching applications' : 'No applications yet'}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                        {search || status
                            ? 'Try adjusting your filters to find what you\'re looking for'
                            : 'Start tracking your job applications today'}
                    </p>
                    {!search && !status && (
                        <Button onClick={() => setIsModalOpen(true)}>
                            <Plus className="w-5 h-5 mr-2" />
                            Add Application
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {applications.map((app) => (
                            <ApplicationCard
                                key={app.id}
                                application={app}
                                onEdit={(application) => setEditingApplication(application)}
                                onDelete={(application) => setDeleteTarget(application)}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 pt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Previous
                            </Button>
                            <div className="flex items-center gap-2">
                                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                                    let pageNum = i + 1;
                                    if (pagination.totalPages > 5) {
                                        if (page > 3) pageNum = page - 2 + i;
                                        if (page > pagination.totalPages - 2) pageNum = pagination.totalPages - 4 + i;
                                    }
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setPage(pageNum)}
                                            className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${page === pageNum
                                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === pagination.totalPages}
                                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                            >
                                Next
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    )}
                </>
            )}

            {/* Create Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Application" size="lg">
                <ApplicationForm onSubmit={handleCreate} onCancel={() => setIsModalOpen(false)} isLoading={isSubmitting} />
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={!!editingApplication} onClose={() => setEditingApplication(null)} title="Edit Application" size="lg">
                {editingApplication && (
                    <ApplicationForm
                        initialData={editingApplication}
                        onSubmit={handleUpdate}
                        onCancel={() => setEditingApplication(null)}
                        isLoading={isSubmitting}
                    />
                )}
            </Modal>

            {/* Delete Confirmation */}
            <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Application" size="sm">
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Delete <strong className="text-gray-900 dark:text-white">{deleteTarget?.role}</strong> at{' '}
                    <strong className="text-gray-900 dark:text-white">{deleteTarget?.company}</strong>? This cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </div>
            </Modal>
        </div>
    );
}
