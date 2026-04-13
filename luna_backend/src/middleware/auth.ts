/**
 * @module auth.middleware
 * @description Express middleware that verifies JWT tokens from the
 * Authorization header. Attaches the decoded user payload to req.user
 * for downstream route handlers. Returns structured error responses
 * for missing, expired, or invalid tokens.
 */

import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError, ErrorCodes } from '../lib/errors.js';
import { env } from '../config/env.js';
import type { JwtPayload } from '../services/auth.service.js';

/** Extends Express Request to include the authenticated user */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware that requires a valid JWT in the Authorization header.
 * Format: "Bearer <token>"
 *
 * Attaches decoded payload to req.user on success.
 * Passes AppError to next() on failure with specific error codes:
 * - AUTH_TOKEN_MISSING: no Authorization header
 * - AUTH_TOKEN_EXPIRED: token past expiration
 * - AUTH_TOKEN_INVALID: malformed or unverifiable token
 */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  // Defensive: check header exists and has correct format
  if (!authHeader?.startsWith('Bearer ')) {
    next(
      new AppError(
        ErrorCodes.AUTH_TOKEN_MISSING,
        'Authorization header is required. Send: Authorization: Bearer <token>',
        401
      )
    );
    return;
  }

  const token = authHeader.slice(7);

  // Defensive: ensure token string is not empty after "Bearer "
  if (!token.trim()) {
    next(
      new AppError(
        ErrorCodes.AUTH_TOKEN_MISSING,
        'Authorization token is empty. Send a valid JWT after "Bearer ".',
        401
      )
    );
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    // Defensive: verify decoded payload has required fields
    if (!decoded.id || !decoded.email) {
      next(
        new AppError(
          ErrorCodes.AUTH_TOKEN_INVALID,
          'Token payload is missing required fields (id, email).',
          401
        )
      );
      return;
    }

    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      next(
        new AppError(
          ErrorCodes.AUTH_TOKEN_EXPIRED,
          'Session expired. Please sign in again.',
          401
        )
      );
      return;
    }

    next(
      new AppError(
        ErrorCodes.AUTH_TOKEN_INVALID,
        'Invalid authentication token format.',
        401
      )
    );
  }
}
