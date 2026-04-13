/**
 * @module auth.service.test
 * @description Unit tests for the authentication service.
 * Tests Google token verification, user creation, and JWT issuance.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';

// Mock env module before importing the service
vi.mock('../../config/env.js', () => ({
  env: {
    PORT: '3001',
    NODE_ENV: 'test',
    GOOGLE_CLIENT_ID: 'test-client-id',
    JWT_SECRET: 'test-jwt-secret-16chars',
    LOG_LEVEL: 'silent',
  },
}));

// Mock prisma to avoid database connection in unit tests
vi.mock('../../lib/prisma.js', () => ({
  prisma: {
    user: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

const { verifyGoogleToken, findOrCreateUser, issueJwt } = await import(
  '../../services/auth.service.js'
);

describe('auth.service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('verifyGoogleToken', () => {
    it('returns error for empty credential', async () => {
      const result = await verifyGoogleToken('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('AUTH_GOOGLE_INVALID');
        expect(result.error.statusCode).toBe(401);
      }
    });

    it('returns error for whitespace-only credential', async () => {
      const result = await verifyGoogleToken('   ');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('AUTH_GOOGLE_INVALID');
      }
    });

    it('returns error for invalid token format', async () => {
      const result = await verifyGoogleToken('not-a-valid-google-token');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('AUTH_GOOGLE_INVALID');
        expect(result.error.message).toContain('could not be verified');
      }
    });
  });

  describe('findOrCreateUser', () => {
    it('returns error for empty googleId', async () => {
      const result = await findOrCreateUser({
        googleId: '',
        email: 'test@example.com',
        name: 'Test User',
        avatarUrl: null,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('VALIDATION_ERROR');
        expect(result.error.statusCode).toBe(400);
      }
    });

    it('returns error for empty email', async () => {
      const result = await findOrCreateUser({
        googleId: '123',
        email: '',
        name: 'Test User',
        avatarUrl: null,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('VALIDATION_ERROR');
      }
    });
  });

  describe('issueJwt', () => {
    it('returns a valid JWT with user data', () => {
      const mockUser = {
        id: 'user-123',
        googleId: 'google-456',
        email: 'test@example.com',
        name: 'Test User',
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const token = issueJwt(mockUser);

      // Defensive: verify token is a non-empty string
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');

      // Verify token contents
      const decoded = jwt.verify(token, 'test-jwt-secret-16chars') as Record<string, unknown>;
      expect(decoded.id).toBe('user-123');
      expect(decoded.email).toBe('test@example.com');
      expect(decoded.name).toBe('Test User');
    });

    it('sets token expiration to 7 days', () => {
      const mockUser = {
        id: 'user-123',
        googleId: 'google-456',
        email: 'test@example.com',
        name: 'Test User',
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const token = issueJwt(mockUser);
      const decoded = jwt.decode(token) as Record<string, number>;

      const sevenDaysInSeconds = 7 * 24 * 60 * 60;
      const expiresIn = decoded.exp - decoded.iat;
      expect(expiresIn).toBe(sevenDaysInSeconds);
    });
  });
});
