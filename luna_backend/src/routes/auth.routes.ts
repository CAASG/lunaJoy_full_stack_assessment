/**
 * @module auth.routes
 * @description Authentication route definitions. Maps HTTP endpoints
 * to controller functions with appropriate middleware chains.
 */

import { Router } from 'express';
import { googleLogin, getMe } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { googleAuthSchema } from '../schemas/auth.schema.js';

const router = Router();

/** Verify Google ID token and return JWT + user */
router.post('/google', validate(googleAuthSchema), googleLogin);

/** Return authenticated user's profile (requires valid JWT) */
router.get('/me', authenticate, getMe);

export default router;
