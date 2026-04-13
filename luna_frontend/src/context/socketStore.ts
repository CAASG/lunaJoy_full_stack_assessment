/**
 * @module socketStore
 * @description External store for Socket.io connection management.
 * Follows the useSyncExternalStore contract (subscribe + getSnapshot).
 * Separated from SocketContext.tsx to satisfy react-refresh rules.
 *
 * On 'log:created' / 'log:updated' events, invalidates TanStack Query
 * cache so useQuery hooks auto-refetch → charts re-render in real-time.
 */

import { io, Socket } from 'socket.io-client';
import { QueryClient } from '@tanstack/react-query';

/** State snapshot exposed to subscribers */
export interface SocketState {
  connected: boolean;
  lastEvent: string | null;
  lastEventTime: number | null;
}

/**
 * Creates an external store for managing the Socket.io connection.
 *
 * @param queryClient - TanStack QueryClient for cache invalidation on events
 */
export function createSocketStore(queryClient: QueryClient) {
  let socket: Socket | null = null;
  let state: SocketState = { connected: false, lastEvent: null, lastEventTime: null };
  const listeners = new Set<() => void>();

  /** Notifies all useSyncExternalStore subscribers of a state change */
  function emitChange() {
    listeners.forEach((listener) => listener());
  }

  /** Updates state immutably and notifies subscribers */
  function setState(partial: Partial<SocketState>) {
    state = { ...state, ...partial };
    emitChange();
  }

  return {
    /**
     * Opens a socket connection with JWT auth.
     * Registers event listeners for connection lifecycle and log events.
     */
    connect(token: string) {
      // Defensive: don't create duplicate connections
      if (socket?.connected) return;

      const apiUrl = import.meta.env.VITE_API_URL ?? '';

      socket = io(apiUrl, {
        auth: { token },
        transports: ['websocket', 'polling'],
      });

      socket.on('connect', () => {
        setState({ connected: true });
      });

      socket.on('disconnect', () => {
        setState({ connected: false });
      });

      // Real-time log updates: invalidate query cache so charts refetch
      socket.on('log:created', () => {
        setState({ lastEvent: 'log:created', lastEventTime: Date.now() });
        queryClient.invalidateQueries({ queryKey: ['logs'] });
      });

      socket.on('log:updated', () => {
        setState({ lastEvent: 'log:updated', lastEventTime: Date.now() });
        queryClient.invalidateQueries({ queryKey: ['logs'] });
      });
    },

    /** Cleanly disconnects the socket */
    disconnect() {
      if (socket) {
        socket.disconnect();
        socket = null;
        setState({ connected: false, lastEvent: null, lastEventTime: null });
      }
    },

    /** useSyncExternalStore subscribe callback */
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    /** useSyncExternalStore getSnapshot callback */
    getSnapshot(): SocketState {
      return state;
    },

    /** Returns whether the socket is currently connected */
    isConnected() {
      return socket?.connected ?? false;
    },
  };
}

/** Module-level singleton — lazy initialized */
let storeInstance: ReturnType<typeof createSocketStore> | null = null;

/**
 * Returns the socket store singleton. Creates it on first call.
 * Receives queryClient to wire socket events to cache invalidation.
 */
export function getSocketStore(queryClient: QueryClient) {
  if (!storeInstance) {
    storeInstance = createSocketStore(queryClient);
  }
  return storeInstance;
}
