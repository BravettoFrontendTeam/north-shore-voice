import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
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

// Import WebSocket handler
import { setupWebSocket, wsService } from './services/websocket';
import { abevoiceIntegration } from './services/abevoice-integration';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Body parsing (except for webhooks which need raw body)
app.use('/api/webhooks', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/webhooks', webhookRoutes);

// Inbound/Outbound call services (mount at /api for consistency with route definitions)
app.use('/api', inboundRoutes);
app.use('/api', outboundRoutes);

// Telephony multi-provider service
app.use('/api/telephony', telephonyRoutes);

// Setup WebSocket for real-time updates
setupWebSocket(wss);

// Initialize services
initializeInboundRoutes(wsService, abevoiceIntegration);
initializeOutboundRoutes(wsService, abevoiceIntegration);
initializeTelephony();

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🎤 North Shore Voice API Server                             ║
║                                                               ║
║   Server running on http://localhost:${PORT}                    ║
║   WebSocket on ws://localhost:${PORT}                           ║
║                                                               ║
║   Environment: ${process.env.NODE_ENV || 'development'}                             ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});

export { app, server, wss };

