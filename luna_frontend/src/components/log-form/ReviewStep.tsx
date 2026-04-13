/**
 * @module ReviewStep
 * @description Step 8 (final) of the daily log form. Shows a summary
 * of all entered data before submission. Users can go back to edit.
 */

import { MOOD_LABELS, ANXIETY_LABELS, SLEEP_QUALITY_LABELS, SOCIAL_LABELS, STRESS_LABELS, SYMPTOM_SEVERITY_LABELS } from '../../utils/constants';
import type { CreateLogPayload } from '../../types';

interface ReviewStepProps {
  data: CreateLogPayload;
  onGoToStep: (step: number) => void;
}

/** Renders a single review item with label and value */
function ReviewItem({
  label,
  value,
  step,
  onGoToStep,
}: {
  label: string;
  value: string;
  step: number;
  onGoToStep: (step: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-luna-cream-dark last:border-0">
      <div>
        <span className="text-sm text-luna-warm-gray">{label}</span>
        <p className="text-sm font-medium text-luna-dark">{value}</p>
      </div>
      <button
        type="button"
        onClick={() => onGoToStep(step)}
        className="text-xs text-luna-blue hover:text-luna-blue-dark transition-colors"
      >
        Edit
      </button>
    </div>
  );
}

export function ReviewStep({ data, onGoToStep }: ReviewStepProps) {
  // Defensive: provide fallback values for display
  const moodLabel = MOOD_LABELS[(data.moodRating ?? 3) - 1] ?? 'Unknown';
  const anxietyLabel = ANXIETY_LABELS[(data.anxietyLevel ?? 1) - 1] ?? 'Unknown';
  const sleepQualityLabel = SLEEP_QUALITY_LABELS[(data.sleepQuality ?? 3) - 1] ?? 'Unknown';
  const socialLabel = SOCIAL_LABELS[(data.socialFrequency ?? 3) - 1] ?? 'Unknown';
  const stressLabel = STRESS_LABELS[(data.stressLevel ?? 1) - 1] ?? 'Unknown';

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-medium text-luna-dark">Review Your Entry</h2>
        <p className="text-sm text-luna-warm-gray mt-1">
          Take a moment to review before submitting. You can edit any section.
        </p>
      </div>

      <div className="bg-luna-cream rounded-xl p-4">
        <ReviewItem label="Mood" value={`${moodLabel} (${data.moodRating}/5)`} step={1} onGoToStep={onGoToStep} />
        <ReviewItem label="Anxiety" value={`${anxietyLabel} (${data.anxietyLevel}/5)`} step={2} onGoToStep={onGoToStep} />
        <ReviewItem
          label="Sleep"
          value={`${data.sleepHours ?? 0}h — ${sleepQualityLabel}${data.sleepDisturbances ? ` — ${data.sleepDisturbances}` : ''}`}
          step={3}
          onGoToStep={onGoToStep}
        />
        <ReviewItem
          label="Activity"
          value={`${data.activityType || 'None'} — ${data.activityDurationMin ?? 0} min`}
          step={4}
          onGoToStep={onGoToStep}
        />
        <ReviewItem label="Social" value={`${socialLabel} (${data.socialFrequency}/5)`} step={5} onGoToStep={onGoToStep} />
        <ReviewItem label="Stress" value={`${stressLabel} (${data.stressLevel}/5)`} step={6} onGoToStep={onGoToStep} />
        <ReviewItem
          label="Symptoms"
          value={
            data.symptomsPresent
              ? `Present — ${SYMPTOM_SEVERITY_LABELS[(data.symptomsSeverity ?? 1) - 1]}${data.symptomsNotes ? ` — ${data.symptomsNotes}` : ''}`
              : 'None reported'
          }
          step={7}
          onGoToStep={onGoToStep}
        />
      </div>

      <p className="text-center text-sm text-luna-warm-gray">
        Thank you for taking the time to check in with yourself today.
      </p>
    </div>
  );
}
