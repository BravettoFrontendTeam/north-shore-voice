"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordFailure = recordFailure;
exports.getRecentFailures = getRecentFailures;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const FAIL_DIR = path_1.default.resolve(__dirname, '..', '..', 'data');
const FAIL_FILE = path_1.default.join(FAIL_DIR, 'failures.log');
function ensureDir(dir) {
    if (!fs_1.default.existsSync(dir))
        fs_1.default.mkdirSync(dir, { recursive: true });
}
ensureDir(FAIL_DIR);
function recordFailure(service, kind, message, metadata = {}) {
    try {
        const rec = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            timestamp: new Date().toISOString(),
            service,
            kind,
            message: typeof message === 'string' ? message : JSON.stringify(message),
            metadata,
        };
        fs_1.default.appendFileSync(FAIL_FILE, JSON.stringify(rec) + '\n', 'utf-8');
        return rec;
    }
    catch (e) {
        // best-effort; swallow so it doesn't mask original errors
        console.error('Failed to write failure record', e);
        return null;
    }
}
function getRecentFailures(limit = 50) {
    try {
        if (!fs_1.default.existsSync(FAIL_FILE))
            return [];
        const lines = fs_1.default.readFileSync(FAIL_FILE, 'utf-8').trim().split('\n').filter(Boolean);
        const last = lines.slice(-limit);
        return last.map(l => JSON.parse(l)).reverse(); // newest first
    }
    catch (e) {
        console.error('Failed to read failures file', e);
        return [];
    }
}
exports.default = { recordFailure, getRecentFailures };
//# sourceMappingURL=failure-store.js.map