/**
 * @module useAuth
 * @description Convenience hook for accessing authentication context.
 * Throws a descriptive error if used outside of AuthProvider,
 * preventing silent null reference bugs.
 */

import { useContext } from 'react';
import { AuthContext } from '../context/authContextValue';

/**
 * Returns the current authentication state and actions.
 * Must be used within an AuthProvider component tree.
 *
 * @throws Error if called outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);

  // Defensive: ensure hook is used within provider
  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider. ' +
      'Wrap your component tree with <AuthProvider>.'
    );
  }

  return context;
}
