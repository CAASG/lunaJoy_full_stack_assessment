/**
 * @module errors
 * @description Typed error classes with unique codes, descriptive messages,
 * and optional context for debugging. Every backend error flows through
 * AppError so the global error handler can format consistent responses.
 */

import crypto from 'crypto';

/**
 * Custom application error with structured fields for debugging.
 * The error handler middleware reads these fields to build the HTTP response.
 *
 * @example
 * throw new AppError('LOG_NOT_FOUND', 'Log entry with id "abc" was not found.', 404);
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly context?: Record<string, unknown>;

  constructor(
    code: string,
    message: string,
    statusCode: number,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;

    // Defensive: ensure prototype chain is correct for instanceof checks
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Generates a unique reference ID for internal server errors.
 * This ID is returned to the client so they can report it,
 * while the full stack trace stays in server logs only.
 */
export function generateErrorReferenceId(): string {
  return `err_${crypto.randomBytes(6).toString('hex')}`;
}

/**
 * Generic Result type for service layer functions.
 * Services return Result instead of throwing, enabling explicit
 * error handling in controllers without try/catch overhead.
 */
export type Result<T, E = AppError> =
  | { success: true; data: T }
  | { success: false; error: E };

/** Catalog of error codes used across the application */
export const ErrorCodes = {
  // Authentication
  AUTH_TOKEN_MISSING: 'AUTH_TOKEN_MISSING',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_GOOGLE_INVALID: 'AUTH_GOOGLE_INVALID',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',

  // Logs
  LOG_DUPLICATE_DATE: 'LOG_DUPLICATE_DATE',
  LOG_NOT_FOUND: 'LOG_NOT_FOUND',
  LOG_UNAUTHORIZED: 'LOG_UNAUTHORIZED',

  // Generic
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
