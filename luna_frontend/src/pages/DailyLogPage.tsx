/**
 * @module DailyLogPage
 * @description Multi-step daily log form for recording mental health status.
 * Orchestrates 8 steps (7 data fields + review) using react-hook-form
 * for state and TanStack Query useMutation for submission.
 *
 * IMPORTANT: No useEffect is used. Form state is managed by react-hook-form,
 * step navigation by local useState, and API calls by useMutation.
 */

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiClient } from '../api/client';
import { getTodayISO } from '../utils/formatters';
import type { CreateLogPayload, DailyLog } from '../types';
import { StepProgress } from '../components/log-form/StepProgress';
import { MoodStep } from '../components/log-form/MoodStep';
import { AnxietyStep } from '../components/log-form/AnxietyStep';
import { SleepStep } from '../components/log-form/SleepStep';
import { ActivityStep } from '../components/log-form/ActivityStep';
import { SocialStep } from '../components/log-form/SocialStep';
import { StressStep } from '../components/log-form/StressStep';
import { SymptomsStep } from '../components/log-form/SymptomsStep';
import { ReviewStep } from '../components/log-form/ReviewStep';
import { Button } from '../components/ui/Button';

const TOTAL_STEPS = 8;

export function DailyLogPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const { register, setValue, watch, handleSubmit, getValues } =
    useForm<CreateLogPayload>({
      defaultValues: {
        logDate: getTodayISO(),
        moodRating: 3,
        anxietyLevel: 1,
        sleepHours: 7,
        sleepQuality: 3,
        sleepDisturbances: null,
        activityType: null,
        activityDurationMin: 0,
        socialFrequency: 3,
        stressLevel: 1,
        symptomsPresent: false,
        symptomsSeverity: null,
        symptomsNotes: null,
      },
    });

  /** Submit log to backend via TanStack Query mutation (no useEffect) */
  const submitMutation = useMutation({
    mutationFn: async (data: CreateLogPayload) => {
      const response = await apiClient.post<{ log: DailyLog }>('/log', data);
      return response.data.log;
    },
    onSuccess: () => {
      toast.success('Thank you for checking in today! Your entry has been saved.');
      navigate('/dashboard');
    },
    onError: () => {
      toast.error('Could not save your entry. Please try again.');
    },
  });

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1));
  const goToStep = (step: number) => setCurrentStep(step);

  const onSubmit = handleSubmit((data) => {
    submitMutation.mutate(data);
  });

  /** Renders the current step component based on step number */
  const stepContent = useMemo(() => {
    switch (currentStep) {
      case 1:
        return <MoodStep setValue={setValue} watch={watch} />;
      case 2:
        return <AnxietyStep setValue={setValue} watch={watch} />;
      case 3:
        return <SleepStep register={register} setValue={setValue} watch={watch} />;
      case 4:
        return <ActivityStep register={register} watch={watch} />;
      case 5:
        return <SocialStep setValue={setValue} watch={watch} />;
      case 6:
        return <StressStep setValue={setValue} watch={watch} />;
      case 7:
        return <SymptomsStep register={register} setValue={setValue} watch={watch} />;
      case 8:
        return <ReviewStep data={getValues()} onGoToStep={goToStep} />;
      default:
        return null;
    }
  }, [currentStep, register, setValue, watch, getValues]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-luna-dark">Daily Check-in</h1>
        <p className="text-luna-warm-gray mt-1">
          Take a moment to reflect on how you are feeling today.
        </p>
      </div>

      <StepProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />

      <form onSubmit={onSubmit}>
        <div className="rounded-xl bg-white border border-luna-cream-dark p-6 min-h-[280px]">
          {stepContent}
        </div>

        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={goBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>

          {currentStep < TOTAL_STEPS ? (
            <Button type="button" onClick={goNext}>
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? 'Saving...' : 'Submit Entry'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
