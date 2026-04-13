/**
 * @module SleepStep
 * @description Step 3 of the daily log form. Captures sleep patterns:
 * hours slept, quality rating, and any disturbances.
 */

import { Slider } from '../ui/Slider';
import { SLEEP_QUALITY_LABELS } from '../../utils/constants';
import type { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { CreateLogPayload } from '../../types';

interface SleepStepProps {
  register: UseFormRegister<CreateLogPayload>;
  setValue: UseFormSetValue<CreateLogPayload>;
  watch: UseFormWatch<CreateLogPayload>;
}

export function SleepStep({ register, setValue, watch }: SleepStepProps) {
  const sleepQuality = watch('sleepQuality');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-medium text-luna-dark">Sleep Patterns</h2>
        <p className="text-sm text-luna-warm-gray mt-1">
          Good sleep is a foundation for wellbeing. How did you sleep?
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="sleepHours" className="block text-sm font-medium text-luna-dark mb-1">
            Hours of sleep
          </label>
          <input
            id="sleepHours"
            type="number"
            step="0.5"
            min="0"
            max="24"
            {...register('sleepHours', { valueAsNumber: true })}
            className="w-full px-3 py-2 rounded-lg border border-luna-cream-dark bg-white
              text-luna-dark focus:outline-none focus:ring-2 focus:ring-luna-blue focus:border-transparent"
            placeholder="7.5"
          />
        </div>

        <Slider
          label="Sleep Quality"
          value={sleepQuality ?? 3}
          onChange={(val) => setValue('sleepQuality', val, { shouldValidate: true })}
          labels={SLEEP_QUALITY_LABELS}
        />

        <div>
          <label htmlFor="sleepDisturbances" className="block text-sm font-medium text-luna-dark mb-1">
            Any sleep disturbances? <span className="text-luna-warm-gray font-normal">(optional)</span>
          </label>
          <textarea
            id="sleepDisturbances"
            {...register('sleepDisturbances')}
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-luna-cream-dark bg-white
              text-luna-dark focus:outline-none focus:ring-2 focus:ring-luna-blue focus:border-transparent
              resize-none"
            placeholder="e.g., woke up twice, bad dreams..."
          />
        </div>
      </div>
    </div>
  );
}
