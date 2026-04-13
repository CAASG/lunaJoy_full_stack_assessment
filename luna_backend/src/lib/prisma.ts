/**
 * @module prisma
 * @description Singleton Prisma client instance shared across the application.
 * Uses @prisma/adapter-libsql for SQLite compatibility with Prisma 7.
 * Singleton pattern prevents connection leaks during hot-reload in development.
 */

import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient> | undefined;
};

/**
 * Creates the Prisma client with the libSQL adapter for SQLite.
 * Reads DATABASE_URL from environment (set via .env and dotenv).
 */
function createPrismaClient(): InstanceType<typeof PrismaClient> {
  const libsql = createClient({
    url: process.env.DATABASE_URL ?? 'file:./prisma/dev.db',
  });
  const adapter = new PrismaLibSql(libsql);
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
