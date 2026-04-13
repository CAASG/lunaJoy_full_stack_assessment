/**
 * @module formatters
 * @description Utility functions for date formatting and data transformation.
 * Used by charts and UI components to display human-readable values.
 */

import { format, parseISO } from 'date-fns';

/**
 * Formats an ISO date string for chart axis display.
 * Returns short format like "Apr 12" for readability.
 */
export function formatChartDate(isoDate: string): string {
  // Defensive: guard against invalid date strings
  if (!isoDate?.trim()) return '';

  try {
    return format(parseISO(isoDate), 'MMM d');
  } catch {
    return isoDate;
  }
}

/**
 * Formats an ISO date string for display in form headers and cards.
 * Returns full format like "April 12, 2026".
 */
export function formatDisplayDate(isoDate: string): string {
  if (!isoDate?.trim()) return '';

  try {
    return format(parseISO(isoDate), 'MMMM d, yyyy');
  } catch {
    return isoDate;
  }
}

/**
 * Returns today's date as YYYY-MM-DD string.
 * Used as default date for the daily log form.
 */
export function getTodayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Transforms raw DailyLog entries into chart-ready data points.
 * Each point has a formatted date label and values for all trackable parameters.
 * Used with useMemo to avoid recomputation on every render.
 */
export function transformLogsForChart(
  logs: Array<{
    logDate: string;
    moodRating: number;
    anxietyLevel: number;
    sleepHours: number;
    sleepQuality: number;
    activityDurationMin: number;
    socialFrequency: number;
    stressLevel: number;
  }>
): Array<Record<string, string | number>> {
  // Defensive: return empty array for null/undefined input
  if (!logs?.length) return [];

  return logs.map((log) => ({
    date: formatChartDate(log.logDate),
    moodRating: log.moodRating,
    anxietyLevel: log.anxietyLevel,
    sleepHours: log.sleepHours,
    sleepQuality: log.sleepQuality,
    activityDurationMin: log.activityDurationMin,
    socialFrequency: log.socialFrequency,
    stressLevel: log.stressLevel,
  }));
}
