/**
 * P0 Fix 4: Database Connection Pooling
 * YAGNI: Use Vercel Postgres (managed pooling). No custom PgBouncer setup.
 */
import { PrismaClient } from '@prisma/client';
export declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export default prisma;
//# sourceMappingURL=db.d.ts.map