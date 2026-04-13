/**
 * @module AnxietyStep
 * @description Step 2 of the daily log form. Captures anxiety level
 * using a 1-5 slider with descriptive labels.
 */

import { Slider } from '../ui/Slider';
import { ANXIETY_LABELS } from '../../utils/constants';
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { CreateLogPayload } from '../../types';

interface AnxietyStepProps {
  setValue: UseFormSetValue<CreateLogPayload>;
  watch: UseFormWatch<CreateLogPayload>;
}

export function AnxietyStep({ setValue, watch }: AnxietyStepProps) {
  const anxietyLevel = watch('anxietyLevel');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-medium text-luna-dark">Anxiety Level</h2>
        <p className="text-sm text-luna-warm-gray mt-1">
          How would you rate your anxiety today? It is okay to feel anxious sometimes.
        </p>
      </div>
      <Slider
        label="Anxiety"
        value={anxietyLevel ?? 1}
        onChange={(val) => setValue('anxietyLevel', val, { shouldValidate: true })}
        labels={ANXIETY_LABELS}
      />
    </div>
  );
}
