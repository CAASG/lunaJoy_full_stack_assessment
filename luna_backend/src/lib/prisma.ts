/**
 * @module prisma
 * @description Singleton Prisma client instance shared across the application.
 * Using a singleton prevents multiple database connections during development
 * with hot-reload (nodemon/tsx), which would exhaust SQLite file locks.
 */

import { PrismaClient } from '../generated/prisma';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Shared Prisma client. Reuses the existing instance in development
 * to avoid connection leaks during hot-reload cycles.
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
