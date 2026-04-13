/**
 * @module validate.middleware
 * @description Factory middleware that validates request bodies against
 * a Zod schema. Returns field-level validation errors in a format that
 * is easy to debug: includes the field name, expected constraint, and
 * the actual value received.
 */

import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema, ZodError } from 'zod';
import { AppError, ErrorCodes } from '../lib/errors.js';

/**
 * Formats Zod validation errors into a human-readable message.
 * Each field error shows what was expected vs. what was received.
 */
function formatZodErrors(error: ZodError): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.join('.');
      return `${path}: ${issue.message}`;
    })
    .join('; ');
}

/**
 * Creates an Express middleware that validates req.body against the given Zod schema.
 * On success, replaces req.body with the parsed (and potentially transformed) data.
 * On failure, passes a VALIDATION_ERROR AppError to next() with detailed field info.
 *
 * @param schema - A Zod schema to validate against
 * @returns Express middleware function
 */
export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(
        new AppError(
          ErrorCodes.VALIDATION_ERROR,
          `Validation failed: ${formatZodErrors(result.error)}`,
          400,
          { fields: result.error.flatten().fieldErrors }
        )
      );
      return;
    }

    // Replace body with parsed data (applies defaults, transforms, etc.)
    req.body = result.data;
    next();
  };
}
