/**
 * @module socket
 * @description Socket.io server setup with JWT authentication middleware.
 * Each authenticated socket joins a private room keyed by userId,
 * enabling targeted event emission from controllers after log mutations.
 */

import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';
import type { JwtPayload } from '../services/auth.service.js';

/**
 * Initializes Socket.io on the given HTTP server.
 * Configures CORS, JWT auth middleware, and room management.
 *
 * @param httpServer - The Node.js HTTP server (shared with Express)
 * @returns The configured Socket.io Server instance
 */
export function initializeSocketServer(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Auth middleware: verify JWT from handshake before allowing connection
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    // Defensive: ensure token exists and is a string
    if (!token || typeof token !== 'string') {
      logger.warn({ socketId: socket.id }, 'Socket connection rejected: no auth token');
      next(new Error('Authentication required. Provide a valid JWT in handshake.auth.token.'));
      return;
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

      // Defensive: verify decoded payload has the required user ID
      if (!decoded.id) {
        next(new Error('Invalid token payload: missing user ID.'));
        return;
      }

      // Attach user data to socket for downstream use
      socket.data.userId = decoded.id;
      socket.data.email = decoded.email;
      next();
    } catch {
      logger.warn({ socketId: socket.id }, 'Socket connection rejected: invalid JWT');
      next(new Error('Authentication failed. Token is invalid or expired.'));
    }
  });

  // Connection handler: join user-specific room
  io.on('connection', (socket) => {
    const userId = socket.data.userId as string;
    const room = `user:${userId}`;

    socket.join(room);
    logger.info({ socketId: socket.id, userId, room }, 'Socket connected and joined room');

    socket.on('disconnect', (reason) => {
      logger.info({ socketId: socket.id, userId, reason }, 'Socket disconnected');
    });
  });

  return io;
}
