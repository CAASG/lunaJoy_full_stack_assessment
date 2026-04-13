/**
 * @module StepProgress
 * @description Visual progress bar showing advancement through the daily log form.
 * Displays step number, label, and a filled/unfilled bar for each step.
 */

const STEP_LABELS = [
  'Mood',
  'Anxiety',
  'Sleep',
  'Activity',
  'Social',
  'Stress',
  'Symptoms',
  'Review',
] as const;

interface StepProgressProps {
  currentStep: number;
  totalSteps?: number;
}

export function StepProgress({ currentStep, totalSteps = 8 }: StepProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-luna-warm-gray">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{STEP_LABELS[currentStep - 1] ?? ''}</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i < currentStep ? 'bg-luna-blue' : 'bg-luna-cream-dark'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
