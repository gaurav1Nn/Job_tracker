'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { profileSchema, changePasswordSchema, ProfileInput, ChangePasswordInput } from '@/lib/validations';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Lock, Save } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ProfilePage() {
    const { user, refreshUser } = useAuth();
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const [profileData, setProfileData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.phone || '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
    const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
        if (profileErrors[name]) {
            setProfileErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
        if (passwordErrors[name]) {
            setPasswordErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingProfile(true);

        try {
            const result = profileSchema.safeParse(profileData);
            if (!result.success) {
                const fieldErrors: Record<string, string> = {};
                result.error.issues.forEach((err) => {
                    if (err.path[0]) {
                        fieldErrors[err.path[0].toString()] = err.message;
                    }
                });
                setProfileErrors(fieldErrors);
                return;
            }

            await api.put('/users/profile', result.data);
            await refreshUser();
            toast.success('Profile updated successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsChangingPassword(true);

        try {
            const result = changePasswordSchema.safeParse(passwordData);
            if (!result.success) {
                const fieldErrors: Record<string, string> = {};
                result.error.issues.forEach((err) => {
                    if (err.path[0]) {
                        fieldErrors[err.path[0].toString()] = err.message;
                    }
                });
                setPasswordErrors(fieldErrors);
                return;
            }

            await api.put('/users/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
            });
            toast.success('Password changed successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage your account settings
                </p>
            </div>

            {/* Profile Info */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-semibold">
                            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {user?.firstName} {user?.lastName}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                                Member since {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="First Name"
                                name="firstName"
                                value={profileData.firstName}
                                onChange={handleProfileChange}
                                error={profileErrors.firstName}
                                icon={<User className="w-5 h-5" />}
                            />
                            <Input
                                label="Last Name"
                                name="lastName"
                                value={profileData.lastName}
                                onChange={handleProfileChange}
                                error={profileErrors.lastName}
                            />
                        </div>

                        <Input
                            label="Email"
                            value={user?.email || ''}
                            disabled
                            icon={<Mail className="w-5 h-5" />}
                        />

                        <Input
                            label="Phone"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleProfileChange}
                            placeholder="+1 (555) 000-0000"
                            icon={<Phone className="w-5 h-5" />}
                        />

                        <div className="flex justify-end">
                            <Button type="submit" isLoading={isUpdatingProfile}>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
                <CardHeader>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Change Password
                    </h2>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <Input
                            label="Current Password"
                            name="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            error={passwordErrors.currentPassword}
                            placeholder="••••••••"
                        />

                        <Input
                            label="New Password"
                            name="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            error={passwordErrors.newPassword}
                            placeholder="Min. 8 characters"
                        />

                        <Input
                            label="Confirm New Password"
                            name="confirmNewPassword"
                            type="password"
                            value={passwordData.confirmNewPassword}
                            onChange={handlePasswordChange}
                            error={passwordErrors.confirmNewPassword}
                            placeholder="••••••••"
                        />

                        <div className="flex justify-end">
                            <Button type="submit" isLoading={isChangingPassword}>
                                Change Password
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
