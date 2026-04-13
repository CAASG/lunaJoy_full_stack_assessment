/**
 * @module env
 * @description Loads and validates environment variables at startup using Zod.
 * Fails fast with a clear message if required variables are missing,
 * preventing runtime surprises from misconfigured environments.
 */

import { z } from 'zod';
import { logger } from '../lib/logger.js';

// NOTE: dotenv is loaded in index.ts before any module imports

const envSchema = z.object({
  PORT: z.string().default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  LOG_LEVEL: z.string().default('info'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  logger.fatal(
    { errors: parsed.error.flatten().fieldErrors },
    'Invalid environment variables. Check your .env file.'
  );
  process.exit(1);
}

/** Validated environment variables */
export const env = parsed.data;
