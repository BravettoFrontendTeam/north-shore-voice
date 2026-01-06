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
exports.getEmpathyConfig = getEmpathyConfig;
exports.setEmpathyConfig = setEmpathyConfig;
exports.getAbeKeys = getAbeKeys;
exports.setAbeKeys = setAbeKeys;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const DATA_DIR = path.resolve(__dirname, '..', '..', 'data');
const EMPATHY_DIR = path.join(DATA_DIR, 'empathy-configs');
const ABE_KEYS_DIR = path.join(DATA_DIR, 'abekeys');
function ensureDir(dir) {
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir, { recursive: true });
}
ensureDir(EMPATHY_DIR);
ensureDir(ABE_KEYS_DIR);
function getEmpathyConfig(facilityId) {
    const file = path.join(EMPATHY_DIR, `${facilityId}.json`);
    if (!fs.existsSync(file))
        return null;
    try {
        return JSON.parse(fs.readFileSync(file, 'utf-8'));
    }
    catch (e) {
        return null;
    }
}
function setEmpathyConfig(facilityId, config) {
    const file = path.join(EMPATHY_DIR, `${facilityId}.json`);
    fs.writeFileSync(file, JSON.stringify(config, null, 2), 'utf-8');
}
function getAbeKeys(facilityId) {
    const file = path.join(ABE_KEYS_DIR, `${facilityId}.json`);
    if (process.env.AWS_SECRETS_ENABLED === 'true') {
        // In production, prefer SecretsManager (handled elsewhere)
        // Fall back to local file when not present
    }
    if (!fs.existsSync(file))
        return null;
    try {
        const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
        return data;
    }
    catch (e) {
        return null;
    }
}
function setAbeKeys(facilityId, keys) {
    const file = path.join(ABE_KEYS_DIR, `${facilityId}.json`);
    fs.writeFileSync(file, JSON.stringify(keys, null, 2), 'utf-8');
}
//# sourceMappingURL=admin-storage.js.map