/**
 * @module SocialStep
 * @description Step 5 of the daily log form. Captures frequency of
 * social interactions on a 1-5 scale.
 */

import { Slider } from '../ui/Slider';
import { SOCIAL_LABELS } from '../../utils/constants';
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { CreateLogPayload } from '../../types';

interface SocialStepProps {
  setValue: UseFormSetValue<CreateLogPayload>;
  watch: UseFormWatch<CreateLogPayload>;
}

export function SocialStep({ setValue, watch }: SocialStepProps) {
  const socialFrequency = watch('socialFrequency');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-medium text-luna-dark">Social Interactions</h2>
        <p className="text-sm text-luna-warm-gray mt-1">
          Connection with others matters. How social were you today?
        </p>
      </div>
      <Slider
        label="Social Frequency"
        value={socialFrequency ?? 3}
        onChange={(val) => setValue('socialFrequency', val, { shouldValidate: true })}
        labels={SOCIAL_LABELS}
      />
    </div>
  );
}
