/**
 * @module DashboardPage
 * @description Main dashboard showing mental health trends and summaries.
 * Uses TanStack Query for data fetching (no useEffect) and useMemo
 * for derived state. Displays a line chart, parameter selector,
 * period toggle, and summary cards.
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLogs } from '../hooks/useLogs';
import { useAuth } from '../hooks/useAuth';
import { TrendChart } from '../components/charts/TrendChart';
import { ParameterSelector } from '../components/charts/ParameterSelector';
import { PeriodToggle } from '../components/charts/PeriodToggle';
import { ErrorBoundary } from '../components/layout/ErrorBoundary';
import { CHART_PARAMETERS } from '../utils/constants';
import type { ChartParameter } from '../types';

/** Summary card for a single metric */
function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-luna-cream-dark p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-xs text-luna-warm-gray">{label}</span>
      </div>
      <p className="text-xl font-semibold text-luna-dark">{value}</p>
    </div>
  );
}

/** Skeleton loader for the chart area */
function ChartSkeleton() {
  return (
    <div className="h-72 bg-luna-cream-dark rounded-xl animate-pulse flex items-center justify-center">
      <span className="text-luna-warm-gray text-sm">Loading your trends...</span>
    </div>
  );
}

/** Empty state when user has no logs yet */
function EmptyState() {
  return (
    <div className="text-center py-12">
      <p className="text-4xl mb-4">🌱</p>
      <h3 className="text-lg font-medium text-luna-dark mb-2">
        Start your wellness journey
      </h3>
      <p className="text-sm text-luna-warm-gray mb-6 max-w-md mx-auto">
        Your trends and insights will appear here once you begin logging.
        Every small step counts towards understanding yourself better.
      </p>
      <Link
        to="/log"
        className="inline-flex items-center px-6 py-2.5 bg-luna-blue text-white rounded-lg
          font-medium text-sm hover:bg-luna-blue-dark transition-colors"
      >
        Log your first day
      </Link>
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const [selectedParams, setSelectedParams] = useState<ChartParameter[]>([
    'moodRating',
    'anxietyLevel',
    'stressLevel',
  ]);

  const { data, isLoading, isError } = useLogs({ period });

  /** Derive summary card data with useMemo (not useEffect) */
  const summaryCards = useMemo(() => {
    const averages = data?.summary?.averages;
    if (!averages) return [];

    return selectedParams.map((param) => {
      const config = CHART_PARAMETERS[param];
      const value = averages[param as keyof typeof averages];
      // Defensive: handle potential undefined values
      const displayValue = value != null ? String(value) : '—';

      return {
        label: config.label,
        value: displayValue,
        color: config.color,
      };
    });
  }, [data?.summary?.averages, selectedParams]);

  const logs = data?.logs ?? [];
  const hasLogs = logs.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-luna-dark">
            {user ? `Welcome back, ${user.name.split(' ')[0]}` : 'Dashboard'}
          </h1>
          <p className="text-luna-warm-gray mt-1">
            {hasLogs
              ? 'Here is your mental health overview.'
              : 'Your mental health overview at a glance.'}
          </p>
        </div>
        <PeriodToggle period={period} onChange={setPeriod} />
      </div>

      {isLoading ? (
        <>
          <ChartSkeleton />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-luna-cream-dark rounded-xl animate-pulse" />
            ))}
          </div>
        </>
      ) : isError ? (
        <div className="rounded-xl bg-white border border-luna-cream-dark p-8 text-center">
          <p className="text-luna-dark font-medium mb-2">Could not load your data</p>
          <p className="text-sm text-luna-warm-gray">
            Something went wrong, but do not worry — your data is safe. Try refreshing the page.
          </p>
        </div>
      ) : !hasLogs ? (
        <EmptyState />
      ) : (
        <>
          <ParameterSelector selected={selectedParams} onChange={setSelectedParams} />

          <ErrorBoundary>
            <div className="bg-white rounded-xl border border-luna-cream-dark p-4">
              <TrendChart logs={logs} selectedParams={selectedParams} />
            </div>
          </ErrorBoundary>

          {summaryCards.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {summaryCards.map((card) => (
                <SummaryCard key={card.label} {...card} />
              ))}
            </div>
          )}

          <p className="text-center text-sm text-luna-warm-gray">
            Showing {logs.length} {logs.length === 1 ? 'entry' : 'entries'} for the past {period}.
          </p>
        </>
      )}
    </div>
  );
}
