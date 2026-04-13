/**
 * @module types
 * @description Shared TypeScript interfaces for the LunaJoy frontend.
 * These types mirror the backend API contracts to ensure type safety
 * across the full stack.
 */

/** User profile returned by the authentication API */
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

/** Authentication state managed by AuthContext */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

/** Daily mental health log entry */
export interface DailyLog {
  id: string;
  userId: string;
  logDate: string;
  moodRating: number;
  anxietyLevel: number;
  sleepHours: number;
  sleepQuality: number;
  sleepDisturbances: string | null;
  activityType: string | null;
  activityDurationMin: number;
  socialFrequency: number;
  stressLevel: number;
  symptomsPresent: boolean;
  symptomsSeverity: number | null;
  symptomsNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Payload for creating a new daily log (POST /api/log) */
export interface CreateLogPayload {
  logDate: string;
  moodRating: number;
  anxietyLevel: number;
  sleepHours: number;
  sleepQuality: number;
  sleepDisturbances?: string | null;
  activityType?: string | null;
  activityDurationMin: number;
  socialFrequency: number;
  stressLevel: number;
  symptomsPresent: boolean;
  symptomsSeverity?: number | null;
  symptomsNotes?: string | null;
}

/** Summary averages returned alongside logs */
export interface LogSummary {
  period: 'week' | 'month';
  averages: {
    moodRating: number;
    anxietyLevel: number;
    sleepHours: number;
    sleepQuality: number;
    activityDurationMin: number;
    socialFrequency: number;
    stressLevel: number;
  } | null;
}

/** Response shape for GET /api/logs */
export interface LogsResponse {
  logs: DailyLog[];
  summary: LogSummary;
}

/** Selectable chart parameters */
export type ChartParameter =
  | 'moodRating'
  | 'anxietyLevel'
  | 'sleepHours'
  | 'sleepQuality'
  | 'activityDurationMin'
  | 'socialFrequency'
  | 'stressLevel';

/** API error response shape */
export interface ApiError {
  error: {
    code: string;
    message: string;
    statusCode: number;
    timestamp?: string;
    path?: string;
  };
}
