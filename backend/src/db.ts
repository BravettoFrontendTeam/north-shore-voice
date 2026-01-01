/**
 * P0 Fix 4: Database Connection Pooling
 * YAGNI: Use Vercel Postgres (managed pooling). No custom PgBouncer setup.
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// P0 Fix 4: Serverless-friendly connection pool
// Vercel Postgres includes PgBouncer, so we use 1 connection per function instance
export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  // Connection limit handled by Vercel Postgres pooling
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;

