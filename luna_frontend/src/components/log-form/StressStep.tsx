/**
 * @module StressStep
 * @description Step 6 of the daily log form. Captures self-reported
 * stress level on a 1-5 scale.
 */

import { Slider } from '../ui/Slider';
import { STRESS_LABELS } from '../../utils/constants';
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { CreateLogPayload } from '../../types';

interface StressStepProps {
  setValue: UseFormSetValue<CreateLogPayload>;
  watch: UseFormWatch<CreateLogPayload>;
}

export function StressStep({ setValue, watch }: StressStepProps) {
  const stressLevel = watch('stressLevel');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-medium text-luna-dark">Stress Level</h2>
        <p className="text-sm text-luna-warm-gray mt-1">
          It is important to acknowledge stress. How stressed do you feel?
        </p>
      </div>
      <Slider
        label="Stress"
        value={stressLevel ?? 1}
        onChange={(val) => setValue('stressLevel', val, { shouldValidate: true })}
        labels={STRESS_LABELS}
      />
    </div>
  );
}
