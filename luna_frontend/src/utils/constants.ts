/**
 * @module constants
 * @description Application-wide constants for labels, scales, and configuration.
 * Centralizes UI text and options so they remain consistent across components.
 */

/** Labels for the 1-5 mood rating scale */
export const MOOD_LABELS = ['Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'] as const;

/** Labels for the 1-5 anxiety level scale */
export const ANXIETY_LABELS = ['None', 'Mild', 'Moderate', 'High', 'Severe'] as const;

/** Labels for the 1-5 sleep quality scale */
export const SLEEP_QUALITY_LABELS = ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'] as const;

/** Labels for the 1-5 social frequency scale */
export const SOCIAL_LABELS = ['None', 'Rarely', 'Sometimes', 'Often', 'Very Frequent'] as const;

/** Labels for the 1-5 stress level scale */
export const STRESS_LABELS = ['None', 'Mild', 'Moderate', 'High', 'Extreme'] as const;

/** Labels for the 1-5 symptom severity scale */
export const SYMPTOM_SEVERITY_LABELS = ['Mild', 'Moderate', 'Noticeable', 'Significant', 'Severe'] as const;

/** Predefined activity types for the activity dropdown */
export const ACTIVITY_TYPES = [
  'Walking',
  'Running',
  'Yoga',
  'Swimming',
  'Cycling',
  'Strength Training',
  'Stretching',
  'Dancing',
  'Hiking',
  'Other',
  'None',
] as const;

/** Chart parameter display configuration */
export const CHART_PARAMETERS = {
  moodRating: { label: 'Mood', color: '#A7C7E7', min: 1, max: 5 },
  anxietyLevel: { label: 'Anxiety', color: '#C3B1E1', min: 1, max: 5 },
  sleepHours: { label: 'Sleep Hours', color: '#7BA8D4', min: 0, max: 24 },
  sleepQuality: { label: 'Sleep Quality', color: '#B5D5C5', min: 1, max: 5 },
  activityDurationMin: { label: 'Activity (min)', color: '#8FBFA8', min: 0, max: 180 },
  socialFrequency: { label: 'Social', color: '#A78DC8', min: 1, max: 5 },
  stressLevel: { label: 'Stress', color: '#D4A0A0', min: 1, max: 5 },
} as const;
