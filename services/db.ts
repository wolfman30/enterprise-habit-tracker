import { Habit, HabitEntry, HabitFrequency } from '../types';

/**
 * In a real full-stack app, this file would interact with the /api/... endpoints
 * and sync to a local IndexedDB or SQLite (via Capacitor).
 * 
 * For this demo, we mock the persistence using localStorage to ensure
 * the app is fully functional as a prototype.
 */

const STORAGE_KEYS = {
  HABITS: 'eht_habits',
  ENTRIES: 'eht_entries',
  USER: 'eht_user',
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Habits ---

export const getHabits = async (): Promise<Habit[]> => {
  await delay(100);
  const data = localStorage.getItem(STORAGE_KEYS.HABITS);
  return data ? JSON.parse(data) : [];
};

export const saveHabit = async (habit: Habit): Promise<Habit> => {
  await delay(200);
  const habits = await getHabits();
  const existingIndex = habits.findIndex(h => h.id === habit.id);
  
  if (existingIndex >= 0) {
    habits[existingIndex] = habit;
  } else {
    habits.push(habit);
  }
  
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  return habit;
};

export const deleteHabit = async (id: string): Promise<void> => {
    await delay(200);
    const habits = await getHabits();
    const newHabits = habits.filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(newHabits));
}

// --- Entries ---

export const getEntries = async (startDate: string, endDate: string): Promise<HabitEntry[]> => {
  await delay(100);
  const data = localStorage.getItem(STORAGE_KEYS.ENTRIES);
  const entries: HabitEntry[] = data ? JSON.parse(data) : [];
  
  return entries.filter(e => e.date >= startDate && e.date <= endDate);
};

export const getEntriesForHabit = async (habitId: string): Promise<HabitEntry[]> => {
    await delay(50);
    const data = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    const entries: HabitEntry[] = data ? JSON.parse(data) : [];
    return entries.filter(e => e.habit_id === habitId);
}

export const saveEntry = async (entry: HabitEntry): Promise<HabitEntry> => {
  await delay(100);
  const data = localStorage.getItem(STORAGE_KEYS.ENTRIES);
  let entries: HabitEntry[] = data ? JSON.parse(data) : [];
  
  // Upsert
  const existingIndex = entries.findIndex(e => e.habit_id === entry.habit_id && e.date === entry.date);
  if (existingIndex >= 0) {
    entries[existingIndex] = { ...entries[existingIndex], ...entry, synced: false };
  } else {
    entries.push({ ...entry, synced: false });
  }
  
  localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
  return entry;
};

// --- Seed Data ---

export const seedData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.HABITS)) {
    const defaultHabits: Habit[] = [
      {
        id: '1',
        user_id: 'user1',
        name: 'Morning Run',
        description: '30 mins cardio',
        target_value: 30,
        unit: 'mins',
        frequency: HabitFrequency.DAILY,
        archived: false,
        order: 0,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        user_id: 'user1',
        name: 'Drink Water',
        target_value: 8,
        unit: 'glasses',
        frequency: HabitFrequency.DAILY,
        archived: false,
        order: 1,
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        user_id: 'user1',
        name: 'Read Books',
        target_value: 10,
        unit: 'pages',
        frequency: HabitFrequency.DAILY,
        archived: false,
        order: 2,
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(defaultHabits));
  }
};