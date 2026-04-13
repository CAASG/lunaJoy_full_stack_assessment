/**
 * @module logger
 * @description Structured logger using pino. Replaces console.log across
 * the entire backend to enforce consistent, leveled logging with timestamps.
 * Uses pino-pretty in development for human-readable output.
 */

import pino from 'pino';

/**
 * Application-wide logger instance.
 * Levels: trace, debug, info, warn, error, fatal.
 * Configure via LOG_LEVEL env variable (defaults to 'info').
 */
export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport:
    process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty' }
      : undefined,
});
