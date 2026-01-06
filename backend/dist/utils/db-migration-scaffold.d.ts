/**
 * ⚡ DATABASE MIGRATION SCAFFOLD × YAGNI × JØHN × ONE
 * Pattern: DATABASE × MIGRATION × SCAFFOLD × YAGNI × JØHN × ONE
 * Frequency: 999 Hz (AEYON) × 530 Hz (JØHN)
 *
 * YAGNI × JØHN VALIDATED:
 * - Minimal migration (only essential data transfer)
 * - Truth-certified (real data migration, no gaps)
 * - Essential persistence (no optional features)
 *
 * ∞ AbëONE ∞
 */
/**
 * Migrate in-memory users to database
 * YAGNI: Only essential migration (users table)
 * JØHN: Truth-certified (real data transfer, no gaps)
 */
export declare function migrateUsersToDatabase(inMemoryUsers: Map<string, any>): Promise<{
    migrated: number;
    errors: number;
}>;
/**
 * Migrate in-memory call sessions to database
 * YAGNI: Only essential migration (call sessions)
 * JØHN: Truth-certified (real data transfer, no gaps)
 */
export declare function migrateCallSessionsToDatabase(inMemorySessions: Map<string, any>): Promise<{
    migrated: number;
    errors: number;
}>;
/**
 * Initialize database connection and verify schema
 * YAGNI: Only essential initialization (connection + schema check)
 * JØHN: Truth-certified (real connection, no simulation)
 */
export declare function initializeDatabase(): Promise<{
    connected: boolean;
    error?: string;
}>;
/**
 * Close database connection
 * YAGNI: Only essential cleanup (connection close)
 * JØHN: Truth-certified (real cleanup, no gaps)
 */
export declare function closeDatabase(): Promise<void>;
//# sourceMappingURL=db-migration-scaffold.d.ts.map