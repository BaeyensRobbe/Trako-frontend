import { useLayoutEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Pressable,
  useColorScheme,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { getHabits, deleteHabit, completeHabit } from "../../services/habits";
import { createGlobalStyles } from "../../styles/global";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CircularProgress from "@/components/CircularProgress";
import { canTickToday } from "@/utilities/canTickToday";
import Header from "@/components/Header";
import HabitDetails from "@/components/HabitDetails";

export default function HabitListScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [habits, setHabits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<any>(null);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = createGlobalStyles(isDark);

  const loadHabits = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const data = await getHabits();
      setHabits(data);
      console.log("Habits loaded:", data);
    } catch (e: any) {
      console.error(e);
      if (e.response?.status === 401) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (habit: any) => {
    try {
      await deleteHabit(habit.id);
      loadHabits();
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const openMenu = (habit: any) => {
    setSelectedHabit(habit);
    setMenuVisible(true);
  };

  const toggleCompletion = async (habit: any) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      await completeHabit(habit.id, new Date());
      loadHabits();
    } catch (e) {
      console.error(e);
    }
  };

  const closeMenu = () => {
    setMenuVisible(false);
    setSelectedHabit(null);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#9b5de5" />
      </View>
    );
  }

  const completedCount = habits.filter((h) => h.done).length;
  const progress = habits.length > 0 ? completedCount / habits.length : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Your Habits" />


      {/* Habit List */}
<FlatList
  data={habits}
  keyExtractor={(item) => item.id.toString()}
  contentContainerStyle={{ paddingBottom: 20 }}
  style={{ flex: 1 }}
  ItemSeparatorComponent={() => (
    <View style={{ height: 1, backgroundColor: isDark ? "#333" : "#ddd" }} />
  )}
  renderItem={({ item }) => (
//     <TouchableOpacity
//       onPress={() => openMenu(item)}
//       style={{
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         paddingVertical: 12,
//         paddingHorizontal: 8,
//       }}
//     >
//       {/* Habit info */}
//       <View>
//         <Text style={{ color: isDark ? "#fff" : "#000", fontSize: 16, fontWeight: "600" }}>
//           {item.name}
//         </Text>
//         <Text style={{ color: "#9b5de5", marginTop: 2, fontSize: 12 }}>
//           🔥 {item.streak || 0} day streak
//         </Text>
//       </View>

//       {/* Completion circle */}
//       <TouchableOpacity
//         onPress={(e) => {
//           e.stopPropagation();
//           if (canTickToday(item)) toggleCompletion(item);
//           else alert("This habit cannot be completed today.");
//         }}
//         style={{
//           width: 24,
//           height: 24,
//           borderRadius: 12,
//           borderWidth: 2,
//           borderColor: "#9b5de5",
//           justifyContent: "center",
//           alignItems: "center",
//           backgroundColor: item.done ? "#9b5de5" : "transparent",
//           opacity: canTickToday(item) ? 1 : 0.3,
//         }}
//       >
//         {item.done && <Text style={{ color: "#fff", fontWeight: "bold" }}>✔</Text>}
//       </TouchableOpacity>
//     </TouchableOpacity>
    <HabitDetails
      habit={item}
      onEdit={(habit) => router.push({ pathname: "/editHabit", params: { id: habit.id } })}
      onDelete={handleDelete}
    />
  )}
  


//       {/* Progress Summary */}
//       <View style={{ marginBottom: 16, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
//         <CircularProgress size={32} strokeWidth={4} progress={progress} />
//         <Text style={{ color: "#aaa", fontSize: 16, marginLeft: 12 }}>
//           <Text style={{ color: "#fff" }}>{completedCount}</Text>
//           {" / "}
//           <Text style={{ color: "#fff" }}>{habits.length}</Text>
//           {" habits completed"}
//         </Text>
//       </View>

/>
      {/* Modal Menu */}
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={closeMenu}
        >
          <View
            style={{
              width: 150,
              backgroundColor: "#1f1f1f",
              borderRadius: 12,
              paddingVertical: 8,
            }}
          >
            <Pressable
              onPress={() => {
                if (selectedHabit) {
                  handleDelete(selectedHabit);
                  closeMenu();
                }
              }}
              style={{ padding: 12 }}
            >
              <Text style={{ color: "red", textAlign: "center" }}>Delete</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
