import { TouchableOpacity, View, Text, useColorScheme } from "react-native";
import { canTick as checkCanTick } from "@/utilities/canTickToday";

type HabitItemProps = {
  habit: any;
  onToggleCompletion: (habit: any) => void;
  selectedDate: Date;
  done: boolean;
};

export default function HabitItem({ habit, onToggleCompletion, selectedDate, done }: HabitItemProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const canTick = checkCanTick(habit, selectedDate);

  return (
    <TouchableOpacity
      onPress={() => {
        onToggleCompletion(habit);
      }}
      activeOpacity={0.7}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 12,
        backgroundColor: isDark ? "#00000c" : "#fff",
      }}
    >
      {/* Habit info */}
      <View>
        <Text style={{ color: isDark ? "#fff" : "#111", fontSize: 14, fontWeight: "500" }}>
          {habit.name}
        </Text>
        <Text style={{ color: "#9b5de5", marginTop: 4, fontSize: 12 }}>
          🔥 {habit.streak || 0} day streak
        </Text>
      </View>

      {/* Completion circle */}
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          borderWidth: 2,
          borderColor: "#9b5de5",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: done ? "#9b5de5" : "transparent",
          opacity: canTick ? 1 : 0.3,
        }}
      >
        {done && <Text style={{ color: "#fff", fontWeight: "bold" }}>✔</Text>}
      </View>
    </TouchableOpacity>
  );
}
