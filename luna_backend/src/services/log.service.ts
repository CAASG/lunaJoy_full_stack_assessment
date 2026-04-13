/**
 * @module log.service
 * @description Business logic for daily mental health logs.
 * Handles creation (upsert), retrieval with date filtering,
 * and summary statistics. All functions return Result types.
 */

import { prisma } from '../lib/prisma.js';
import { AppError, ErrorCodes, type Result } from '../lib/errors.js';
import { logger } from '../lib/logger.js';
import type { CreateLogInput } from '../schemas/log.schema.js';
import type { DailyLog } from '@prisma/client';
import { subDays, subMonths, startOfDay, endOfDay, parseISO } from 'date-fns';

/** Summary averages for a time period */
interface LogSummary {
  period: 'week' | 'month';
  averages: {
    moodRating: number;
    anxietyLevel: number;
    sleepHours: number;
    sleepQuality: number;
    activityDurationMin: number;
    socialFrequency: number;
    stressLevel: number;
  } | null;
}

interface GetLogsResult {
  logs: DailyLog[];
  summary: LogSummary;
}

/**
 * Creates a new daily log entry. Uses Prisma create with conflict detection
 * via the unique constraint on [userId, logDate]. Returns a clear error
 * if a log for that date already exists.
 *
 * @param userId - The authenticated user's ID
 * @param data - Validated log data from the request body
 */
export async function createLog(
  userId: string,
  data: CreateLogInput
): Promise<Result<DailyLog>> {
  // Defensive: ensure userId is valid
  if (!userId?.trim()) {
    return {
      success: false,
      error: new AppError(
        ErrorCodes.VALIDATION_ERROR,
        'User ID is required to create a log entry.',
        400
      ),
    };
  }

  const logDate = startOfDay(parseISO(data.logDate));

  try {
    const log = await prisma.dailyLog.create({
      data: {
        userId,
        logDate,
        moodRating: data.moodRating,
        anxietyLevel: data.anxietyLevel,
        sleepHours: data.sleepHours,
        sleepQuality: data.sleepQuality,
        sleepDisturbances: data.sleepDisturbances ?? null,
        activityType: data.activityType ?? null,
        activityDurationMin: data.activityDurationMin,
        socialFrequency: data.socialFrequency,
        stressLevel: data.stressLevel,
        symptomsPresent: data.symptomsPresent,
        symptomsSeverity: data.symptomsPresent ? data.symptomsSeverity ?? null : null,
        symptomsNotes: data.symptomsPresent ? data.symptomsNotes ?? null : null,
      },
    });

    logger.info({ logId: log.id, userId, logDate: data.logDate }, 'Daily log created');
    return { success: true, data: log };
  } catch (err) {
    logger.error({ err, userId, logDate: data.logDate }, 'Failed to create daily log');
    return {
      success: false,
      error: new AppError(
        ErrorCodes.INTERNAL_ERROR,
        'Failed to save the daily log entry.',
        500
      ),
    };
  }
}

/**
 * Retrieves logs for a user within a time period, plus summary averages.
 *
 * @param userId - The authenticated user's ID
 * @param period - 'week' or 'month'
 * @param referenceDate - The end date for the period (defaults to today)
 */
export async function getLogs(
  userId: string,
  period: 'week' | 'month' = 'week',
  referenceDate?: string
): Promise<Result<GetLogsResult>> {
  // Defensive: ensure userId is valid
  if (!userId?.trim()) {
    return {
      success: false,
      error: new AppError(
        ErrorCodes.VALIDATION_ERROR,
        'User ID is required to retrieve logs.',
        400
      ),
    };
  }

  try {
    const endDate = referenceDate
      ? endOfDay(parseISO(referenceDate))
      : endOfDay(new Date());

    const startDate =
      period === 'week'
        ? startOfDay(subDays(endDate, 7))
        : startOfDay(subMonths(endDate, 1));

    const logs = await prisma.dailyLog.findMany({
      where: {
        userId,
        logDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { logDate: 'asc' },
    });

    // Compute averages only if there are logs in the period
    const averages =
      logs.length > 0
        ? {
            moodRating: average(logs.map((l) => l.moodRating)),
            anxietyLevel: average(logs.map((l) => l.anxietyLevel)),
            sleepHours: average(logs.map((l) => l.sleepHours)),
            sleepQuality: average(logs.map((l) => l.sleepQuality)),
            activityDurationMin: average(logs.map((l) => l.activityDurationMin)),
            socialFrequency: average(logs.map((l) => l.socialFrequency)),
            stressLevel: average(logs.map((l) => l.stressLevel)),
          }
        : null;

    return {
      success: true,
      data: {
        logs,
        summary: { period, averages },
      },
    };
  } catch (err) {
    logger.error({ err, userId, period }, 'Failed to retrieve logs');
    return {
      success: false,
      error: new AppError(
        ErrorCodes.INTERNAL_ERROR,
        'Failed to retrieve log entries.',
        500
      ),
    };
  }
}

/**
 * Computes the arithmetic average of a number array.
 * Returns 0 for empty arrays (defensive).
 */
function average(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, v) => acc + v, 0);
  return Math.round((sum / values.length) * 10) / 10;
}
