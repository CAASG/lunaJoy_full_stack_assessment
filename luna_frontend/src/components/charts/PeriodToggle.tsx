/**
 * @module PeriodToggle
 * @description Toggle between weekly and monthly views for the trend chart.
 * Simple two-option switch with visual feedback.
 */

interface PeriodToggleProps {
  period: 'week' | 'month';
  onChange: (period: 'week' | 'month') => void;
}

export function PeriodToggle({ period, onChange }: PeriodToggleProps) {
  return (
    <div className="inline-flex rounded-lg bg-luna-cream-dark p-1">
      <button
        type="button"
        onClick={() => onChange('week')}
        className={`
          px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer
          ${period === 'week' ? 'bg-white text-luna-dark shadow-sm' : 'text-luna-warm-gray hover:text-luna-dark'}
        `}
      >
        Weekly
      </button>
      <button
        type="button"
        onClick={() => onChange('month')}
        className={`
          px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer
          ${period === 'month' ? 'bg-white text-luna-dark shadow-sm' : 'text-luna-warm-gray hover:text-luna-dark'}
        `}
      >
        Monthly
      </button>
    </div>
  );
}
