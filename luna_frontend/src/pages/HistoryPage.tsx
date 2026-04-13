/**
 * @module HistoryPage
 * @description Displays a list of all past log entries for the authenticated user.
 * Each entry is expandable to show full details. Uses TanStack Query
 * for data fetching (no useEffect).
 */

import { useState } from 'react';
import { useLogs } from '../hooks/useLogs';
import { formatDisplayDate } from '../utils/formatters';
import {
  MOOD_LABELS,
  ANXIETY_LABELS,
  SLEEP_QUALITY_LABELS,
  SOCIAL_LABELS,
  STRESS_LABELS,
  SYMPTOM_SEVERITY_LABELS,
} from '../utils/constants';
import type { DailyLog } from '../types';
import { Link } from 'react-router-dom';

/** Detail row for a single field in the expanded log view */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-luna-cream-dark last:border-0">
      <span className="text-sm text-luna-warm-gray">{label}</span>
      <span className="text-sm font-medium text-luna-dark">{value}</span>
    </div>
  );
}

/** Single log entry card with expand/collapse */
function LogCard({ log }: { log: DailyLog }) {
  const [expanded, setExpanded] = useState(false);

  const moodLabel = MOOD_LABELS[(log.moodRating ?? 3) - 1] ?? 'Unknown';
  const anxietyLabel = ANXIETY_LABELS[(log.anxietyLevel ?? 1) - 1] ?? 'Unknown';
  const sleepQualityLabel = SLEEP_QUALITY_LABELS[(log.sleepQuality ?? 3) - 1] ?? 'Unknown';
  const socialLabel = SOCIAL_LABELS[(log.socialFrequency ?? 3) - 1] ?? 'Unknown';
  const stressLabel = STRESS_LABELS[(log.stressLevel ?? 1) - 1] ?? 'Unknown';

  const MOOD_EMOJIS = ['😢', '😟', '😐', '🙂', '😊'];
  const emoji = MOOD_EMOJIS[(log.moodRating ?? 3) - 1] ?? '😐';

  return (
    <div className="bg-white rounded-xl border border-luna-cream-dark overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-luna-cream transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{emoji}</span>
          <div className="text-left">
            <p className="text-sm font-medium text-luna-dark">
              {formatDisplayDate(log.logDate)}
            </p>
            <p className="text-xs text-luna-warm-gray">
              {moodLabel} — Stress: {stressLabel} — Sleep: {log.sleepHours}h
            </p>
          </div>
        </div>
        <span className={`text-luna-warm-gray transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-luna-cream-dark animate-in">
          <DetailRow label="Mood" value={`${moodLabel} (${log.moodRating}/5)`} />
          <DetailRow label="Anxiety" value={`${anxietyLabel} (${log.anxietyLevel}/5)`} />
          <DetailRow label="Sleep" value={`${log.sleepHours}h — ${sleepQualityLabel}`} />
          {log.sleepDisturbances && (
            <DetailRow label="Sleep Disturbances" value={log.sleepDisturbances} />
          )}
          <DetailRow label="Activity" value={`${log.activityType ?? 'None'} — ${log.activityDurationMin} min`} />
          <DetailRow label="Social" value={`${socialLabel} (${log.socialFrequency}/5)`} />
          <DetailRow label="Stress" value={`${stressLabel} (${log.stressLevel}/5)`} />
          <DetailRow
            label="Symptoms"
            value={
              log.symptomsPresent
                ? `Present — ${SYMPTOM_SEVERITY_LABELS[(log.symptomsSeverity ?? 1) - 1]}`
                : 'None reported'
            }
          />
          {log.symptomsNotes && (
            <DetailRow label="Symptom Notes" value={log.symptomsNotes} />
          )}
        </div>
      )}
    </div>
  );
}

export function HistoryPage() {
  const [period, setPeriod] = useState<'week' | 'month'>('month');
  const { data, isLoading, isError } = useLogs({ period });

  const logs = data?.logs ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-luna-dark">History</h1>
          <p className="text-luna-warm-gray mt-1">Review your past entries.</p>
        </div>
        <div className="inline-flex rounded-lg bg-luna-cream-dark p-1">
          <button
            type="button"
            onClick={() => setPeriod('week')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
              period === 'week' ? 'bg-white text-luna-dark shadow-sm' : 'text-luna-warm-gray'
            }`}
          >
            Week
          </button>
          <button
            type="button"
            onClick={() => setPeriod('month')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
              period === 'month' ? 'bg-white text-luna-dark shadow-sm' : 'text-luna-warm-gray'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-luna-cream-dark rounded-xl animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl bg-white border border-luna-cream-dark p-8 text-center">
          <p className="text-luna-dark font-medium mb-2">Could not load your history</p>
          <p className="text-sm text-luna-warm-gray">Try refreshing the page.</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-4">📝</p>
          <h3 className="text-lg font-medium text-luna-dark mb-2">No entries yet</h3>
          <p className="text-sm text-luna-warm-gray mb-6">
            Start tracking to see your history here.
          </p>
          <Link
            to="/log"
            className="inline-flex items-center px-6 py-2.5 bg-luna-blue text-white rounded-lg font-medium text-sm hover:bg-luna-blue-dark transition-colors cursor-pointer"
          >
            Log your first day
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <LogCard key={log.id} log={log} />
          ))}
          <p className="text-center text-sm text-luna-warm-gray">
            {logs.length} {logs.length === 1 ? 'entry' : 'entries'} in the past {period}.
          </p>
        </div>
      )}
    </div>
  );
}
