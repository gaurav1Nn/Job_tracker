import { Prisma } from '@prisma/client';
import prisma from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';
import {
    CreateApplicationInput,
    UpdateApplicationInput,
    ApplicationQuery,
} from '../validations/application.validation.js';

export const createApplication = async (userId: string, data: CreateApplicationInput) => {
    const application = await prisma.application.create({
        data: {
            ...data,
            userId,
            salary: data.salary ? new Prisma.Decimal(data.salary) : null,
            appliedAt: data.appliedAt ? new Date(data.appliedAt) : null,
            jobUrl: data.jobUrl || null,
        },
    });

    return application;
};

export const getApplications = async (userId: string, query: ApplicationQuery) => {
    const { status, search, startDate, endDate, page, limit, sortBy, sortOrder } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ApplicationWhereInput = {
        userId,
    };

    if (status) {
        where.status = status;
    }

    if (search) {
        where.OR = [
            { company: { contains: search, mode: 'insensitive' } },
            { role: { contains: search, mode: 'insensitive' } },
            { notes: { contains: search, mode: 'insensitive' } },
            { location: { contains: search, mode: 'insensitive' } },
        ];
    }

    if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) {
            where.createdAt.gte = new Date(startDate);
        }
        if (endDate) {
            where.createdAt.lte = new Date(endDate);
        }
    }

    // Execute queries
    const [applications, total] = await Promise.all([
        prisma.application.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
        }),
        prisma.application.count({ where }),
    ]);

    return {
        applications,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const getApplicationById = async (userId: string, applicationId: string) => {
    const application = await prisma.application.findFirst({
        where: {
            id: applicationId,
            userId,
        },
    });

    if (!application) {
        throw new AppError('Application not found', 404);
    }

    return application;
};

export const updateApplication = async (
    userId: string,
    applicationId: string,
    data: UpdateApplicationInput
) => {
    // Check if application exists and belongs to user
    const existing = await prisma.application.findFirst({
        where: {
            id: applicationId,
            userId,
        },
    });

    if (!existing) {
        throw new AppError('Application not found', 404);
    }

    const application = await prisma.application.update({
        where: { id: applicationId },
        data: {
            ...data,
            salary: data.salary !== undefined
                ? (data.salary ? new Prisma.Decimal(data.salary) : null)
                : undefined,
            appliedAt: data.appliedAt !== undefined
                ? (data.appliedAt ? new Date(data.appliedAt) : null)
                : undefined,
            jobUrl: data.jobUrl !== undefined ? (data.jobUrl || null) : undefined,
        },
    });

    return application;
};

export const deleteApplication = async (userId: string, applicationId: string) => {
    // Check if application exists and belongs to user
    const existing = await prisma.application.findFirst({
        where: {
            id: applicationId,
            userId,
        },
    });

    if (!existing) {
        throw new AppError('Application not found', 404);
    }

    await prisma.application.delete({
        where: { id: applicationId },
    });

    return { message: 'Application deleted successfully' };
};

export const getApplicationStats = async (userId: string) => {
    const stats = await prisma.application.groupBy({
        by: ['status'],
        where: { userId },
        _count: { status: true },
    });

    const total = await prisma.application.count({
        where: { userId },
    });

    const statusCounts = stats.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
    }, {} as Record<string, number>);

    return {
        total,
        byStatus: statusCounts,
    };
};
