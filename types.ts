export interface User {
  id: string;
  email: string;
  workspace_id?: string;
}

export enum HabitFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  target_value: number;
  unit: string;
  frequency: HabitFrequency;
  archived: boolean;
  order: number;
  created_at: string;
}

export interface HabitEntry {
  id: string;
  habit_id: string;
  date: string; // YYYY-MM-DD
  value: number;
  notes?: string;
  synced: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export type RootStackParamList = {
  Dashboard: undefined;
  Habits: undefined;
  Reports: undefined;
  Profile: undefined;
  Login: undefined;
};