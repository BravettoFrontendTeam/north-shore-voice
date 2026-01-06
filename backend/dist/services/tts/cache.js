"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCacheKey = buildCacheKey;
exports.getCachedAudio = getCachedAudio;
exports.setCachedAudio = setCachedAudio;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
const CACHE_DIR = path.resolve(__dirname, '..', '..', 'data', 'tts-cache');
const DEFAULT_TTL_MS = Number(process.env.TTS_CACHE_TTL_MS || String(1000 * 60 * 60 * 24 * 30)); // 30 days
function ensureDir(dir) {
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir, { recursive: true });
}
ensureDir(CACHE_DIR);
function buildCacheKey(options) {
    const parts = [
        options.text || '',
        options.voice || '',
        options.provider || '',
        options.emotion || '',
        String(options.intensity || ''),
        options.pacing || '',
    ];
    const raw = parts.join('|');
    return crypto.createHash('sha256').update(raw).digest('hex');
}
const memCache = new Map();
function getCachedAudio(key) {
    // During unit tests, use an in-memory cache to keep tests hermetic but functional
    if (process.env.NODE_ENV === 'test') {
        const entry = memCache.get(key);
        if (!entry)
            return null;
        if (Date.now() - entry.createdAt > (entry.ttlMs || DEFAULT_TTL_MS)) {
            memCache.delete(key);
            return null;
        }
        return { audio_base64: entry.audio_base64, metadata: entry.metadata, createdAt: new Date(entry.createdAt).toISOString() };
    }
    const file = path.join(CACHE_DIR, `${key}.json`);
    if (!fs.existsSync(file))
        return null;
    try {
        const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const created = new Date(data.createdAt).getTime() || 0;
        if (Date.now() - created > (data.ttlMs || DEFAULT_TTL_MS)) {
            // expired
            try {
                fs.unlinkSync(file);
            }
            catch (e) { }
            return null;
        }
        return { audio_base64: data.audio_base64, metadata: data.metadata, createdAt: data.createdAt };
    }
    catch (e) {
        return null;
    }
}
function setCachedAudio(key, audio_base64, metadata = {}, ttlMs) {
    // During tests, populate an in-memory cache to allow assertions without touching the filesystem
    if (process.env.NODE_ENV === 'test') {
        memCache.set(key, { audio_base64, metadata: { ...metadata }, createdAt: Date.now(), ttlMs: ttlMs || DEFAULT_TTL_MS });
        return;
    }
    const file = path.join(CACHE_DIR, `${key}.json`);
    const payload = {
        audio_base64,
        metadata: { ...metadata },
        createdAt: new Date().toISOString(),
        ttlMs: ttlMs || DEFAULT_TTL_MS,
    };
    fs.writeFileSync(file, JSON.stringify(payload, null, 2), 'utf-8');
}
exports.default = { buildCacheKey, getCachedAudio, setCachedAudio };
//# sourceMappingURL=cache.js.map