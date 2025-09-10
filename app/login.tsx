import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, useColorScheme, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { login } from "../services/auth";
import { createGlobalStyles } from "../styles/global";
import { colors } from "@/styles/colors";



export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const styles = createGlobalStyles(isDark);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      console.log("Logging in with email:", email, password);
      await login(email, password);
      router.replace("/habits");
    } catch (e: any) {
      if (e.code === "auth/wrong-password" || e.code === "auth/user-not-found") {
        setError("Invalid email or password");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.stepTitle}>Login</Text>

      {error ? <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text> : null}


      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor={isDark ? colors.dark.textSecondary : colors.light.textSecondary}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor={isDark ? colors.dark.textSecondary : colors.light.textSecondary}
      />

      <TouchableOpacity 
        onPress={handleLogin}
        disabled={loading}
        style={{opacity: loading ? 0.6 : 1}}>
          {loading ? (
            <ActivityIndicator color={isDark ? "#fff" : "#000"} />
          ) : (
            <Text style={styles.buttonPrimary}>Login</Text>
          )}
      </TouchableOpacity>
      <View style={{ flexDirection: "row", marginTop: 20, justifyContent: "center" }}>
        <Text style={styles.text}>No account?</Text>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.purpleText}> Sign up</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}
