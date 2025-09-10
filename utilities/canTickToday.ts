import { HabitPayload } from "../services/habits";

const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function canTickToday(habit: HabitPayload, today: Date = new Date()): boolean {
  const currentDateStr = today.toISOString().slice(0, 10); // YYYY-MM-DD
  const startDate = normalizeDate(habit.start_date);
  const endDate = normalizeDate(habit.end_date);

  // 1. Check start_date and end_date
  if (startDate && currentDateStr < startDate) return false;
  if (endDate && currentDateStr > endDate) return false;

  console.log("Checking canTickToday for habit:", habit.recurrence_type);

  switch (habit.recurrence_type) {
    case "daily":
      return true;

    case "weekly":
      if (!habit.weekdays || habit.weekdays.length === 0) return false;
      const todayWeekday = weekdayNames[today.getDay()];
      return habit.weekdays.includes(todayWeekday);

    case "monthly":
      if (!habit.month_days || habit.month_days.length === 0) return false;
      const todayDate = today.getDate(); // 1-31
      return habit.month_days.includes(todayDate);

    case "yearly":
      if (!habit.year_days || habit.year_days.length === 0) return false;
      return habit.year_days.includes(currentDateStr);

    case "interval":
      if (!habit.interval_value || !habit.start_date) return false;
      const startDate = new Date(habit.start_date);
      const diffTime = today.getTime() - startDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return diffDays % habit.interval_value === 0 && diffDays >= 0;

    default:
      return false;
  }
}

function normalizeDate(date?: string | null): string | null {
  if (!date) return null;
  return new Date(date).toISOString().slice(0, 10); // YYYY-MM-DD
}

export function canTick(habit: HabitPayload, date: Date): boolean {
  const selectedDate = new Date(date).toISOString().slice(0, 10); // YYYY-MM-DD
  const startDate = normalizeDate(habit.start_date);
  const endDate = normalizeDate(habit.end_date);
  const today = new Date().toISOString().slice(0, 10);

  // 1. Check start_date and end_date
  if (startDate && selectedDate < startDate) return false;
  if (endDate && selectedDate > endDate) return false;
  if (selectedDate && today && selectedDate > today) return false;

  // 2. 
  switch (habit.recurrence_type) {
    case "daily": 
      return true;
    case "weekly": 
      if (!habit.weekdays || habit.weekdays.length === 0) return false;
      const selectedWeekday = weekdayNames[date.getDay()];
      return habit.weekdays.includes(selectedWeekday);
    case "monthly": 
      if (!habit.month_days || habit.month_days.length === 0) return false;
      const selectedDate = date.getDate();
      return habit.month_days.includes(selectedDate);
    case "yearly":
      if (!habit.year_days || habit.year_days.length === 0) return false;
      const dateStr = date.toISOString().slice(0, 10);
      return habit.year_days.includes(dateStr);
    case "interval":
      if (!habit.interval_value || !habit.start_date) return false;
      const startDate = new Date(habit.start_date);
      const diffTime = date.getTime() - startDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return diffDays % habit.interval_value === 0 && diffDays >= 0;
    default:
      return false;
  }

}
