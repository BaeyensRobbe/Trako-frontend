import { TouchableOpacity, Text, useColorScheme, View } from "react-native";

type CalendarDayProps = {
  date: Date;
  isSelected: boolean;
  onPress: (date: Date) => void;
};

export default function CalendarDay({
  date,
  isSelected,
  onPress,
}: CalendarDayProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const backgroundColor = isSelected
    ? "#9b5de5"
    : isDark
    ? "#2a2a2a"
    : "#f5f5f5";

  const textColor = isSelected ? "#fff" : isDark ? "#e6e6e6" : "#111";

  return (
    <TouchableOpacity
      onPress={() => onPress(date)}
      activeOpacity={0.8}
      style={{
        width: 48,
        height: 64,
        borderRadius: 12,
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 3,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: isSelected ? 4 : 1,
        borderWidth: isSelected ? 0 : 1,
        borderColor: isDark ? "#3a3a3a" : "#ddd",
      }}
    >
      {/* Weekday */}
      <Text
        style={{
          color: textColor,
          fontSize: 12,
          fontWeight: "500",
          letterSpacing: 0.3,
        }}
      >
        {date.toLocaleDateString("en-US", { weekday: "short" })}
      </Text>

      {/* Day number */}
      <Text
        style={{
          color: textColor,
          fontSize: 14,
          fontWeight: "700",
          marginTop: 2,
        }}
      >
        {date.getDate()}
      </Text>

      {/* Optional: indicator dot */}
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: isSelected ? "#fff" : "#9b5de5",
          marginTop: 4,
          opacity: isSelected ? 1 : 0.6,
        }}
      />
    </TouchableOpacity>
  );
}
