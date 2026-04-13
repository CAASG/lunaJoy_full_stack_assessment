/**
 * @module useSocket
 * @description Hook to access socket connection state.
 * Uses useSyncExternalStore for reactive updates (no useEffect).
 * Separated from SocketContext to satisfy react-refresh rules.
 */

import { useSyncExternalStore, useCallback } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { getSocketStore } from '../context/socketStore';

/**
 * Returns the current socket connection state and a disconnect function.
 * Re-renders automatically when connection status or events change.
 *
 * @param queryClient - The TanStack QueryClient instance
 */
export function useSocketState(queryClient: QueryClient) {
  const store = getSocketStore(queryClient);

  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);

  const disconnect = useCallback(() => store.disconnect(), [store]);

  return { ...state, disconnect };
}
