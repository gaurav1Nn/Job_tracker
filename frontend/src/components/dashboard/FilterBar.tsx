'use client';

import { ApplicationStatus, STATUS_LABELS } from '@/types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface FilterBarProps {
    search: string;
    onSearchChange: (value: string) => void;
    status: ApplicationStatus | '';
    onStatusChange: (value: ApplicationStatus | '') => void;
    onClear: () => void;
}

const statusOptions = [
    { value: '', label: 'All Statuses' },
    ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label })),
];

export function FilterBar({
    search,
    onSearchChange,
    status,
    onStatusChange,
    onClear,
}: FilterBarProps) {
    const hasFilters = search || status;

    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by company, role, or notes..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                />
            </div>

            <select
                value={status}
                onChange={(e) => onStatusChange(e.target.value as ApplicationStatus | '')}
                className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            >
                {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {hasFilters && (
                <Button variant="ghost" onClick={onClear} className="shrink-0">
                    <X className="w-4 h-4 mr-1" />
                    Clear
                </Button>
            )}
        </div>
    );
}
