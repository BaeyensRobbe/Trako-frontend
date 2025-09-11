// ./styles/global.ts
import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const createGlobalStyles = (isDark: boolean) => {
  const theme = isDark ? colors.dark : colors.light;

  return StyleSheet.create({
    // Container styles
    container: {
      flex: 1,
      justifyContent: "flex-start",
      padding: 10,
      backgroundColor: theme.background,
      paddingTop: 35
    },

    // Text styles
    stepTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "white"
    },
    stepTitleLight: {
      fontSize: 28,
      fontWeight: "700",
      color: "#111",
      marginBottom: 24,
    },
    habitTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.dark.primary,
      textAlign: "center",
      marginBottom: 24,
      marginTop: 16,
    },
    text: {
      color: "#7676ac",
      textAlign: "center",
      fontWeight: "400",
      fontSize: 16,
    },
    settingstext: {
      color: "white",
      textAlign: "left",
      fontWeight: "400",
      fontSize: 16,
      marginTop: 8,
    },
    settingsTextLight: {
      color: "#111",
      textAlign: "left",
      fontWeight: "400",
      fontSize: 16,
      marginTop: 8,
    },

    purpleText: {
      color: theme.primary,
      textAlign: "center",
      fontWeight: "600",
      fontSize: 16,
    },

    buttonText: {
      color: "#fff",
      textAlign: "center",
      fontWeight: "600",
      fontSize: 18,
    },

    input: {
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 20,
      marginTop: 16,
      fontSize: 16,
      color: "white",
      backgroundColor: theme.card,
      borderColor: theme.textSecondary,
    },
    inputHabit: {
      borderRadius: 12,
      paddingVertical: 16,
      borderWidth: 1,
      paddingHorizontal: 20,
      marginTop: 16,
      fontSize: 16,
      color: "white",
      backgroundColor: theme.background,
    },
    buttonPrimary: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingVertical: 16,
      marginTop: 24,
      color: "#fff",
      textAlign: "center",
      fontSize: 20,
      fontWeight: "600",
    },


    categoryCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 16,
      flex: 1,
      marginHorizontal: 4,
      flexDirection: "row",     // horizontal layout
      alignItems: "center",     // vertically center items
      minHeight: 60,
      width: "100%",      // ensure some height for smaller texts
    },
    categoryText: {
      fontSize: 12,
      fontWeight: "300",
      color: "white",
      flexShrink: 1,            // prevent overflow
    },
    categoryIcon: {
      fontSize: 16,
      marginLeft: 8,
      color: theme.text,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
    },
    habitCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    setting: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 16,
      maxHeight: 60,
    },
    calendarDay: {
      padding: 10,
      marginHorizontal: 2,
      borderRadius: 12,
      alignItems: "center",
      width: 42,
      height: 60,
    }
  });
};
