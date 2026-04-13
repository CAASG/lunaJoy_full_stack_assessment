/**
 * @module App
 * @description Root application component. Sets up all providers
 * (Google OAuth, TanStack Query, Auth) and defines the route structure.
 * Protected routes require authentication; public routes don't.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { Navbar } from './components/layout/Navbar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { DailyLogPage } from './pages/DailyLogPage';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

/**
 * Layout wrapper for authenticated pages.
 * Renders Navbar + page content with consistent padding.
 */
function AuthenticatedLayout() {
  return (
    <div className="min-h-screen bg-luna-cream">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <ErrorBoundary>
          <Routes>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="log" element={<DailyLogPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ErrorBoundary>
      </main>
    </div>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/*" element={<AuthenticatedLayout />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#FFF8F0',
                color: '#374151',
                border: '1px solid #F5EDE3',
              },
            }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
