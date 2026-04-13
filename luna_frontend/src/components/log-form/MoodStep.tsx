/**
 * @module MoodStep
 * @description Step 1 of the daily log form. Captures mood rating
 * using an emoji-based picker (1-5 scale).
 */

import { EmojiRating } from '../ui/EmojiRating';
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { CreateLogPayload } from '../../types';

interface MoodStepProps {
  setValue: UseFormSetValue<CreateLogPayload>;
  watch: UseFormWatch<CreateLogPayload>;
}

export function MoodStep({ setValue, watch }: MoodStepProps) {
  const moodRating = watch('moodRating');

  return (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="text-xl font-medium text-luna-dark">How are you feeling today?</h2>
        <p className="text-sm text-luna-warm-gray mt-1">
          Choose the emoji that best represents your mood right now.
        </p>
      </div>
      <EmojiRating
        value={moodRating ?? 3}
        onChange={(val) => setValue('moodRating', val, { shouldValidate: true })}
      />
    </div>
  );
}
