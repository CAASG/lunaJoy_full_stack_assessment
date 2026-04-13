/**
 * @module ActivityStep
 * @description Step 4 of the daily log form. Captures physical activity
 * type and duration in minutes.
 */

import { ACTIVITY_TYPES } from '../../utils/constants';
import type { UseFormRegister, UseFormWatch } from 'react-hook-form';
import type { CreateLogPayload } from '../../types';

interface ActivityStepProps {
  register: UseFormRegister<CreateLogPayload>;
  watch: UseFormWatch<CreateLogPayload>;
}

export function ActivityStep({ register, watch }: ActivityStepProps) {
  const activityType = watch('activityType');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-medium text-luna-dark">Physical Activity</h2>
        <p className="text-sm text-luna-warm-gray mt-1">
          Any movement counts, even a short walk.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="activityType" className="block text-sm font-medium text-luna-dark mb-1">
            Type of activity
          </label>
          <select
            id="activityType"
            {...register('activityType')}
            className="w-full px-3 py-2 rounded-lg border border-luna-cream-dark bg-white
              text-luna-dark focus:outline-none focus:ring-2 focus:ring-luna-blue focus:border-transparent"
          >
            <option value="">Select an activity...</option>
            {ACTIVITY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="activityDurationMin" className="block text-sm font-medium text-luna-dark mb-1">
            Duration (minutes)
          </label>
          <input
            id="activityDurationMin"
            type="number"
            min="0"
            max="1440"
            {...register('activityDurationMin', { valueAsNumber: true })}
            className="w-full px-3 py-2 rounded-lg border border-luna-cream-dark bg-white
              text-luna-dark focus:outline-none focus:ring-2 focus:ring-luna-blue focus:border-transparent"
            placeholder={activityType === 'None' ? '0' : '30'}
          />
        </div>
      </div>
    </div>
  );
}
