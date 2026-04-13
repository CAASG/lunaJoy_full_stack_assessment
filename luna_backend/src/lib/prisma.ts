/**
 * @module prisma
 * @description Singleton Prisma client instance shared across the application.
 * Uses @prisma/adapter-pg for PostgreSQL (Supabase) with Prisma 7.
 * Singleton pattern prevents connection leaks during hot-reload in development.
 */

import pg from 'pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient> | undefined;
};

/**
 * Creates the Prisma client with the pg adapter for PostgreSQL.
 * Reads DATABASE_URL from environment for connection.
 */
function createPrismaClient(): InstanceType<typeof PrismaClient> {
  // Defensive: ensure DATABASE_URL is set
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set. Check your .env file.');
  }

  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

/**
 * Shared Prisma client. Reuses the existing instance in development
 * to avoid connection leaks during hot-reload cycles.
 */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
