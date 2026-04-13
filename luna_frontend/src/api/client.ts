/**
 * @module client
 * @description Axios instance configured with JWT interceptor for authenticated
 * API calls. Automatically attaches the Bearer token from localStorage and
 * handles 401 responses by clearing auth state and redirecting to login.
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

/**
 * Pre-configured Axios instance for all API calls.
 * - Attaches JWT from localStorage on every request
 * - Intercepts 401 responses to clear stale tokens
 */
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('luna_token');

  // Defensive: only attach token if it exists and is non-empty
  if (token?.trim()) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor: handle expired/invalid tokens
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Clear stale auth data on any 401 response
      localStorage.removeItem('luna_token');
      localStorage.removeItem('luna_user');

      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
