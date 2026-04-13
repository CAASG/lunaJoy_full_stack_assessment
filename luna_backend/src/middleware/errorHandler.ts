/**
 * @module errorHandler
 * @description Global Express error handler. Formats all errors into a
 * consistent JSON response shape. AppErrors retain their code and status.
 * Unknown errors get a generic 500 response with a reference ID that
 * maps to the full stack trace in server logs.
 */

import type { Request, Response, NextFunction } from 'express';
import { AppError, ErrorCodes, generateErrorReferenceId } from '../lib/errors.js';
import { logger } from '../lib/logger.js';

/**
 * Global error handling middleware. Must be registered after all routes.
 * Express identifies error handlers by their 4-argument signature.
 *
 * - AppError: responds with the error's code, message, and status
 * - Unknown errors: logs full stack trace, responds with generic 500 + reference ID
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // Express requires 4 args to identify error handlers; next is unused here
  _next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
): void {
  if (err instanceof AppError) {
    logger.warn(
      { code: err.code, statusCode: err.statusCode, path: `${req.method} ${req.path}`, context: err.context },
      err.message
    );

    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        statusCode: err.statusCode,
        timestamp: new Date().toISOString(),
        path: `${req.method} ${req.path}`,
      },
    });
    return;
  }

  // Unknown error: log full details, return safe response with reference ID
  const referenceId = generateErrorReferenceId();

  logger.error(
    { err, referenceId, path: `${req.method} ${req.path}` },
    'Unhandled error occurred'
  );

  res.status(500).json({
    error: {
      code: ErrorCodes.INTERNAL_ERROR,
      message: `An unexpected error occurred. Reference: ${referenceId}`,
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: `${req.method} ${req.path}`,
    },
  });
}
