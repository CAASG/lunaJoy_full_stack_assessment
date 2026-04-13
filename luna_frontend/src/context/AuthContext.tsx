/**
 * @module AuthContext
 * @description Authentication state management using React Context.
 * Handles Google OAuth login, JWT storage, and user session.
 *
 * IMPORTANT: No useEffect is used. Auth state is initialized from
 * localStorage synchronously, and Google login uses the onSuccess
 * callback pattern provided by @react-oauth/google.
 */

import { useCallback, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import { apiClient } from '../api/client';
import type { User, AuthState } from '../types';
import { AuthContext } from './authContextValue';
import type { AuthContextValue } from './authContextValue';

/** Actions for the auth reducer */
type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

/**
 * Reads initial auth state from localStorage.
 * This runs synchronously during module load, avoiding useEffect.
 */
function getInitialState(): AuthState & { isLoading: boolean } {
  const token = localStorage.getItem('luna_token');
  const userJson = localStorage.getItem('luna_user');

  // Defensive: verify both token and user data exist and are parseable
  if (!token?.trim() || !userJson?.trim()) {
    return { user: null, token: null, isAuthenticated: false, isLoading: false };
  }

  try {
    const user = JSON.parse(userJson) as User;

    // Defensive: verify parsed user has required fields
    if (!user.id || !user.email) {
      localStorage.removeItem('luna_token');
      localStorage.removeItem('luna_user');
      return { user: null, token: null, isAuthenticated: false, isLoading: false };
    }

    return { user, token, isAuthenticated: true, isLoading: false };
  } catch {
    // Corrupted data in localStorage - clean up
    localStorage.removeItem('luna_token');
    localStorage.removeItem('luna_user');
    return { user: null, token: null, isAuthenticated: false, isLoading: false };
  }
}

function authReducer(
  state: AuthState & { isLoading: boolean },
  action: AuthAction
): AuthState & { isLoading: boolean } {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provides authentication state and actions to the component tree.
 * Uses useReducer for state management (no useEffect).
 *
 * Login flow:
 * 1. Google OAuth returns a credential token via onSuccess callback
 * 2. We send it to POST /api/auth/google
 * 3. Backend verifies with Google, returns JWT + user
 * 4. We store both in localStorage and update state
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, undefined, getInitialState);

  const login = useCallback(async (credential: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await apiClient.post<{ token: string; user: User }>(
        '/auth/google',
        { credential }
      );

      const { token, user } = response.data;

      // Persist auth data for page reloads
      localStorage.setItem('luna_token', token);
      localStorage.setItem('luna_user', JSON.stringify(user));

      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    } catch {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw new Error('Authentication failed. Please try again.');
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('luna_token');
    localStorage.removeItem('luna_user');
    dispatch({ type: 'LOGOUT' });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      logout,
    }),
    [state, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
