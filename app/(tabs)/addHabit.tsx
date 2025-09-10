import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { createGlobalStyles } from "@/styles/global";
import { Category, categories } from "@/constants/Categories";
import { colors } from "@/styles/colors";
import { createHabit } from "@/services/habits"; 
import YearDayPicker from "@/components/YearDayPicker";
export default function AddHabitScreen() {
  // Colors
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = createGlobalStyles(isDark);

  const [step, setStep] = useState(0);
  const steps = [
    "Category",
    "Answer Type",
    "Name + Description",
    "Frequency",
    "Start / End Dates",
  ];
  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  // Step 0 & 1 states
  const [category, setCategory] = useState<Category | null>(null);
  const [answerType, setAnswerType] = useState<"yes_no" | "quantity" | "time">("yes_no");

  // Step 2 states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Step 3 states
  const [recurrenceType, setRecurrenceType] = useState("daily");
  const [selectedWeekDays, setSelectedWeekDays] = useState<string[]>([]);
  const [selectedMonthDays, setSelectedMonthDays] = useState<number[]>([]);
  const [yearDate, setYearDate] = useState("");
  const [repeatInterval, setRepeatInterval] = useState("");

  // Step 4 states
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<number | null>(null);

  const cleanFields = async () => {
    setCategory(null);
    setAnswerType("yes_no");
    setName("");
    setDescription("");
    setRecurrenceType("daily");
    setSelectedWeekDays([]);
    setSelectedMonthDays([]);
    setYearDate("");
    setRepeatInterval("");
    setStartDate(new Date().toISOString().slice(0, 10));
    setEndDate(null);
    setStep(0);
    setIsTyping(null);
  }

  const handleSubmit = async () => {
  if (!category) return;

  // Prepare recurrence fields for the backend
  let recurrence_type = "daily";
  let weekdays: string[] | null = null;
  let month_days: number[] | null = null;
  let year_days: string[] | null = null;
  let interval_value: number | null = null;

  switch (recurrenceType) {
    case "week_days":
      recurrence_type = "weekly";
      weekdays = selectedWeekDays.length ? selectedWeekDays : null;
      break;
    case "month_days":
      recurrence_type = "monthly";
      month_days = selectedMonthDays.length ? selectedMonthDays : null;
      break;
    case "year_days":
      recurrence_type = "yearly";
      year_days = yearDate ? [yearDate] : null;
      break;
    case "repeat":
      recurrence_type = "interval";
      interval_value = parseInt(repeatInterval) || 1;
      break;
    case "every_day":
    default:
      recurrence_type = "daily";
      break;
  }

  const payload = {
    category: category.name,
    answer_type: answerType,
    name: name,
    description: description,
    recurrence_type: recurrence_type,
    weekdays: weekdays,
    month_days: month_days,
    year_days: year_days,
    interval_value: interval_value,
    start_date: startDate,
    end_date: endDate,
  };
  console.log("Submitting new habit with payload:", payload);

  try {
    const habit = await createHabit(payload);
    await cleanFields();
    console.log("Habit created:", habit);
    router.back();
  } catch (err) {
    console.error("Error creating habit:", err);
  }
};

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        {step === 0 && (
          <View>
            <Text style={styles.stepTitle}>Choose a category</Text>
            <FlatList
              data={categories}
              numColumns={2}
              keyExtractor={(item) => item.name}
              columnWrapperStyle={{
                justifyContent: "space-between",
                marginBottom: 12,
              }}
              contentContainerStyle={{ paddingBottom: 100 }}
              renderItem={({ item }) => {
                const isSelected = category?.name === item.name;
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setCategory(item);
                    }}
                    style={[
                      styles.categoryCard,
                      {
                        backgroundColor: isSelected ? "#9b5de5" : "#1f1f1f",
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: isSelected ? "#fff" : "#fff",
                        flexShrink: 1,
                      }}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        color: isSelected ? "#fff" : "#aaa",
                      }}
                    >
                      {item.icon}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}

        {step === 1 && (
          <View>
            <Text style={styles.stepTitle}>How do you want to track it?</Text>
            {["yes_no", "quantity", "time"].map((type) => {
              const isSelected = answerType === type;
              const isDisabled = type !== "yes_no"; // keep others disabled
              return (
                <TouchableOpacity
                  key={type}
                  disabled={isDisabled}
                  onPress={() => setAnswerType(type)}
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    marginTop: 12,
                    backgroundColor: isSelected ? "#9b5de5" : "#1f1f1f",
                    opacity: isDisabled ? 0.5 : 1,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 16,
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    {type === "yes_no"
                      ? "Yes / No"
                      : type === "quantity"
                        ? "Quantity (coming soon)"
                        : "Time (coming soon)"}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.stepTitle}>Name your habit</Text>
            <TextInput
              placeholder="Name"
              placeholderTextColor={
                isDark ? colors.dark.textSecondary : colors.light.textSecondary
              }
              value={name}
              onChangeText={setName}
              onFocus={() => setIsTyping(1)}
              onBlur={() => setIsTyping(null)}
              style={[
                styles.inputHabit,
                {
                  borderColor:
                    isTyping === 1 ? "#9b5de5" : colors.dark.textSecondary,
                },
              ]}
            />
            <TextInput
              placeholder="Description (optional)"
              placeholderTextColor={
                isDark ? colors.dark.textSecondary : colors.light.textSecondary
              }
              value={description}
              onChangeText={setDescription}
              onFocus={() => setIsTyping(2)}
              onBlur={() => setIsTyping(null)}
              style={[
                styles.inputHabit,
                {
                  borderColor:
                    isTyping === 2 ? "#9b5de5" : colors.dark.textSecondary,
                  marginBottom: 20,
                },
              ]}
            />
          </View>
        )}

        {step === 3 && (
          <View>
            <Text style={styles.stepTitle}>Choose Frequency</Text>

            {/* Every Day */}
            <TouchableOpacity
              onPress={() => setRecurrenceType("every_day")}
              style={{
                backgroundColor: recurrenceType === "every_day" ? "#9b5de5" : "#1f1f1f",
                paddingVertical: 14,
                borderRadius: 12,
                marginTop: 12,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600", textAlign: "center" }}>
                Every Day
              </Text>
            </TouchableOpacity>

            {/* Specific Days of Week */}
            <TouchableOpacity
              onPress={() => setRecurrenceType("week_days")}
              style={{
                backgroundColor: recurrenceType === "week_days" ? "#9b5de5" : "#1f1f1f",
                paddingVertical: 14,
                borderRadius: 12,
                marginTop: 12,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600", textAlign: "center" }}>
                Specific Days of the Week
              </Text>
            </TouchableOpacity>

            {recurrenceType === "week_days" && (
              <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 12 }}>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <TouchableOpacity
                    key={day}
                    onPress={() => {
                      setSelectedWeekDays((prev) =>
                        prev.includes(day)
                          ? prev.filter((d) => d !== day)
                          : [...prev, day]
                      );
                    }}
                    style={{
                      backgroundColor: selectedWeekDays.includes(day)
                        ? "#9b5de5"
                        : "#333",
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      borderRadius: 8,
                      margin: 4,
                    }}
                  >
                    <Text style={{ color: "#fff" }}>{day}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Specific Days of Month */}
            <TouchableOpacity
              onPress={() => setRecurrenceType("month_days")}
              style={{
                backgroundColor: recurrenceType === "month_days" ? "#9b5de5" : "#1f1f1f",
                paddingVertical: 14,
                borderRadius: 12,
                marginTop: 12,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600", textAlign: "center" }}>
                Specific Days of the Month
              </Text>
            </TouchableOpacity>

            {recurrenceType === "month_days" && (
              <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 12 }}>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <TouchableOpacity
                    key={day}
                    onPress={() => {
                      setSelectedMonthDays((prev) =>
                        prev.includes(day)
                          ? prev.filter((d) => d !== day)
                          : [...prev, day]
                      );
                    }}
                    style={{
                      backgroundColor: selectedMonthDays.includes(day)
                        ? "#9b5de5"
                        : "#333",
                      padding: 8,
                      borderRadius: 6,
                      margin: 4,
                      width: 40,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#fff" }}>{day}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Specific Days of the Year */}
            <TouchableOpacity
              onPress={() => setRecurrenceType("year_days")}
              style={{
                backgroundColor: recurrenceType === "year_days" ? "#9b5de5" : "#1f1f1f",
                paddingVertical: 14,
                borderRadius: 12,
                marginTop: 12,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600", textAlign: "center" }}>
                Specific Days of the Year
              </Text>
            </TouchableOpacity>

            {recurrenceType === "year_days" && (
              <View style={{ marginTop: 12 }}>
                {/* Replace with a proper Date Picker later */}
                <YearDayPicker yearDate={yearDate} setYearDate={setYearDate} />
              </View>
            )}

            {/* Repeat Every X Days */}
            <TouchableOpacity
              onPress={() => setRecurrenceType("repeat")}
              style={{
                backgroundColor: recurrenceType === "repeat" ? "#9b5de5" : "#1f1f1f",
                paddingVertical: 14,
                borderRadius: 12,
                marginTop: 12,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600", textAlign: "center" }}>
                Repeat Every X Days
              </Text>
            </TouchableOpacity>

            {recurrenceType === "repeat" && (
              <View style={{ marginTop: 12 }}>
                <TextInput
                  placeholder="Enter number of days"
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                  value={repeatInterval}
                  onChangeText={setRepeatInterval}
                  style={styles.inputHabit}
                />
              </View>
            )}
          </View>
        )}


        {step === 4 && (
          <View>
            <Text style={styles.stepTitle}>Start Date</Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#aaa"
              value={startDate}
              onChangeText={setStartDate}
              style={styles.inputHabit}
            />
            <Text style={styles.stepTitle}>End Date (optional)</Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#aaa"
              value={endDate || ""}
              onChangeText={setEndDate}
              style={styles.inputHabit}
            />
          </View>
        )}
      </View>

      {/* Stepper dots */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: 20,
          gap: 8,
        }}
      >
        {steps.map((_, i) => (
          <View
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: i <= step ? "#9b5de5" : "#333",
            }}
          />
        ))}
      </View>

      {/* Navigation buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 12,
        }}
      >
        {step > 0 && (
          <TouchableOpacity onPress={prevStep}>
            <Text style={styles.purpleText}>Back</Text>
          </TouchableOpacity>
        )}
        {step === 0 && (
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.purpleText}>Cancel</Text>
          </TouchableOpacity>
        )}
        {step < steps.length - 1 ? (
          <TouchableOpacity onPress={nextStep}>
            <Text style={styles.purpleText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              backgroundColor: "#9b5de5",
              borderRadius: 12,
              paddingVertical: 14,
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "700",
                fontSize: 16,
              }}
            >
              Create Habit
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}


