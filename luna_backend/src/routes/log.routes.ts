/**
 * @module log.routes
 * @description Daily log route definitions. All routes require authentication.
 * POST validates the body with Zod; GET validates query params in the controller.
 */

import { Router } from 'express';
import { createLogHandler, getLogsHandler } from '../controllers/log.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createLogSchema } from '../schemas/log.schema.js';

const router = Router();

/** Submit a new daily log entry */
router.post('/', authenticate, validate(createLogSchema), createLogHandler);

/** Retrieve logs for visualization with optional period and date filters */
router.get('/', authenticate, getLogsHandler);

export default router;
