/**
 * @module auth.schema.test
 * @description Tests for Zod validation schemas used in auth endpoints.
 * Verifies that invalid inputs are rejected with clear error messages.
 */

import { describe, it, expect } from 'vitest';
import { googleAuthSchema } from '../../schemas/auth.schema.js';

describe('googleAuthSchema', () => {
  it('accepts valid credential string', () => {
    const result = googleAuthSchema.safeParse({ credential: 'valid-token-string' });
    expect(result.success).toBe(true);
  });

  it('rejects missing credential field', () => {
    const result = googleAuthSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('rejects empty credential string', () => {
    const result = googleAuthSchema.safeParse({ credential: '' });
    expect(result.success).toBe(false);
  });

  it('rejects non-string credential', () => {
    const result = googleAuthSchema.safeParse({ credential: 123 });
    expect(result.success).toBe(false);
  });

  it('rejects null credential', () => {
    const result = googleAuthSchema.safeParse({ credential: null });
    expect(result.success).toBe(false);
  });
});
