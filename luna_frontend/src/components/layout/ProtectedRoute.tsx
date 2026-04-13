/**
 * @module ProtectedRoute
 * @description Route guard that redirects unauthenticated users to the login page.
 * Checks auth state from context (initialized from localStorage, no useEffect).
 * Wraps protected pages to enforce authentication.
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Renders child routes if authenticated, redirects to /login otherwise.
 * Uses Outlet pattern for nested route rendering.
 */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
