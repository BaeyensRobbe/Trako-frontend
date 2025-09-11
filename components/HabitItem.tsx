import { TouchableOpacity, View, Text, useColorScheme, Image } from "react-native";
import { canTick as checkCanTick } from "@/utilities/canTickToday";
import { getCategory } from "@/constants/Categories";
import { colors } from "@/styles/colors";

type HabitItemProps = {
  habit: any;
  onToggleCompletion: (habit: any) => void;
  selectedDate: Date;
  done: boolean;
};

export default function HabitItem({ habit, onToggleCompletion, selectedDate, done }: HabitItemProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const category = getCategory(habit.category);
  const canTick = checkCanTick(habit, selectedDate);

  return (
    <TouchableOpacity
      onPress={() => onToggleCompletion(habit)}
      activeOpacity={0.7}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 4,
        backgroundColor: isDark ? colors.dark.background : colors.light.background,
      }}
    >
      {/* Left: Icon + Name */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* Category Icon */}
        {category && (
          <View
            style={{
              backgroundColor: category.color || "#eee",
              width: 32,
              height: 32,
              borderRadius: 6,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <Image source={category.icon} style={{ width: 20, height: 20 }} />
          </View>
        )}

        {/* Habit Name */}
        <Text style={{ color: isDark ? "#fff" : "#111", fontSize: 16, fontWeight: "500" }}>
          {habit.name}
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
