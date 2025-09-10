// services/habits.ts
import api from './api';

export interface HabitPayload {
  category: string;
  name: string;
  description?: string;
  answer_type: "yes_no" | "quantity" | "time";
  recurrence_type: "daily" | "weekly" | "monthly" | "yearly" | "interval";
  weekdays?: string[];       // for weekly habits
  month_days?: number[];     // for monthly habits
  year_days?: string[];      // for yearly habits (YYYY-MM-DD)
  interval_value?: number;   // for "repeat every X days/weeks"
  times_per_period?: number; // optional, not currently used
  start_date?: string;       // YYYY-MM-DD
  end_date?: string;         // YYYY-MM-DD
}


export const getHabits = async () => {
  const res = await api.get('/habits');
  return res.data;
};

export const getTodayHabits = async () => {
  const res = await api.get('/habits/today');
  return res.data;
};

export const deleteHabit = async (habitId: number) => {
  try {
    const res = await api.delete(`/habits/${habitId}`);
    return res.data;
  } catch (error) {
    console.error("Failed to delete habit:", error);
    throw error;
  }
};

export const getHabitsForWeek = async (startDate: Date) => {
  const res = await api.get('/habits/week', { params: { startDate } });
  return res.data;
};

export const createHabit = async (habit: HabitPayload) => {
  const res = await api.post('/habits', habit);
  return res.data;
};

export const completeHabit = async (habitId: number, selectedDate: Date) => {
  await api.post(`/habits/${habitId}/complete`, { date: selectedDate.toISOString() });
};

export const uncompleteHabit = async (habitId: number) => {
  await api.post(`/habits/${habitId}/uncomplete`);
};
