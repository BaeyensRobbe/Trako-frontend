// components/Header.tsx
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { createGlobalStyles } from "@/styles/global";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/styles/colors";


type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = createGlobalStyles(isDark);
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
            }}
    >
      <Text style={styles.stepTitle}>{title}</Text>
      <TouchableOpacity onPress={() => router.push("/settings")}>
        <Ionicons
          name="settings-outline"
          size={22}
          color={isDark ? "#fff" : "#000"}
        />
      </TouchableOpacity>
    </View>

  );

}
