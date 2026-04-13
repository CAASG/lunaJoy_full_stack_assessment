/**
 * @module SocketContext
 * @description Socket.io provider component. Uses an external store
 * pattern (no useEffect) for managing the socket connection lifecycle.
 * The store logic lives in socketStore.ts, the hook in useSocket.ts.
 */

import type { ReactNode } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { getSocketStore } from './socketStore';

/**
 * Provider component that manages socket lifecycle based on auth state.
 * Connects when token is present, disconnects on logout.
 * No useEffect — synchronous checks during render.
 */
export function SocketProvider({
  token,
  queryClient,
  children,
}: {
  token: string | null;
  queryClient: QueryClient;
  children: ReactNode;
}) {
  const store = getSocketStore(queryClient);

  // Synchronous connect/disconnect based on token (no useEffect needed)
  if (token && !store.isConnected()) {
    store.connect(token);
  } else if (!token && store.isConnected()) {
    store.disconnect();
  }

  return <>{children}</>;
}
