/**
 * @module App
 * @description Root application component. Sets up providers (Google OAuth,
 * TanStack Query, React Router) and defines the route structure.
 * Detailed routing and protected routes will be added in Phase 2.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-luna-cream">
        <main className="mx-auto max-w-4xl px-4 py-8">
          <h1 className="text-3xl font-semibold text-luna-dark text-center">
            LunaJoy
          </h1>
          <p className="text-center text-luna-warm-gray mt-2">
            Mental Health Progress Tracker
          </p>
          <div className="mt-8 rounded-xl bg-white p-6 shadow-sm border border-luna-cream-dark text-center">
            <p className="text-luna-warm-gray">
              Phase 1 complete. Authentication coming in Phase 2.
            </p>
          </div>
        </main>
      </div>
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
    </QueryClientProvider>
  );
}

export default App;
