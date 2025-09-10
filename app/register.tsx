import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { register } from "../services/auth";
import { createGlobalStyles } from "../styles/global";
import { colors } from "@/styles/colors";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = createGlobalStyles(isDark);

  const handleRegister = async () => {
    try {
      await register(name, email, password, passwordConfirmation);
      router.replace("/habits");
    } catch (e: any) {
      Alert.alert("Registration failed", e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.stepTitle}>Register</Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholderTextColor={isDark ? colors.dark.textSecondary : colors.light.textSecondary}
      />

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
        placeholderTextColor={isDark ? colors.dark.textSecondary : colors.light.textSecondary}
        style={styles.input}
      />

      <TextInput
        placeholder="Confirm Password"
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        secureTextEntry
        style={styles.input}
        placeholderTextColor={isDark ? colors.dark.textSecondary : colors.light.textSecondary}
      />

      <TouchableOpacity onPress={handleRegister}>
        <Text style={styles.buttonPrimary}>Register</Text>
      </TouchableOpacity>

    <Text style={[styles.text, { marginTop: 12 }]}>Already have an account?</Text>
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.purpleText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
}
