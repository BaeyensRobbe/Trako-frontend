// components/HabitCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getCategory } from "@/constants/Categories";

type HabitDetailsProps = {
  habit: any;
  onEdit: (habit: any) => void;
  onDelete: (habit: any) => void;
};

export default function HabitCard({ habit, onEdit, onDelete }: HabitDetailsProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const category = getCategory(habit.category);

  // Example: last 7 days visualization
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const done = habit.completions?.some(
      (c: any) => new Date(c.completed_at).toDateString() === date.toDateString()
    );
    return { date, done };
  });

  return (
    <View
      style={{
        backgroundColor: isDark ? "#1e1e1e" : "#fff",
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
      }}
    >
      {/* Header row: category + name + actions */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        {category?.icon && (
          <View
            style={{
              backgroundColor: category.color,
              width: 40,
              height: 40,
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <Image source={category.icon} style={{ width: 24, height: 24 }} resizeMode="contain" />
          </View>
        )}
        <Text style={{ flex: 1, fontSize: 16, fontWeight: "600", color: isDark ? "#fff" : "#111" }}>
          {habit.name}
        </Text>
        <TouchableOpacity onPress={() => onEdit(habit)} style={{ marginRight: 12 }}>
          <Ionicons name="create-outline" size={20} color={isDark ? "#fff" : "#000"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(habit)}>
          <Ionicons name="trash-outline" size={20} color={isDark ? "#fff" : "#000"} />
        </TouchableOpacity>
      </View>

      {/* Info row */}
      <View style={{ marginBottom: 12 }}>
        <Text style={{ color: isDark ? "#bbb" : "#444", fontSize: 13 }}>
          Recurs:{" "}
          <Text style={{ fontWeight: "600", color: isDark ? "#fff" : "#000" }}>
            {habit.recurrence_type}
          </Text>
        </Text>
        <Text style={{ color: isDark ? "#bbb" : "#444", fontSize: 13 }}>
          🔥 Streak:{" "}
          <Text style={{ fontWeight: "600", color: isDark ? "#fff" : "#000" }}>
            {habit.streak || 0} days
          </Text>
        </Text>
      </View>

      {/* Last 7 days visualization */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {last7Days.map((d, idx) => (
          <View key={idx} style={{ alignItems: "center", flex: 1 }}>
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                marginBottom: 4,
                backgroundColor: d.done ? "#9b5de5" : isDark ? "#333" : "#ddd",
              }}
            />
            <Text style={{ fontSize: 10, color: isDark ? "#aaa" : "#666" }}>
              {d.date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
