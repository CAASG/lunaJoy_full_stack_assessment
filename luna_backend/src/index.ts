/**
 * @module index
 * @description Entry point for the LunaJoy backend server.
 * Sets up Express with CORS, JSON parsing, and routes.
 * Socket.io will be integrated in Phase 5 for real-time updates.
 */

import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { logger } from './lib/logger';

const app = express();
const PORT = parseInt(env.PORT, 10);

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  logger.info({ port: PORT, env: env.NODE_ENV }, 'LunaJoy backend server started');
});

export { app };
