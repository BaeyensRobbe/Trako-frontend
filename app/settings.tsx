import { View, Text, Button, Alert, useColorScheme, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { createGlobalStyles } from "@/styles/global";
import { useState, useEffect } from "react";
import { colors } from "@/styles/colors";

export default function SettingsScreen() {
  const router = useRouter();

  const colorScheme = useColorScheme();
  const systemDark = colorScheme === "dark";
  const [isDark, setIsDark] = useState(systemDark);
  const styles = createGlobalStyles(isDark);
  const [profile, setProfile] = useState<{ name: string; email: string }>({ name: "Loading...", email: "Loading..." });

  const handleLogout = async () => {

    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          router.push("/login");
        },
      },
    ]);
  };

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
    AsyncStorage.setItem("theme", !isDark ? "dark" : "light");
  }

  // Example profile info (replace with real user info later)
  useEffect(() => {
    const fetchProfile = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const profile = await AsyncStorage.getItem("profile");
      if (profile) {
        setProfile(JSON.parse(profile));
      } else {
        setProfile({ name: "User", email: "user@example.com" });
      }
    };
    fetchProfile();
  }, []);

  return (

    <View style={styles.container}>
      <Text style={isDark ? styles.stepTitle : styles.stepTitleLight}>Settings</Text>

      {/* Profile Info Section */}
      <View
        style={{
          marginTop: 20,
          padding: 16,
          borderRadius: 16,
          backgroundColor: isDark ? "#1f2937" : "#f3f4f6",
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600", color: isDark ? "#fff" : "#111" }}>
          Profile
        </Text>
        <Text style={{ marginTop: 8, fontSize: 16, color: isDark ? "#d1d5db" : "#6b7280" }}>
          Name: {profile.name}
        </Text>
        <Text style={{ marginTop: 4, fontSize: 16, color: isDark ? "#d1d5db" : "#6b7280" }}>
          Email: {profile.email}
        </Text>
      </View>
      <View 
        style={styles.setting}>
          <Text style={isDark ? styles.settingstext : styles.settingsTextLight}>Dark theme</Text>
          <View
          style={{ borderColor: isDark ? colors.dark.primary : "#111", borderWidth: 1, borderRadius: 20, padding: 1, backgroundColor: isDark ? colors.dark.primary : "#fff", justifyContent: "center" }}>
          <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: "#fff", true: colors.dark.primary }}
          thumbColor={isDark ? "#fff" : "#111"}
        />
          </View>

      </View>

      {/* Logout Button */}
      <View style={{ marginTop: 30 }}>
        <Button title="Logout" color="#ef4444" onPress={handleLogout} />
      </View>
    </View>
  );
}
