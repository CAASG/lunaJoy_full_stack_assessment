/**
 * @module TrendChart
 * @description Main visualization component using Recharts LineChart.
 * Renders up to 3 selected parameters as colored lines over time.
 * Data transformation uses useMemo (not useEffect) to avoid unnecessary
 * recomputation when unrelated state changes.
 */

import { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { CHART_PARAMETERS } from '../../utils/constants';
import { transformLogsForChart } from '../../utils/formatters';
import type { ChartParameter, DailyLog } from '../../types';

interface TrendChartProps {
  logs: DailyLog[];
  selectedParams: ChartParameter[];
}

/**
 * Renders a responsive line chart with one line per selected parameter.
 * Uses the calming LunaJoy color palette for visual consistency.
 */
export function TrendChart({ logs, selectedParams }: TrendChartProps) {
  // Transform logs into chart-ready data using useMemo (no useEffect)
  const chartData = useMemo(() => transformLogsForChart(logs), [logs]);

  // Determine Y-axis domain based on selected parameters
  const yDomain = useMemo(() => {
    // Defensive: default domain if no params selected
    if (selectedParams.length === 0) return [0, 5];

    const allMin = Math.min(...selectedParams.map((p) => CHART_PARAMETERS[p].min));
    const allMax = Math.max(...selectedParams.map((p) => CHART_PARAMETERS[p].max));
    return [allMin, allMax];
  }, [selectedParams]);

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-luna-warm-gray text-sm">
        No data to display for this period.
      </div>
    );
  }

  return (
    <div className="h-72" data-testid="trend-chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F5EDE3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#6B7280' }}
            axisLine={{ stroke: '#F5EDE3' }}
          />
          <YAxis
            domain={yDomain}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            axisLine={{ stroke: '#F5EDE3' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFF8F0',
              border: '1px solid #F5EDE3',
              borderRadius: '8px',
              fontSize: '13px',
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
          />
          {selectedParams.map((param) => {
            const config = CHART_PARAMETERS[param];
            return (
              <Line
                key={param}
                type="monotone"
                dataKey={param}
                name={config.label}
                stroke={config.color}
                strokeWidth={2}
                dot={{ r: 4, fill: config.color }}
                activeDot={{ r: 6 }}
                connectNulls
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
