import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, typography } from "@/src/theme/tokens";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Home</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.title,
    fontFamily: typography.family.semibold,
  },
});
