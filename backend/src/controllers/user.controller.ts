import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service.js';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const user = await userService.getProfile(userId);

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const user = await userService.updateProfile(userId, req.body);

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const result = await userService.changePassword(userId, req.body);

        res.json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        await userService.deleteAccount(userId);

        res.clearCookie('refreshToken');

        res.json({
            success: true,
            message: 'Account deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
