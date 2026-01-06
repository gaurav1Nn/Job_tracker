'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { signupSchema } from '@/lib/validations';
import { Mail, Lock, User, Phone, Briefcase, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignupPage() {
    const { signup } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = signupSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach(err => {
                if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setIsLoading(true);
        try {
            await signup({
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone || undefined,
            });
            toast.success('Account created successfully!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create account');
        } finally {
            setIsLoading(false);
        }
    };

    const features = [
        'Track unlimited job applications',
        'Organize by status and company',
        'Never miss an opportunity',
    ];

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 relative overflow-hidden">
                {/* Background patterns */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 flex flex-col justify-center px-12 lg:px-16">
                    <div className="mb-10">
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                            <Briefcase className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                            Start Your<br />Success Story
                        </h1>
                        <p className="text-lg text-purple-100 max-w-md mb-8">
                            Join thousands of professionals who are organizing their job search and landing their dream roles.
                        </p>

                        <ul className="space-y-4">
                            {features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-white">
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4" />
                                    </div>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-gray-50 dark:bg-gray-950 overflow-y-auto">
                <div className="w-full max-w-md py-8">
                    {/* Mobile logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="inline-flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">JobSync</span>
                        </div>
                    </div>

                    <div className="text-center lg:text-left mb-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Create your account
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Get started with your job search journey
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="First name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                error={errors.firstName}
                                placeholder="John"
                                icon={<User className="w-5 h-5" />}
                            />
                            <Input
                                label="Last name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                error={errors.lastName}
                                placeholder="Doe"
                            />
                        </div>

                        <Input
                            label="Email address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="you@example.com"
                            icon={<Mail className="w-5 h-5" />}
                        />

                        <Input
                            label="Phone (optional)"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            icon={<Phone className="w-5 h-5" />}
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            placeholder="Min. 8 characters"
                            icon={<Lock className="w-5 h-5" />}
                        />

                        <Input
                            label="Confirm password"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                            placeholder="Confirm your password"
                            icon={<Lock className="w-5 h-5" />}
                        />

                        <Button type="submit" isLoading={isLoading} className="w-full py-3 mt-2">
                            Create account
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
