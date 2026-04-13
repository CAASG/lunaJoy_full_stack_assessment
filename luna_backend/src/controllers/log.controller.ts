/**
 * @module log.controller
 * @description Handles daily mental health log CRUD operations.
 * Converts service Result outcomes into HTTP responses.
 * Socket.io event emission will be added in Phase 5.
 */

import type { Request, Response, NextFunction } from 'express';
import { createLog, getLogs } from '../services/log.service.js';
import { getLogsQuerySchema } from '../schemas/log.schema.js';
import { AppError, ErrorCodes } from '../lib/errors.js';

/**
 * POST /api/log
 *
 * Creates a new daily log entry for the authenticated user.
 * Request body is pre-validated by the validate middleware.
 * Returns 201 on success with the created log.
 */
export async function createLogHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // Defensive: req.user is guaranteed by auth middleware, but verify
  if (!req.user?.id) {
    next(
      new AppError(
        ErrorCodes.AUTH_TOKEN_INVALID,
        'User identity could not be determined from the token.',
        401
      )
    );
    return;
  }

  const result = await createLog(req.user.id, req.body);

  if (!result.success) {
    next(result.error);
    return;
  }

  // Phase 5: emit Socket.io event here -> io.to(`user:${req.user.id}`).emit('log:created', { log: result.data })

  res.status(201).json({ log: result.data });
}

/**
 * GET /api/logs
 *
 * Retrieves logs for the authenticated user within a time period.
 * Query params: period (week|month), date (YYYY-MM-DD reference date).
 * Returns logs array plus summary averages.
 */
export async function getLogsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // Defensive: verify user identity
  if (!req.user?.id) {
    next(
      new AppError(
        ErrorCodes.AUTH_TOKEN_INVALID,
        'User identity could not be determined from the token.',
        401
      )
    );
    return;
  }

  // Validate query parameters
  const queryResult = getLogsQuerySchema.safeParse(req.query);
  if (!queryResult.success) {
    next(
      new AppError(
        ErrorCodes.VALIDATION_ERROR,
        `Invalid query parameters: ${queryResult.error.issues.map((i) => i.message).join('; ')}`,
        400
      )
    );
    return;
  }

  const { period, date } = queryResult.data;
  const result = await getLogs(req.user.id, period, date);

  if (!result.success) {
    next(result.error);
    return;
  }

  res.status(200).json(result.data);
}
