import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

dotenv.config();

// P0 Fix 4: Initialize database connection pool
import { prisma } from './db';

import authRoutes from './routes/auth';
import voiceRoutes from './routes/voice';
import callRoutes from './routes/calls';
import analyticsRoutes from './routes/analytics';
import trainingRoutes from './routes/training';
import userRoutes from './routes/users';
import webhookRoutes from './routes/webhooks';
import inboundRoutes, { initializeInboundRoutes } from './routes/inbound';
import outboundRoutes, { initializeOutboundRoutes } from './routes/outbound';
import telephonyRoutes, { initializeTelephony } from './routes/telephony';
import { setupWebSocket, wsService } from './services/websocket';
import { abevoiceIntegration } from './services/abevoice-integration';

// North Shore Convergence (optional - gracefully handle if ConvergenceEngine not available)
let northShoreConvergence: any = null;
try {
  // Try to initialize convergence if ConvergenceEngine is available
  // This will be called from app-factory if ConvergenceEngine exists
  const { initializeNorthShoreConvergence } = require('./services/north-shore-convergence');
  northShoreConvergence = initializeNorthShoreConvergence;
} catch (error) {
  // ConvergenceEngine not available - continue without it
  console.log('North Shore Convergence: ConvergenceEngine not available (continuing without convergence)');
}

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(helmet());

const allowedOrigins = new Set<string>([
  'http://localhost:3000',
  'http://localhost:5000',
  'https://bravetto.vip',
  'https://www.bravetto.vip',
  process.env.CORS_ORIGIN || 'http://localhost:3000',
]);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.has(origin)) return cb(null, true);
      return cb(new Error('CORS not allowed'));
    },
    credentials: true,
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

app.use('/api/webhooks', express.raw({ type: 'application/json' }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-session-secret-do-not-use-in-production';
app.use(
  session({
    name: 'JSESSIONID',
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  }),
);

app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    online: true,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api', inboundRoutes);
app.use('/api', outboundRoutes);
app.use('/api/telephony', telephonyRoutes);

setupWebSocket(wss);
initializeInboundRoutes(wsService, abevoiceIntegration);
initializeOutboundRoutes(wsService, abevoiceIntegration);
initializeTelephony();

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = Number(process.env.BACKEND_PORT || process.env.PORT) || 5000;
const HOST = process.env.BACKEND_HOST || process.env.HOST || '127.0.0.1';

if (require.main === module) {
  server.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
  });
}

export { app, server, wss };
