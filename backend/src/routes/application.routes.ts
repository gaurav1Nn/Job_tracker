import { Router } from 'express';
import * as applicationController from '../controllers/application.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import {
    createApplicationSchema,
    updateApplicationSchema,
    applicationQuerySchema,
} from '../validations/application.validation.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', validate(applicationQuerySchema, 'query'), applicationController.getApplications);
router.get('/stats', applicationController.getApplicationStats);
router.get('/:id', applicationController.getApplicationById);
router.post('/', validate(createApplicationSchema), applicationController.createApplication);
router.put('/:id', validate(updateApplicationSchema), applicationController.updateApplication);
router.delete('/:id', applicationController.deleteApplication);

export default router;
