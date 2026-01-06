import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env.js';
import prisma from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';
import { SignupInput, LoginInput } from '../validations/auth.validation.js';

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
};

export const generateAccessToken = (userId: string, email: string): string => {
    return jwt.sign(
        { userId, email },
        env.JWT_ACCESS_SECRET as jwt.Secret,
        { expiresIn: '15m' }
    );
};

export const generateRefreshToken = (): string => {
    return crypto.randomBytes(64).toString('hex');
};

export const signup = async (data: SignupInput) => {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existingUser) {
        throw new AppError('User with this email already exists', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
        data: {
            ...data,
            password: hashedPassword,
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            createdAt: true,
        },
    });

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken();

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
        data: {
            userId: user.id,
            token: refreshToken,
            expiresAt,
        },
    });

    return { user, accessToken, refreshToken };
};

export const login = async (data: LoginInput) => {
    // Find user
    const user = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (!user) {
        throw new AppError('Invalid email or password', 401);
    }

    // Verify password
    const isValidPassword = await comparePassword(data.password, user.password);

    if (!isValidPassword) {
        throw new AppError('Invalid email or password', 401);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken();

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
        data: {
            userId: user.id,
            token: refreshToken,
            expiresAt,
        },
    });

    // Return user without password
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, accessToken, refreshToken };
};

export const refreshTokens = async (token: string) => {
    // Find refresh token
    const storedToken = await prisma.refreshToken.findUnique({
        where: { token },
        include: { user: true },
    });

    if (!storedToken) {
        throw new AppError('Invalid refresh token', 401);
    }

    if (storedToken.expiresAt < new Date()) {
        // Delete expired token
        await prisma.refreshToken.delete({ where: { id: storedToken.id } });
        throw new AppError('Refresh token expired', 401);
    }

    // Rotate refresh token (delete old, create new)
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    const newRefreshToken = generateRefreshToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
        data: {
            userId: storedToken.userId,
            token: newRefreshToken,
            expiresAt,
        },
    });

    const accessToken = generateAccessToken(
        storedToken.user.id,
        storedToken.user.email
    );

    return { accessToken, refreshToken: newRefreshToken };
};

export const logout = async (refreshToken: string, userId: string) => {
    // Delete the specific refresh token
    await prisma.refreshToken.deleteMany({
        where: {
            token: refreshToken,
            userId,
        },
    });
};

export const logoutAll = async (userId: string) => {
    // Delete all refresh tokens for user
    await prisma.refreshToken.deleteMany({
        where: { userId },
    });
};
