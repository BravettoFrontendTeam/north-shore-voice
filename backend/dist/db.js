"use strict";
/**
 * P0 Fix 4: Database Connection Pooling
 * YAGNI: Use Vercel Postgres (managed pooling). No custom PgBouncer setup.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const globalForPrisma = global;
// P0 Fix 4: Serverless-friendly connection pool
// Vercel Postgres includes PgBouncer, so we use 1 connection per function instance
exports.prisma = globalForPrisma.prisma || new client_1.PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // Connection limit handled by Vercel Postgres pooling
});
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = exports.prisma;
}
exports.default = exports.prisma;
//# sourceMappingURL=db.js.map