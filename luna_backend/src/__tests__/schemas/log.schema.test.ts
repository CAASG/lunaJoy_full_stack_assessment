/**
 * @module log.schema.test
 * @description Tests for Zod validation schemas used in log endpoints.
 * Verifies that valid data passes and invalid data is rejected with
 * descriptive error messages per field.
 */

import { describe, it, expect } from 'vitest';
import { createLogSchema, getLogsQuerySchema } from '../../schemas/log.schema.js';

/** Helper: valid log payload for reuse across tests */
function validPayload() {
  return {
    logDate: '2026-04-12',
    moodRating: 4,
    anxietyLevel: 2,
    sleepHours: 7.5,
    sleepQuality: 4,
    sleepDisturbances: null,
    activityType: 'Yoga',
    activityDurationMin: 30,
    socialFrequency: 3,
    stressLevel: 2,
    symptomsPresent: false,
    symptomsSeverity: null,
    symptomsNotes: null,
  };
}

describe('createLogSchema', () => {
  it('accepts a valid complete payload', () => {
    const result = createLogSchema.safeParse(validPayload());
    expect(result.success).toBe(true);
  });

  it('accepts payload with symptoms present and severity', () => {
    const result = createLogSchema.safeParse({
      ...validPayload(),
      symptomsPresent: true,
      symptomsSeverity: 3,
      symptomsNotes: 'Feeling anxious',
    });
    expect(result.success).toBe(true);
  });

  it('rejects moodRating out of range (too high)', () => {
    const result = createLogSchema.safeParse({ ...validPayload(), moodRating: 8 });
    expect(result.success).toBe(false);
  });

  it('rejects moodRating out of range (too low)', () => {
    const result = createLogSchema.safeParse({ ...validPayload(), moodRating: 0 });
    expect(result.success).toBe(false);
  });

  it('rejects non-integer moodRating', () => {
    const result = createLogSchema.safeParse({ ...validPayload(), moodRating: 3.5 });
    expect(result.success).toBe(false);
  });

  it('rejects sleepHours exceeding 24', () => {
    const result = createLogSchema.safeParse({ ...validPayload(), sleepHours: 25 });
    expect(result.success).toBe(false);
  });

  it('rejects negative sleepHours', () => {
    const result = createLogSchema.safeParse({ ...validPayload(), sleepHours: -1 });
    expect(result.success).toBe(false);
  });

  it('rejects activityDurationMin exceeding 1440', () => {
    const result = createLogSchema.safeParse({ ...validPayload(), activityDurationMin: 1500 });
    expect(result.success).toBe(false);
  });

  it('rejects invalid logDate format', () => {
    const result = createLogSchema.safeParse({ ...validPayload(), logDate: '04/12/2026' });
    expect(result.success).toBe(false);
  });

  it('rejects missing required fields', () => {
    const result = createLogSchema.safeParse({ logDate: '2026-04-12' });
    expect(result.success).toBe(false);
  });

  it('rejects symptomsPresent=true without symptomsSeverity', () => {
    const result = createLogSchema.safeParse({
      ...validPayload(),
      symptomsPresent: true,
      symptomsSeverity: null,
    });
    expect(result.success).toBe(false);
  });
});

describe('getLogsQuerySchema', () => {
  it('accepts valid period=week', () => {
    const result = getLogsQuerySchema.safeParse({ period: 'week' });
    expect(result.success).toBe(true);
  });

  it('accepts valid period=month with date', () => {
    const result = getLogsQuerySchema.safeParse({ period: 'month', date: '2026-04-12' });
    expect(result.success).toBe(true);
  });

  it('defaults period to week when omitted', () => {
    const result = getLogsQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.period).toBe('week');
    }
  });

  it('rejects invalid period value', () => {
    const result = getLogsQuerySchema.safeParse({ period: 'year' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid date format', () => {
    const result = getLogsQuerySchema.safeParse({ period: 'week', date: 'not-a-date' });
    expect(result.success).toBe(false);
  });
});
