'use client';

import { useState, useEffect } from 'react';
import { Application, ApplicationStatus, STATUS_LABELS } from '@/types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { applicationSchema, ApplicationInput } from '@/lib/validations';
import { Building2, Briefcase, MapPin, Globe, Banknote, Calendar, FileText } from 'lucide-react';

interface ApplicationFormProps {
    initialData?: Application;
    onSubmit: (data: ApplicationInput) => Promise<void>;
    onCancel: () => void;
    isLoading: boolean;
}

const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
}));

export function ApplicationForm({
    initialData,
    onSubmit,
    onCancel,
    isLoading,
}: ApplicationFormProps) {
    const [formData, setFormData] = useState({
        company: initialData?.company || '',
        role: initialData?.role || '',
        status: initialData?.status || 'WISHLIST',
        salary: initialData?.salary?.toString() || '',
        location: initialData?.location || '',
        jobUrl: initialData?.jobUrl || '',
        notes: initialData?.notes || '',
        appliedAt: initialData?.appliedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        const result = applicationSchema.safeParse({
            ...formData,
            status: formData.status as ApplicationStatus,
            salary: formData.salary || undefined,
            jobUrl: formData.jobUrl || undefined,
            appliedAt: formData.appliedAt ? new Date(formData.appliedAt).toISOString() : undefined,
        });

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach((err) => {
                if (err.path[0]) {
                    fieldErrors[err.path[0].toString()] = err.message;
                }
            });
            setErrors(fieldErrors);
            return;
        }

        await onSubmit(result.data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-5">
                    <Input
                        label="Company *"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        error={errors.company}
                        placeholder="e.g. Google"
                        icon={<Building2 className="w-4 h-4" />}
                    />
                    <Input
                        label="Role *"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        error={errors.role}
                        placeholder="e.g. Senior Frontend Engineer"
                        icon={<Briefcase className="w-4 h-4" />}
                    />
                    <Select
                        label="Status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        options={statusOptions}
                    />
                    <Input
                        label="Expected Salary (INR)"
                        name="salary"
                        type="number"
                        value={formData.salary}
                        onChange={handleChange}
                        error={errors.salary}
                        placeholder="e.g. 2400000"
                        icon={<Banknote className="w-4 h-4" />}
                    />
                </div>

                <div className="space-y-5">
                    <Input
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Bangalore, Remote"
                        icon={<MapPin className="w-4 h-4" />}
                    />
                    <Input
                        label="Date Applied"
                        name="appliedAt"
                        type="date"
                        value={formData.appliedAt}
                        onChange={handleChange}
                        icon={<Calendar className="w-4 h-4" />}
                    />
                    <Input
                        label="Job Posting URL"
                        name="jobUrl"
                        type="url"
                        value={formData.jobUrl}
                        onChange={handleChange}
                        error={errors.jobUrl}
                        placeholder="https://linkedin.com/jobs/..."
                        icon={<Globe className="w-4 h-4" />}
                    />
                    <div className="relative">
                        <Textarea
                            label="Notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Interview rounds, key requirements, referral info..."
                            className="h-[88px]"
                        />
                        <div className="absolute top-9 left-3 text-gray-400 pointer-events-none">
                            <FileText className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                <Button type="button" variant="ghost" onClick={onCancel} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    Cancel
                </Button>
                <Button type="submit" isLoading={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-105">
                    {initialData ? 'Save Changes' : 'Create Application'}
                </Button>
            </div>
        </form>
    );
}
