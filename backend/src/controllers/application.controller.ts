import { Request, Response, NextFunction } from 'express';
import * as applicationService from '../services/application.service.js';

export const createApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const application = await applicationService.createApplication(userId, req.body);

        res.status(201).json({
            success: true,
            message: 'Application created successfully',
            data: application,
        });
    } catch (error) {
        next(error);
    }
};

export const getApplications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const result = await applicationService.getApplications(userId, req.query as any);

        res.json({
            success: true,
            data: result.applications,
            pagination: result.pagination,
        });
    } catch (error) {
        next(error);
    }
};

export const getApplicationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params;
        const application = await applicationService.getApplicationById(userId, id);

        res.json({
            success: true,
            data: application,
        });
    } catch (error) {
        next(error);
    }
};

export const updateApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params;
        const application = await applicationService.updateApplication(userId, id, req.body);

        res.json({
            success: true,
            message: 'Application updated successfully',
            data: application,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params;
        await applicationService.deleteApplication(userId, id);

        res.json({
            success: true,
            message: 'Application deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

export const getApplicationStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const stats = await applicationService.getApplicationStats(userId);

        res.json({
            success: true,
            data: stats,
        });
    } catch (error) {
        next(error);
    }
};
