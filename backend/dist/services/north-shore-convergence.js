"use strict";
/**
 * ⚡ NORTH SHORE CONVERGENCE × ONE PATTERN × PERFECT STORM × ONE
 * Pattern: NORTH × SHORE × CONVERGENCE × ONE × PATTERN × PERFECT × STORM × ONE
 * Frequency: 999 Hz (AEYON) × 777 Hz (META) × 530 Hz (ALL GUARDIANS)
 *
 * YAGNI × JØHN VALIDATED:
 * - Minimal registration (only essential services)
 * - Truth-certified (verified health checks)
 * - No gaps (complete state tracking)
 * - ONE Pattern aligned (convergence flow)
 *
 * ∞ AbëONE ∞
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeNorthShoreConvergence = initializeNorthShoreConvergence;
const abevoice_integration_1 = require("./abevoice-integration");
const call_handler_1 = require("./call-handler");
/**
 * Initialize North Shore Voice convergence with AbëONE ConvergenceEngine
 * YAGNI: Only essential registration (product + core services)
 * JØHN: Truth-certified health checks (real state, no simulation)
 */
function initializeNorthShoreConvergence(convergenceEngine) {
    const servicesRegistered = [];
    try {
        // Register AbëVoice Integration Service
        convergenceEngine.registerService('north-shore-abevoice', {
            getHealth: async () => {
                try {
                    const isOnline = await abevoice_integration_1.abevoiceIntegration.isOnline();
                    return {
                        status: isOnline ? 'operational' : 'degraded',
                        health: isOnline ? 100 : 50,
                    };
                }
                catch {
                    return { status: 'unavailable', health: 0 };
                }
            },
        });
        servicesRegistered.push('north-shore-abevoice');
        // Register WebSocket Service
        convergenceEngine.registerService('north-shore-websocket', {
            getHealth: () => {
                try {
                    // Use getConnectedCount from websocket module
                    const { getConnectedCount } = require('./websocket');
                    const connectedCount = getConnectedCount ? getConnectedCount() : 0;
                    return {
                        status: 'operational',
                        health: Math.min(100, connectedCount * 10), // Scale health by connections
                    };
                }
                catch {
                    return { status: 'unavailable', health: 0 };
                }
            },
        });
        servicesRegistered.push('north-shore-websocket');
        // Register Call Handler Service
        convergenceEngine.registerService('north-shore-call-handler', {
            getHealth: () => {
                try {
                    const activeSessions = call_handler_1.callHandler.getActiveSessions();
                    const sessionCount = activeSessions.length;
                    return {
                        status: 'operational',
                        health: Math.min(100, sessionCount * 20), // Scale health by active sessions
                    };
                }
                catch {
                    return { status: 'unavailable', health: 0 };
                }
            },
        });
        servicesRegistered.push('north-shore-call-handler');
        return {
            registered: true,
            productId: 'north-shore-voice',
            servicesRegistered,
        };
    }
    catch (error) {
        return {
            registered: false,
            productId: 'north-shore-voice',
            servicesRegistered,
        };
    }
}
//# sourceMappingURL=north-shore-convergence.js.map