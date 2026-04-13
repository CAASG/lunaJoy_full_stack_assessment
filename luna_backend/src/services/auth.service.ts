/**
 * @module auth.service
 * @description Handles Google OAuth token verification, user creation/lookup,
 * and JWT issuance. All functions return Result types for explicit error
 * handling without relying on thrown exceptions.
 */

import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { AppError, ErrorCodes, type Result } from '../lib/errors.js';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';
import type { User } from '../generated/prisma/models.js';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

/** Payload extracted from a verified Google ID token */
interface GoogleUserPayload {
  googleId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

/**
 * Verifies a Google ID token using Google's OAuth2 library.
 * Returns the user's profile info if the token is valid.
 *
 * @param credential - The Google ID token string from the frontend
 * @returns Result with GoogleUserPayload on success, AppError on failure
 */
export async function verifyGoogleToken(
  credential: string
): Promise<Result<GoogleUserPayload>> {
  // Defensive: ensure credential is a non-empty string
  if (!credential?.trim()) {
    return {
      success: false,
      error: new AppError(
        ErrorCodes.AUTH_GOOGLE_INVALID,
        'Google credential token is empty or missing.',
        401
      ),
    };
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Defensive: Google library can return undefined payload
    if (!payload?.sub || !payload?.email) {
      return {
        success: false,
        error: new AppError(
          ErrorCodes.AUTH_GOOGLE_INVALID,
          'Google token payload is missing required fields (sub, email).',
          401,
          { hasPayload: !!payload }
        ),
      };
    }

    return {
      success: true,
      data: {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name ?? payload.email.split('@')[0],
        avatarUrl: payload.picture ?? null,
      },
    };
  } catch (err) {
    logger.warn({ err }, 'Google token verification failed');

    return {
      success: false,
      error: new AppError(
        ErrorCodes.AUTH_GOOGLE_INVALID,
        'Google authentication failed. The token could not be verified.',
        401
      ),
    };
  }
}

/**
 * Finds an existing user by Google ID, or creates a new one.
 * Uses Prisma upsert to handle the race condition atomically.
 *
 * @param googleUser - Profile info extracted from a verified Google token
 * @returns Result with the User record
 */
export async function findOrCreateUser(
  googleUser: GoogleUserPayload
): Promise<Result<User>> {
  // Defensive: validate required fields before DB operation
  if (!googleUser.googleId?.trim() || !googleUser.email?.trim()) {
    return {
      success: false,
      error: new AppError(
        ErrorCodes.VALIDATION_ERROR,
        'Cannot create user: googleId and email are required.',
        400,
        { googleId: googleUser.googleId, email: googleUser.email }
      ),
    };
  }

  try {
    const user = await prisma.user.upsert({
      where: { googleId: googleUser.googleId },
      update: {
        name: googleUser.name,
        avatarUrl: googleUser.avatarUrl,
      },
      create: {
        googleId: googleUser.googleId,
        email: googleUser.email,
        name: googleUser.name,
        avatarUrl: googleUser.avatarUrl,
      },
    });

    return { success: true, data: user };
  } catch (err) {
    logger.error({ err, googleId: googleUser.googleId }, 'Failed to upsert user');

    return {
      success: false,
      error: new AppError(
        ErrorCodes.INTERNAL_ERROR,
        'Failed to create or update user record.',
        500
      ),
    };
  }
}

/**
 * Issues a signed JWT containing the user's ID and email.
 * Token expires in 7 days.
 *
 * @param user - The authenticated user record from the database
 * @returns Signed JWT string
 */
export function issueJwt(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/** Shape of the decoded JWT payload used across the app */
export interface JwtPayload {
  id: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}
