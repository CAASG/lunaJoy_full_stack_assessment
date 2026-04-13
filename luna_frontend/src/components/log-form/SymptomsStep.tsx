/**
 * @module SymptomsStep
 * @description Step 7 of the daily log form. Captures presence and severity
 * of depression/anxiety symptoms. Severity and notes fields are conditional
 * on symptoms being present.
 */

import { Slider } from '../ui/Slider';
import { InfoTooltip } from '../ui/Tooltip';
import { SYMPTOM_SEVERITY_LABELS } from '../../utils/constants';
import type { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { CreateLogPayload } from '../../types';

interface SymptomsStepProps {
  register: UseFormRegister<CreateLogPayload>;
  setValue: UseFormSetValue<CreateLogPayload>;
  watch: UseFormWatch<CreateLogPayload>;
}

export function SymptomsStep({ register, setValue, watch }: SymptomsStepProps) {
  const symptomsPresent = watch('symptomsPresent');
  const symptomsSeverity = watch('symptomsSeverity');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-medium text-luna-dark inline-flex items-center gap-2">
          Symptoms Check
          <InfoTooltip content="Recording symptoms helps your care team understand your experience and track progress over time." />
        </h2>
        <p className="text-sm text-luna-warm-gray mt-1">
          Are you experiencing any symptoms of depression or anxiety?
          There is no judgment here — this helps track patterns.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => {
            setValue('symptomsPresent', false, { shouldValidate: true });
            setValue('symptomsSeverity', null);
            setValue('symptomsNotes', null);
          }}
          className={`px-6 py-3 rounded-xl transition-all duration-200 ${
            !symptomsPresent
              ? 'bg-luna-green-light ring-2 ring-luna-green text-luna-dark'
              : 'bg-luna-cream-dark text-luna-warm-gray hover:bg-luna-cream'
          }`}
        >
          No symptoms
        </button>
        <button
          type="button"
          onClick={() => {
            setValue('symptomsPresent', true, { shouldValidate: true });
            if (!symptomsSeverity) {
              setValue('symptomsSeverity', 1);
            }
          }}
          className={`px-6 py-3 rounded-xl transition-all duration-200 ${
            symptomsPresent
              ? 'bg-luna-lavender-light ring-2 ring-luna-lavender text-luna-dark'
              : 'bg-luna-cream-dark text-luna-warm-gray hover:bg-luna-cream'
          }`}
        >
          Yes, some symptoms
        </button>
      </div>

      {symptomsPresent && (
        <div className="space-y-4 animate-in fade-in">
          <Slider
            label="Severity"
            value={symptomsSeverity ?? 1}
            onChange={(val) => setValue('symptomsSeverity', val, { shouldValidate: true })}
            labels={SYMPTOM_SEVERITY_LABELS}
          />

          <div>
            <label htmlFor="symptomsNotes" className="block text-sm font-medium text-luna-dark mb-1">
              Describe your symptoms <span className="text-luna-warm-gray font-normal">(optional)</span>
            </label>
            <textarea
              id="symptomsNotes"
              {...register('symptomsNotes')}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-luna-cream-dark bg-white
                text-luna-dark focus:outline-none focus:ring-2 focus:ring-luna-blue focus:border-transparent
                resize-none"
              placeholder="e.g., feeling hopeless, racing thoughts, difficulty concentrating..."
            />
          </div>
        </div>
      )}
    </div>
  );
}
