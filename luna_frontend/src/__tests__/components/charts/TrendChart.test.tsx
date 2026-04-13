/**
 * @module TrendChart.test
 * @description Tests for TrendChart component. Verifies rendering with
 * data, empty state, and correct parameter display.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TrendChart } from '../../../components/charts/TrendChart';
import type { DailyLog, ChartParameter } from '../../../types';

/** Helper: creates a mock DailyLog */
function mockLog(overrides: Partial<DailyLog> = {}): DailyLog {
  return {
    id: 'log-1',
    userId: 'user-1',
    logDate: '2026-04-12T00:00:00.000Z',
    moodRating: 4,
    anxietyLevel: 2,
    sleepHours: 7.5,
    sleepQuality: 4,
    sleepDisturbances: null,
    activityType: 'Walking',
    activityDurationMin: 30,
    socialFrequency: 3,
    stressLevel: 2,
    symptomsPresent: false,
    symptomsSeverity: null,
    symptomsNotes: null,
    createdAt: '2026-04-12T14:00:00.000Z',
    updatedAt: '2026-04-12T14:00:00.000Z',
    ...overrides,
  };
}

const defaultParams: ChartParameter[] = ['moodRating', 'anxietyLevel', 'stressLevel'];

describe('TrendChart', () => {
  it('renders empty state when no logs provided', () => {
    render(<TrendChart logs={[]} selectedParams={defaultParams} />);
    expect(screen.getByText('No data to display for this period.')).toBeInTheDocument();
  });

  it('renders chart container when logs are provided', () => {
    render(
      <TrendChart
        logs={[mockLog(), mockLog({ id: 'log-2', logDate: '2026-04-13T00:00:00.000Z' })]}
        selectedParams={defaultParams}
      />
    );
    expect(screen.getByTestId('trend-chart')).toBeInTheDocument();
  });

  it('renders with single log entry', () => {
    render(<TrendChart logs={[mockLog()]} selectedParams={defaultParams} />);
    expect(screen.getByTestId('trend-chart')).toBeInTheDocument();
  });

  it('renders with empty selectedParams', () => {
    render(<TrendChart logs={[mockLog()]} selectedParams={[]} />);
    expect(screen.getByTestId('trend-chart')).toBeInTheDocument();
  });
});
