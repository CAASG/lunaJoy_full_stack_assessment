/**
 * @module log.schema
 * @description Zod validation schemas for daily log endpoints.
 * Enforces value ranges (1-5 scales, 0-24 hours, etc.) and
 * conditional fields (symptomsSeverity requires symptomsPresent).
 */

import { z } from 'zod';

/** Schema for POST /api/log request body */
export const createLogSchema = z
  .object({
    logDate: z
      .string({ required_error: 'logDate is required' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'logDate must be in YYYY-MM-DD format'),
    moodRating: z
      .number({ required_error: 'moodRating is required' })
      .int('moodRating must be an integer')
      .min(1, 'moodRating must be between 1 and 5')
      .max(5, 'moodRating must be between 1 and 5'),
    anxietyLevel: z
      .number({ required_error: 'anxietyLevel is required' })
      .int('anxietyLevel must be an integer')
      .min(1, 'anxietyLevel must be between 1 and 5')
      .max(5, 'anxietyLevel must be between 1 and 5'),
    sleepHours: z
      .number({ required_error: 'sleepHours is required' })
      .min(0, 'sleepHours cannot be negative')
      .max(24, 'sleepHours cannot exceed 24'),
    sleepQuality: z
      .number({ required_error: 'sleepQuality is required' })
      .int('sleepQuality must be an integer')
      .min(1, 'sleepQuality must be between 1 and 5')
      .max(5, 'sleepQuality must be between 1 and 5'),
    sleepDisturbances: z.string().max(500).nullable().optional(),
    activityType: z.string().max(100).nullable().optional(),
    activityDurationMin: z
      .number({ required_error: 'activityDurationMin is required' })
      .int('activityDurationMin must be an integer')
      .min(0, 'activityDurationMin cannot be negative')
      .max(1440, 'activityDurationMin cannot exceed 1440 (24 hours)'),
    socialFrequency: z
      .number({ required_error: 'socialFrequency is required' })
      .int('socialFrequency must be an integer')
      .min(1, 'socialFrequency must be between 1 and 5')
      .max(5, 'socialFrequency must be between 1 and 5'),
    stressLevel: z
      .number({ required_error: 'stressLevel is required' })
      .int('stressLevel must be an integer')
      .min(1, 'stressLevel must be between 1 and 5')
      .max(5, 'stressLevel must be between 1 and 5'),
    symptomsPresent: z.boolean({ required_error: 'symptomsPresent is required' }),
    symptomsSeverity: z
      .number()
      .int('symptomsSeverity must be an integer')
      .min(1, 'symptomsSeverity must be between 1 and 5')
      .max(5, 'symptomsSeverity must be between 1 and 5')
      .nullable()
      .optional(),
    symptomsNotes: z.string().max(1000).nullable().optional(),
  })
  .refine(
    (data) => {
      // If symptoms are present, severity should be provided
      if (data.symptomsPresent && !data.symptomsSeverity) {
        return false;
      }
      return true;
    },
    {
      message: 'symptomsSeverity is required when symptomsPresent is true',
      path: ['symptomsSeverity'],
    }
  );

export type CreateLogInput = z.infer<typeof createLogSchema>;

/** Schema for GET /api/logs query parameters */
export const getLogsQuerySchema = z.object({
  period: z.enum(['week', 'month']).default('week'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be in YYYY-MM-DD format')
    .optional(),
});

export type GetLogsQuery = z.infer<typeof getLogsQuerySchema>;
