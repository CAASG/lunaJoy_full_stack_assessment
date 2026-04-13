/**
 * @module authContextValue
 * @description Auth context definition and types, separated from the
 * provider component to satisfy react-refresh's single-export rule.
 */

import { createContext } from 'react';
import type { AuthState } from '../types';

export interface AuthContextValue extends AuthState {
  isLoading: boolean;
  login: (credential: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
