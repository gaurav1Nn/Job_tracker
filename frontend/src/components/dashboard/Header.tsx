'use client';

import { useTheme } from '@/context/ThemeContext';
import { Menu } from 'lucide-react';

interface HeaderProps {
    onMenuClick: () => void;
    title?: string;
}

export function Header({ onMenuClick, title }: HeaderProps) {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="sticky top-0 z-30 h-14 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between h-full px-4 lg:px-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    {title && (
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {title}
                        </h1>
                    )}
                </div>

            </div>
        </header>
    );
}
