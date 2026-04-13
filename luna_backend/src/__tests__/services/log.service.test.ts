/**
 * @module log.service.test
 * @description Unit tests for the log service. Tests defensive validation
 * and error handling in createLog and getLogs.
 */

import { describe, it, expect, vi } from 'vitest';

// Mock env and prisma before importing the service
vi.mock('../../config/env.js', () => ({
  env: {
    PORT: '3001',
    NODE_ENV: 'test',
    GOOGLE_CLIENT_ID: 'test-client-id',
    JWT_SECRET: 'test-jwt-secret-16chars',
    LOG_LEVEL: 'silent',
  },
}));

vi.mock('../../lib/prisma.js', () => ({
  prisma: {
    dailyLog: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

const { createLog, getLogs } = await import('../../services/log.service.js');

describe('log.service', () => {
  describe('createLog', () => {
    it('returns error for empty userId', async () => {
      const result = await createLog('', {
        logDate: '2026-04-12',
        moodRating: 3,
        anxietyLevel: 2,
        sleepHours: 7,
        sleepQuality: 3,
        activityDurationMin: 0,
        socialFrequency: 3,
        stressLevel: 2,
        symptomsPresent: false,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('VALIDATION_ERROR');
        expect(result.error.statusCode).toBe(400);
      }
    });

    it('returns error for whitespace-only userId', async () => {
      const result = await createLog('   ', {
        logDate: '2026-04-12',
        moodRating: 3,
        anxietyLevel: 2,
        sleepHours: 7,
        sleepQuality: 3,
        activityDurationMin: 0,
        socialFrequency: 3,
        stressLevel: 2,
        symptomsPresent: false,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('VALIDATION_ERROR');
      }
    });
  });

  describe('getLogs', () => {
    it('returns error for empty userId', async () => {
      const result = await getLogs('', 'week');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('VALIDATION_ERROR');
        expect(result.error.statusCode).toBe(400);
      }
    });
  });
});
