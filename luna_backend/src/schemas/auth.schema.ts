/**
 * @module auth.schema
 * @description Zod validation schemas for authentication endpoints.
 * Validates Google credential tokens before they reach the service layer,
 * ensuring only well-formed payloads proceed to Google API verification.
 */

import { z } from 'zod';

/** Schema for POST /api/auth/google request body */
export const googleAuthSchema = z.object({
  credential: z
    .string({ required_error: 'Google credential token is required' })
    .min(1, 'Google credential token cannot be empty'),
});

export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;
