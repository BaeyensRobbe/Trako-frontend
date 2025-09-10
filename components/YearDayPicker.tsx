import React, { useState, useEffect } from "react";
import { View } from "react-native";
import WheelPickerExpo from "react-native-wheel-picker-expo";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface YearDayPickerProps {
  yearDate: string;
  setYearDate: (date: string) => void;
}

export default function YearDayPicker({ yearDate, setYearDate }: YearDayPickerProps) {
  const initialMonthIndex = yearDate ? parseInt(yearDate.split("-")[1], 10) - 1 : 0;
  const initialDay = yearDate ? parseInt(yearDate.split("-")[2], 10) : 1;

  const [monthIndex, setMonthIndex] = useState(initialMonthIndex);
  const [day, setDay] = useState(initialDay);

  // Update parent state whenever month/day changes
  useEffect(() => {
    const month = String(monthIndex + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    setYearDate(`2025-${month}-${dayStr}`); // fixed year for yearly recurrence
  }, [monthIndex, day]);

  return (
    <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 12 }}>
      {/* Month Wheel */}
      <WheelPickerExpo
        height={200}
        width={150}
        initialSelectedIndex={initialMonthIndex}
        items={months.map((m) => ({ label: m, value: m }))}
        onChange={({ index }) => setMonthIndex(index)}
      />

      {/* Day Wheel */}
      <WheelPickerExpo
        height={200}
        width={100}
        initialSelectedIndex={initialDay - 1}
        items={Array.from({ length: 31 }, (_, i) => ({
          label: String(i + 1),
          value: i + 1,
        }))}
        onChange={({ item }) => setDay(item.value)}
      />
    </View>
  );
}
