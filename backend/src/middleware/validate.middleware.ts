import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema } from 'zod';

type ValidationTarget = 'body' | 'query' | 'params';

export const validate = (
    schema: ZodSchema,
    target: ValidationTarget = 'body'
): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[target]);

        if (!result.success) {
            return next(result.error);
        }

        req[target] = result.data;
        next();
    };
};
