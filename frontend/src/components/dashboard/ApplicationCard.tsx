'use client';

import { Application, STATUS_LABELS, STATUS_COLORS } from '@/types';
import { formatDate, formatCurrency, cn } from '@/lib/utils';
import { MapPin, ExternalLink, Calendar, IndianRupee, MoreVertical, Pencil, Trash2, Building2, Briefcase } from 'lucide-react';
import { useState } from 'react';

interface ApplicationCardProps {
    application: Application;
    onEdit: (application: Application) => void;
    onDelete: (application: Application) => void;
}

export function ApplicationCard({ application, onEdit, onDelete }: ApplicationCardProps) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="group relative bg-white dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-700/50 p-5 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-0.5">
            {/* Left accent bar */}
            <div className={cn(
                'absolute left-0 top-4 bottom-4 w-1 rounded-r-full transition-all duration-300',
                STATUS_COLORS[application.status],
                'group-hover:w-1.5'
            )}></div>

            <div className="flex items-start justify-between gap-4 pl-3">
                <div className="flex-1 min-w-0 space-y-3">
                    {/* Header: Role & Company */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {application.role}
                            </h3>
                            {application.jobUrl && (
                                <a
                                    href={application.jobUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-md text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <div className="p-1 rounded bg-gray-100 dark:bg-gray-800">
                                <Building2 className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                            </div>
                            <span className="font-medium text-sm">{application.company}</span>
                        </div>
                    </div>

                    {/* Meta Info Tags */}
                    <div className="flex flex-wrap items-center gap-3">
                        {application.location && (
                            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700/30 px-2.5 py-1 rounded-lg border border-gray-100 dark:border-gray-700/50">
                                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{application.location}</span>
                            </div>
                        )}
                        {application.salary && (
                            <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-2.5 py-1 rounded-lg">
                                <IndianRupee className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">{formatCurrency(application.salary)}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-gray-500 dark:text-gray-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="text-xs">{formatDate(application.createdAt)}</span>
                        </div>
                    </div>

                    {/* Notes preview */}
                    {application.notes && (
                        <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                            <Briefcase className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-400" />
                            <p className="line-clamp-1 text-xs italic">
                                {application.notes}
                            </p>
                        </div>
                    )}
                </div>

                {/* Right side: Status & Actions */}
                <div className="flex flex-col items-end gap-3">
                    <span
                        className={cn(
                            'px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm tracking-wide uppercase',
                            STATUS_COLORS[application.status]
                        )}
                    >
                        {STATUS_LABELS[application.status]}
                    </span>

                    {/* Menu */}
                    <div className="relative mt-1">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>

                        {showMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowMenu(false)}
                                />
                                <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-20 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    <button
                                        onClick={() => {
                                            onEdit(application);
                                            setShowMenu(false);
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            onDelete(application);
                                            setShowMenu(false);
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
