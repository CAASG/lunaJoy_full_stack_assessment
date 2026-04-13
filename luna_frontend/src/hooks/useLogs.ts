/**
 * @module useLogs
 * @description Hook for fetching daily logs using TanStack Query.
 * No useEffect — data fetching, caching, and refetching are handled
 * entirely by useQuery. The queryKey changes when period or date change,
 * triggering an automatic refetch.
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { LogsResponse } from '../types';

interface UseLogsOptions {
  period: 'week' | 'month';
  date?: string;
  enabled?: boolean;
}

/**
 * Fetches logs and summary for the authenticated user.
 * Refetches automatically when period or date changes.
 *
 * @param options.period - 'week' or 'month' time window
 * @param options.date - Reference date in YYYY-MM-DD format (defaults to today on server)
 * @param options.enabled - Whether to enable the query (defaults to true)
 */
export function useLogs({ period, date, enabled = true }: UseLogsOptions) {
  return useQuery<LogsResponse>({
    queryKey: ['logs', period, date],
    queryFn: async () => {
      const params = new URLSearchParams({ period });
      if (date) params.set('date', date);

      const response = await apiClient.get<LogsResponse>(`/logs?${params.toString()}`);
      return response.data;
    },
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}
