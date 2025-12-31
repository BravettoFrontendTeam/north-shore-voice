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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wss = exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = require("http");
const ws_1 = require("ws");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const auth_1 = __importDefault(require("./routes/auth"));
const voice_1 = __importDefault(require("./routes/voice"));
const calls_1 = __importDefault(require("./routes/calls"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const training_1 = __importDefault(require("./routes/training"));
const users_1 = __importDefault(require("./routes/users"));
const webhooks_1 = __importDefault(require("./routes/webhooks"));
const inbound_1 = __importStar(require("./routes/inbound"));
const outbound_1 = __importStar(require("./routes/outbound"));
const telephony_1 = __importStar(require("./routes/telephony"));
const websocket_1 = require("./services/websocket");
const abevoice_integration_1 = require("./services/abevoice-integration");
const app = (0, express_1.default)();
exports.app = app;
const server = (0, http_1.createServer)(app);
exports.server = server;
const wss = new ws_1.WebSocketServer({ server });
exports.wss = wss;
app.use((0, helmet_1.default)());
const allowedOrigins = new Set([
    'http://localhost:3000',
    'http://localhost:5000',
    process.env.CORS_ORIGIN || 'http://localhost:3000',
]);
app.use((0, cors_1.default)({
    origin: (origin, cb) => {
        if (!origin)
            return cb(null, true);
        if (allowedOrigins.has(origin))
            return cb(null, true);
        return cb(new Error('CORS not allowed'));
    },
    credentials: true,
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);
app.use('/api/webhooks', express_1.default.raw({ type: 'application/json' }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-session-secret-do-not-use-in-production';
app.use((0, express_session_1.default)({
    name: 'JSESSIONID',
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    },
}));
app.get('/api/status', (req, res) => {
    res.json({
        status: 'ok',
        online: true,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    });
});
app.use('/api/auth', auth_1.default);
app.use('/api/voice', voice_1.default);
app.use('/api/calls', calls_1.default);
app.use('/api/analytics', analytics_1.default);
app.use('/api/training', training_1.default);
app.use('/api/users', users_1.default);
app.use('/api/webhooks', webhooks_1.default);
app.use('/api', inbound_1.default);
app.use('/api', outbound_1.default);
app.use('/api/telephony', telephony_1.default);
(0, websocket_1.setupWebSocket)(wss);
(0, inbound_1.initializeInboundRoutes)(websocket_1.wsService, abevoice_integration_1.abevoiceIntegration);
(0, outbound_1.initializeOutboundRoutes)(websocket_1.wsService, abevoice_integration_1.abevoiceIntegration);
(0, telephony_1.initializeTelephony)();
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});
const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '127.0.0.1';
if (require.main === module) {
    server.listen(PORT, HOST, () => {
        console.log(`Server running on http://${HOST}:${PORT}`);
    });
}
//# sourceMappingURL=index.js.map