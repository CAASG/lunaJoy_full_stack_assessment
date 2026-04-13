/**
 * @module auth.controller
 * @description Handles authentication endpoints. Verifies Google OAuth
 * tokens, creates/finds users, and issues JWTs. Uses the Result pattern
 * from auth.service to convert service outcomes into HTTP responses.
 */

import type { Request, Response, NextFunction } from 'express';
import { verifyGoogleToken, findOrCreateUser, issueJwt } from '../services/auth.service.js';
import { logger } from '../lib/logger.js';

/**
 * POST /api/auth/google
 *
 * Receives a Google ID token from the frontend, verifies it with Google,
 * finds or creates the user in the database, and returns a JWT + user info.
 *
 * Flow: credential -> Google verify -> DB upsert -> JWT sign -> response
 */
export async function googleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { credential } = req.body;

  // Step 1: Verify Google token
  const tokenResult = await verifyGoogleToken(credential);
  if (!tokenResult.success) {
    next(tokenResult.error);
    return;
  }

  // Step 2: Find or create user in database
  const userResult = await findOrCreateUser(tokenResult.data);
  if (!userResult.success) {
    next(userResult.error);
    return;
  }

  // Step 3: Issue JWT
  const user = userResult.data;
  const token = issueJwt(user);

  logger.info({ userId: user.id, email: user.email }, 'User authenticated successfully');

  res.status(200).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
    },
  });
}

/**
 * GET /api/auth/me
 *
 * Returns the currently authenticated user's profile.
 * Requires a valid JWT (enforced by auth middleware).
 * Useful for validating the token on page reload without re-authenticating.
 */
export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  // Defensive: req.user should always exist after auth middleware, but verify
  if (!req.user?.id) {
    next(new Error('User not found in request after authentication'));
    return;
  }

  const { id, email, name } = req.user;

  res.status(200).json({
    user: { id, email, name },
  });
}
