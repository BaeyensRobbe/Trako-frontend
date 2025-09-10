import { View, Text, useColorScheme } from "react-native";
import { createGlobalStyles } from "../../styles/global";
import Header from "@/components/Header";

export default function CommunityScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = createGlobalStyles(isDark);

  return (
    <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
      <Header title="Community" />
      <Text style={{ fontSize: 20, color: isDark ? "#fff" : "#000", fontWeight: "600" }}>
        🚧 Community
      </Text>
      <Text style={{ marginTop: 8, color: "#aaa" }}>
        Challenges and leaderboards coming soon!
      </Text>
    </View>
  );
}
