/**
 * @module index
 * @description Entry point for the LunaJoy backend server.
 * Sets up Express with CORS, JSON parsing, authentication routes,
 * and the global error handler. Socket.io will be integrated in Phase 5.
 *
 * IMPORTANT: dotenv must be imported first to ensure environment variables
 * are available before any module reads process.env (e.g., Prisma, env.ts).
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import authRoutes from './routes/auth.routes.js';
import logRoutes from './routes/log.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = parseInt(env.PORT, 10);

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/log', logRoutes);
app.use('/api/logs', logRoutes);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info({ port: PORT, env: env.NODE_ENV }, 'LunaJoy backend server started');
});

export { app };
