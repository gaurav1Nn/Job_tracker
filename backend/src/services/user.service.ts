import prisma from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';
import { hashPassword, comparePassword } from './auth.service.js';
import { UpdateProfileInput, ChangePasswordInput } from '../validations/user.validation.js';

export const getProfile = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            createdAt: true,
            updatedAt: true,
            _count: {
                select: { applications: true },
            },
        },
    });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    return user;
};

export const updateProfile = async (userId: string, data: UpdateProfileInput) => {
    const user = await prisma.user.update({
        where: { id: userId },
        data,
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return user;
};

export const changePassword = async (userId: string, data: ChangePasswordInput) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    const isValidPassword = await comparePassword(data.currentPassword, user.password);

    if (!isValidPassword) {
        throw new AppError('Current password is incorrect', 400);
    }

    const hashedPassword = await hashPassword(data.newPassword);

    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });

    // Optionally: invalidate all refresh tokens after password change
    await prisma.refreshToken.deleteMany({
        where: { userId },
    });

    return { message: 'Password changed successfully' };
};

export const deleteAccount = async (userId: string) => {
    await prisma.user.delete({
        where: { id: userId },
    });

    return { message: 'Account deleted successfully' };
};
