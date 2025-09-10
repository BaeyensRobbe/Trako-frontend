import { useState, useRef, useMemo, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { createGlobalStyles } from "@/styles/global";
import { completeHabit, getHabits } from "@/services/habits";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { canTick } from "@/utilities/canTickToday";
import Header from "@/components/Header";
import CalendarDay from "@/components/CalendarDay";
import HabitItem from "@/components/HabitItem";
import { useFocusEffect } from "expo-router";
import CircularProgress from "@/components/CircularProgress";

export default function TodayScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = createGlobalStyles(isDark);

  const ITEM_WIDTH = 56;

  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const calendarRef = useRef<FlatList>(null);
  const didScrollToInitial = useRef(false);

  const generateDates = (daysBefore = 30, daysAfter = 30) => {
    const dates: Date[] = [];
    const today = new Date();
    for (let i = -daysBefore; i <= daysAfter; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      dates.push(d);
    }
    return dates;
  };
  const calendarDates = generateDates();

  const loadHabits = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const data = await getHabits();
      setHabits(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [])
  );


  const habitsForSelectedDay = useMemo(() => {
    const selDate = new Date(selectedDate);
    selDate.setHours(0, 0, 0, 0); // normalize to start of day

    return habits.filter((habit) => {
      const habitStart = new Date(habit.start_date || habit.created_at);
      habitStart.setHours(0, 0, 0, 0);

      const habitEnd = habit.end_date ? new Date(habit.end_date) : null;
      if (habitEnd) habitEnd.setHours(0, 0, 0, 0);

      // Skip habits outside start/end range
      if (selDate < habitStart) return false;
      if (habitEnd && selDate > habitEnd) return false;

      // Recurrence logic
      switch (habit.recurrence_type) {
        case "daily":
          return true;
        case "weekly":
          if (!habit.weekdays) return false;
          const dayName = selDate.toLocaleDateString("en-US", { weekday: "short" });
          return habit.weekdays.includes(dayName);
        case "monthly":
          if (!habit.month_days) return false;
          return habit.month_days.includes(selDate.getDate());
        case "yearly":
          if (!habit.year_days) return false;
          return habit.year_days.some((d: string) => {
            const y = new Date(d);
            return (
              y.getDate() === selDate.getDate() &&
              y.getMonth() === selDate.getMonth() &&
              y.getFullYear() === selDate.getFullYear()
            );
          });
        case "interval":
          if (!habit.interval_value) return false;
          const diffDays =
            (selDate.getTime() - habitStart.getTime()) / (1000 * 60 * 60 * 24);
          return diffDays >= 0 && diffDays % habit.interval_value === 0;
        default:
          return false;
      }
    });
  }, [habits, selectedDate]);

  const isSameDay = (date1: Date, date2: Date) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    return d1.getTime() === d2.getTime();
  };

  const completedCount = useMemo(() => {
    return habitsForSelectedDay.filter(habit =>
      habit.completions?.some(c => isSameDay(new Date(c.completed_at), selectedDate))
    ).length;
  }, [habitsForSelectedDay, selectedDate]);

  const progress = habitsForSelectedDay.length
    ? completedCount / habitsForSelectedDay.length
    : 0;

  const toggleCompletion = async (habit: any, date: Date) => {
    console.log("Toggling completion for habit:", habit.name, "on date:", date.toDateString());
    if (!canTick(habit, date)) return;

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      await completeHabit(habit.id, date);

      await loadHabits(); // refresh the list
    } catch (e) {
      console.error(e);
    }
  };

  const isCompleted = (habit: any) => {
    return habit.completions?.some((c: any) => isSameDay(new Date(c.completed_at), selectedDate));
  }


  const renderStepTitle = () => {
    const today = new Date();
    if (selectedDate.toDateString() === today.toDateString()) return "Today";
    return selectedDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#9b5de5" />
      </View>
    );
  }

  return (
    <View style={{ ...styles.container, flex: 1 }}>
      <Header title={renderStepTitle()} />

      {/* Horizontal calendar */}
      <FlatList
        ref={calendarRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 0, paddingVertical: 2 }}
        data={calendarDates}
        keyExtractor={(item) => item.toDateString()}
        getItemLayout={(data, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        style={{ maxHeight: 70 }}
        onLayout={() => {
          if (!didScrollToInitial.current) {
            const initialIndex = calendarDates.findIndex(
              (d) => d.toDateString() === selectedDate.toDateString()
            );
            if (initialIndex >= 0) {
              calendarRef.current?.scrollToIndex({
                index: initialIndex,
                animated: false,
                viewPosition: 0.5,
              });
              didScrollToInitial.current = true;
            }
          }
        }}
        renderItem={({ item }) => {
          return (

            <CalendarDay
              date={item}
              isSelected={selectedDate?.toDateString() === item.toDateString()}
              onPress={setSelectedDate}
              styles={styles}
            />
          );
        }}
      />

      {/* Habits for selected day */}
      {habitsForSelectedDay.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 10, color: "#9b9b9b" }}>
          No habits for this day! 🎉
        </Text>
      ) : (
        <FlatList
          data={habitsForSelectedDay}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          style={{ flex: 1 }}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: isDark ? "#333" : "#ddd" }} />
          )}
          renderItem={({ item }) => (
            <HabitItem habit={item} onToggleCompletion={(habit) => toggleCompletion(habit, selectedDate)} selectedDate={selectedDate} done={isCompleted(item)} />
          )}
        />
      )}
      {habitsForSelectedDay.length > 0 && (
        <View style={{ marginBottom: 16, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress size={32} strokeWidth={4} progress={progress} />
          <Text style={{ color: "#aaa", fontSize: 16, marginLeft: 12 }}>
            <Text style={{ color: "#fff" }}>{completedCount}</Text>
            {" / "}
            <Text style={{ color: "#fff" }}>{habitsForSelectedDay.length}</Text>
            {" habits completed"}
          </Text>
        </View>
      )}

    </View>
  );
}