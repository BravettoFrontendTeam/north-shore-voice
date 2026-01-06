"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateUsersToDatabase = migrateUsersToDatabase;
exports.migrateCallSessionsToDatabase = migrateCallSessionsToDatabase;
exports.initializeDatabase = initializeDatabase;
exports.closeDatabase = closeDatabase;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Migrate in-memory users to database
 * YAGNI: Only essential migration (users table)
 * JØHN: Truth-certified (real data transfer, no gaps)
 */
async function migrateUsersToDatabase(inMemoryUsers) {
    let migrated = 0;
    let errors = 0;
    for (const [userId, user] of inMemoryUsers.entries()) {
        try {
            await prisma.user.upsert({
                where: { id: userId },
                update: {
                    email: user.email,
                    name: user.name,
                    company: user.company || null,
                    plan: user.plan,
                },
                create: {
                    id: userId,
                    email: user.email,
                    password: user.password, // Already hashed
                    name: user.name,
                    company: user.company || null,
                    plan: user.plan,
                    createdAt: user.createdAt,
                },
            });
            migrated++;
        }
        catch (error) {
            console.error(`Failed to migrate user ${userId}:`, error);
            errors++;
        }
    }
    return { migrated, errors };
}
/**
 * Migrate in-memory call sessions to database
 * YAGNI: Only essential migration (call sessions)
 * JØHN: Truth-certified (real data transfer, no gaps)
 */
async function migrateCallSessionsToDatabase(inMemorySessions) {
    let migrated = 0;
    let errors = 0;
    for (const [sessionId, session] of inMemorySessions.entries()) {
        try {
            // Find or create user (required for foreign key)
            const userId = session.userId || 'system'; // Fallback to system user
            await prisma.callSession.upsert({
                where: { id: sessionId },
                update: {
                    status: session.status.toUpperCase(),
                    endTime: session.endTime || null,
                    duration: session.duration || null,
                },
                create: {
                    id: sessionId,
                    userId,
                    phoneNumber: session.phoneNumber,
                    direction: 'INBOUND', // Default, adjust as needed
                    status: session.status.toUpperCase(),
                    startTime: session.startTime,
                    endTime: session.endTime || null,
                    duration: session.duration || null,
                },
            });
            // Migrate transcript messages
            if (session.transcript && session.transcript.length > 0) {
                for (const message of session.transcript) {
                    await prisma.transcriptMessage.create({
                        data: {
                            callSessionId: sessionId,
                            speaker: message.speaker.toUpperCase() === 'AI' ? 'AI' : 'CALLER',
                            text: message.text,
                            confidence: message.confidence || null,
                            timestamp: message.timestamp,
                        },
                    });
                }
            }
            migrated++;
        }
        catch (error) {
            console.error(`Failed to migrate session ${sessionId}:`, error);
            errors++;
        }
    }
    return { migrated, errors };
}
/**
 * Initialize database connection and verify schema
 * YAGNI: Only essential initialization (connection + schema check)
 * JØHN: Truth-certified (real connection, no simulation)
 */
async function initializeDatabase() {
    try {
        await prisma.$connect();
        // Verify schema by querying a table
        await prisma.user.findFirst();
        return { connected: true };
    }
    catch (error) {
        return {
            connected: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}
/**
 * Close database connection
 * YAGNI: Only essential cleanup (connection close)
 * JØHN: Truth-certified (real cleanup, no gaps)
 */
async function closeDatabase() {
    await prisma.$disconnect();
}
//# sourceMappingURL=db-migration-scaffold.js.map